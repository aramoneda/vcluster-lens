using Microsoft.AspNetCore.Mvc;
using IcsSreVcenterDashboard.Models;
using IcsSreVcenterDashboard.Services;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace IcsSreVcenterDashboard.Controllers
{
    public class DashboardController : Controller
    {
        private readonly IVmInventoryService _inventoryService;

        public DashboardController(IVmInventoryService inventoryService)
        {
            _inventoryService = inventoryService;
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var all = await _inventoryService.GetInventoryAsync();

            double totalProvisioned = all.Sum(x => x.ProvisionedGb ?? 0);
            double totalUsed = all.Sum(x => x.UsedGb ?? 0);
            double totalMemory = all.Sum(x => x.MemoryGb ?? 0);

            var vmCount = all.Count;
            double estimatedCapacity = vmCount * 64.0;
            double memoryPercent = estimatedCapacity > 0 ? (totalMemory / estimatedCapacity) * 100 : 0;
            double storagePercent = totalProvisioned > 0 ? (totalUsed / totalProvisioned) * 100 : 0;

            var model = new DashboardSummaryViewModel
            {
                TotalVms = all.Count,
                TotalVCenters = all.Select(x => x.VCenter).Where(x => !string.IsNullOrWhiteSpace(x)).Distinct().Count(),
                PoweredOnVms = all.Count(x => string.Equals(x.PowerState, "PoweredOn", StringComparison.OrdinalIgnoreCase)),
                PoweredOffVms = all.Count(x => string.Equals(x.PowerState, "PoweredOff", StringComparison.OrdinalIgnoreCase)),
                StorageUtilizationPercent = Math.Round(storagePercent, 2),
                MemoryAllocationPercent = Math.Round(memoryPercent, 2),
                Results = new List<VmInventoryRecord>(),
                Search = new SearchViewModel()
            };

            ViewBag.VCenters = all.Select(x => x.VCenter)
                .Where(x => !string.IsNullOrWhiteSpace(x))
                .Distinct()
                .OrderBy(x => x)
                .ToList();

            return View(model);
        }

        // API: Search single VM - returns JSON
        [HttpGet]
        [Route("api/search-single-vm")]
        public async Task<IActionResult> ApiSearchSingleVm(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return Json(new { count = 0, results = new List<VmInventoryRecord>() });

            var all = await _inventoryService.GetInventoryAsync();
            var results = all.Where(vm =>
                MatchWildcard(vm.VmName, query) ||
                MatchWildcard(vm.GuestHostname, query))
                .ToList();

            return Json(new { count = results.Count, results });
        }

        // API: Search by vCenter - returns JSON
        [HttpGet]
        [Route("api/search-vcenter")]
        public async Task<IActionResult> ApiSearchVCenter(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return Json(new { count = 0, results = new List<VmInventoryRecord>() });

            var all = await _inventoryService.GetInventoryAsync();
            var results = all.Where(vm =>
                MatchWildcard(vm.VCenter, query))
                .ToList();

            return Json(new { count = results.Count, results });
        }

        // API: Search multiple VMs - returns JSON
        [HttpGet]
        [Route("api/search-multiple-vms")]
        public async Task<IActionResult> ApiSearchMultipleVms(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return Json(new { count = 0, results = new List<VmInventoryRecord>() });

            var all = await _inventoryService.GetInventoryAsync();
            var patterns = query.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries)
                .Select(x => x.Trim())
                .Where(x => !string.IsNullOrWhiteSpace(x))
                .ToList();

            var results = all.Where(vm =>
                patterns.Any(p =>
                    MatchWildcard(vm.VmName, p) ||
                    MatchWildcard(vm.GuestHostname, p)))
                .ToList();

            return Json(new { count = results.Count, results });
        }

        // API: Advanced filtering - returns JSON
        [HttpPost]
        [Route("api/advanced-filter")]
        public async Task<IActionResult> ApiAdvancedFilter([FromBody] AdvancedFilterRequest request)
        {
            var all = await _inventoryService.GetInventoryAsync();
            var results = all;

            // Filter by vCenter if provided
            if (!string.IsNullOrWhiteSpace(request.VCenter))
            {
                results = results.Where(vm => MatchWildcard(vm.VCenter, request.VCenter)).ToList();
            }

            // Filter by Power State
            if (!string.IsNullOrWhiteSpace(request.PowerState) && request.PowerState != "All")
            {
                results = results.Where(vm => string.Equals(vm.PowerState, request.PowerState, StringComparison.OrdinalIgnoreCase)).ToList();
            }

            // Filter by Guest OS
            if (!string.IsNullOrWhiteSpace(request.GuestOs) && request.GuestOs != "All OSes")
            {
                results = results.Where(vm => MatchWildcard(vm.GuestOs, request.GuestOs)).ToList();
            }

            // Filter by Tools Status
            if (!string.IsNullOrWhiteSpace(request.ToolsStatus) && request.ToolsStatus != "All")
            {
                results = results.Where(vm => string.Equals(vm.ToolsRunningStatus ?? vm.ToolsStatus, request.ToolsStatus, StringComparison.OrdinalIgnoreCase)).ToList();
            }

            // Filter by Memory range
            if (request.MemoryMin.HasValue || request.MemoryMax.HasValue)
            {
                double minMem = request.MemoryMin ?? 0;
                double maxMem = request.MemoryMax ?? double.MaxValue;
                results = results.Where(vm => (vm.MemoryGb ?? 0) >= minMem && (vm.MemoryGb ?? 0) <= maxMem).ToList();
            }

            // Filter by CPU range
            if (request.CpuMin.HasValue || request.CpuMax.HasValue)
            {
                int minCpu = request.CpuMin ?? 0;
                int maxCpu = request.CpuMax ?? int.MaxValue;
                results = results.Where(vm => (vm.NumCpu ?? 0) >= minCpu && (vm.NumCpu ?? 0) <= maxCpu).ToList();
            }

            return Json(new { count = results.Count, results });
        }

        // Export as CSV
        [HttpGet]
        [Route("api/export-csv")]
        public async Task<IActionResult> ApiExportCsv(string searchType, string query)
        {
            var all = await _inventoryService.GetInventoryAsync();
            List<VmInventoryRecord> results = new();

            if (searchType == "single")
            {
                results = all.Where(vm =>
                    MatchWildcard(vm.VmName, query) ||
                    MatchWildcard(vm.GuestHostname, query))
                    .ToList();
            }
            else if (searchType == "vcenter")
            {
                results = all.Where(vm => MatchWildcard(vm.VCenter, query)).ToList();
            }
            else if (searchType == "multiple")
            {
                var patterns = query.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries)
                    .Select(x => x.Trim())
                    .Where(x => !string.IsNullOrWhiteSpace(x))
                    .ToList();

                results = all.Where(vm =>
                    patterns.Any(p =>
                        MatchWildcard(vm.VmName, p) ||
                        MatchWildcard(vm.GuestHostname, p)))
                    .ToList();
            }

            return BuildVmCsv(results, $"vm-search-{searchType}.csv");
        }

        private FileContentResult BuildVmCsv(List<VmInventoryRecord> results, string fileName)
        {
            var sb = new StringBuilder();
            sb.AppendLine("VM Name,Power State,Hostname,vCenter,CPU,Memory GB,Provisioned GB,Used GB,ESXi Host,Cluster,Site,IP Address,Tools Status,Snapshots,Compatibility");

            foreach (var vm in results)
            {
                sb.AppendLine(string.Join(",",
                    Csv(vm.VmName),
                    Csv(vm.PowerState),
                    Csv(vm.GuestHostname),
                    Csv(vm.VCenter),
                    Csv(vm.NumCpu?.ToString()),
                    Csv(vm.MemoryGb?.ToString("F2")),
                    Csv(vm.ProvisionedGb?.ToString("F2")),
                    Csv(vm.UsedGb?.ToString("F2")),
                    Csv(vm.EsxiHost),
                    Csv(vm.Cluster),
                    Csv(vm.Site),
                    Csv(vm.IpAddress),
                    Csv(vm.ToolsRunningStatus ?? vm.ToolsStatus),
                    Csv(vm.SnapshotCount?.ToString()),
                    Csv(vm.VmCompatibility)
                ));
            }

            return File(Encoding.UTF8.GetBytes(sb.ToString()), "text/csv", fileName);
        }

        private string Csv(string? value)
        {
            value ??= "";
            value = value.Replace("\"", "\"\"");
            return $"\"{value}\"";
        }

        private bool MatchWildcard(string? input, string? pattern)
        {
            if (string.IsNullOrWhiteSpace(input) || string.IsNullOrWhiteSpace(pattern))
                return false;

            var regex = "^" + Regex.Escape(pattern).Replace("\\*", ".*") + "$";
            return Regex.IsMatch(input, regex, RegexOptions.IgnoreCase);
        }
    }

    // Request model for advanced filtering
    public class AdvancedFilterRequest
    {
        public string? VCenter { get; set; }
        public string? PowerState { get; set; }
        public string? GuestOs { get; set; }
        public string? ToolsStatus { get; set; }
        public double? MemoryMin { get; set; }
        public double? MemoryMax { get; set; }
        public int? CpuMin { get; set; }
        public int? CpuMax { get; set; }
    }
}
