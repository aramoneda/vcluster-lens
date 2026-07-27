using IcsSreVcenterDashboard.Models;
using IcsSreVcenterDashboard.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace IcsSreVcenterDashboard.Controllers
{
    public class DashboardController : Controller
    {
        private readonly IVmInventoryService _vmInventoryService;
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(IVmInventoryService vmInventoryService, ILogger<DashboardController> logger)
        {
            _vmInventoryService = vmInventoryService;
            _logger = logger;
        }

        // Main dashboard page
        public async Task<IActionResult> Index()
        {
            try
            {
                var allVms = await _vmInventoryService.GetInventoryAsync();
                
                // Get unique vCenters
                var vcenters = allVms
                    .Where(vm => !string.IsNullOrEmpty(vm.vcenter_name))
                    .Select(vm => vm.vcenter_name)
                    .Distinct()
                    .OrderBy(v => v)
                    .ToList();

                ViewBag.VCenters = vcenters;
                ViewBag.AllVMs = allVms;

                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error loading dashboard: {ex.Message}");
                ViewBag.Error = "Failed to load dashboard data";
                return View();
            }
        }

        // API: Get dashboard summary
        [HttpGet]
        [Route("api/dashboard-summary")]
        public async Task<IActionResult> GetDashboardSummary()
        {
            try
            {
                var allVms = await _vmInventoryService.GetInventoryAsync();

                var summary = new
                {
                    totalVms = allVms.Count,
                    vcenters = allVms.Select(v => v.vcenter_name).Distinct().Count(),
                    poweredOn = allVms.Count(v => v.power_state == "poweredOn"),
                    poweredOff = allVms.Count(v => v.power_state == "poweredOff"),
                    storageUtilization = CalculateStorageUtilization(allVms),
                    memoryAllocation = CalculateMemoryAllocation(allVms),
                    lastUpdated = DateTime.Now
                };

                return Json(summary);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting dashboard summary: {ex.Message}");
                return Json(new { error = ex.Message });
            }
        }

        // API: Search single VM
        [HttpPost]
        [Route("api/search-single-vm")]
        public async Task<IActionResult> SearchSingleVm([FromBody] SearchRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.SearchTerm))
                    return Json(new { data = new List<VmInventoryRecord>() });

                var allVms = await _vmInventoryService.GetInventoryAsync();
                var searchPattern = request.SearchTerm.ToLower();

                var results = allVms.Where(vm =>
                    (vm.vm_name?.ToLower() ?? "").Contains(searchPattern) ||
                    (vm.guest_hostname?.ToLower() ?? "").Contains(searchPattern)
                ).ToList();

                return Json(new { data = results, count = results.Count });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error searching single VM: {ex.Message}");
                return Json(new { error = ex.Message });
            }
        }

        // API: Get vCenter data with optional advanced filters
        [HttpPost]
        [Route("api/search-vcenter")]
        public async Task<IActionResult> SearchVCenter([FromBody] VCenterSearchRequest request)
        {
            try
            {
                var allVms = await _vmInventoryService.GetInventoryAsync();
                
                var results = allVms.Where(vm => vm.vcenter_name == request.VCenterName).ToList();

                // Apply advanced filters
                if (!string.IsNullOrEmpty(request.PowerState))
                    results = results.Where(vm => vm.power_state == request.PowerState).ToList();

                if (!string.IsNullOrEmpty(request.GuestOs))
                    results = results.Where(vm => (vm.guest_os ?? "").Contains(request.GuestOs)).ToList();

                if (request.MinMemory.HasValue)
                    results = results.Where(vm => vm.memory_gb >= request.MinMemory).ToList();

                if (request.MaxMemory.HasValue)
                    results = results.Where(vm => vm.memory_gb <= request.MaxMemory).ToList();

                if (request.MinCpu.HasValue)
                    results = results.Where(vm => vm.cpu_cores >= request.MinCpu).ToList();

                if (request.MaxCpu.HasValue)
                    results = results.Where(vm => vm.cpu_cores <= request.MaxCpu).ToList();

                if (!string.IsNullOrEmpty(request.ToolsStatus))
                    results = results.Where(vm => (vm.tools_status ?? "").Contains(request.ToolsStatus)).ToList();

                return Json(new { data = results, count = results.Count });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error searching vCenter: {ex.Message}");
                return Json(new { error = ex.Message });
            }
        }

        // API: Search multiple VMs
        [HttpPost]
        [Route("api/search-multiple-vms")]
        public async Task<IActionResult> SearchMultipleVMs([FromBody] MultiSearchRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.SearchTerms))
                    return Json(new { data = new List<VmInventoryRecord>() });

                var allVms = await _vmInventoryService.GetInventoryAsync();
                var terms = request.SearchTerms.Split(',').Select(t => t.Trim().ToLower()).Where(t => !string.IsNullOrEmpty(t)).ToList();

                var results = allVms.Where(vm =>
                    terms.Any(term =>
                        (vm.vm_name?.ToLower() ?? "").Contains(term) ||
                        (vm.guest_hostname?.ToLower() ?? "").Contains(term)
                    )
                ).ToList();

                return Json(new { data = results, count = results.Count });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error searching multiple VMs: {ex.Message}");
                return Json(new { error = ex.Message });
            }
        }

        // API: Export to CSV
        [HttpPost]
        [Route("api/export-csv")]
        public async Task<IActionResult> ExportCsv([FromBody] ExportRequest request)
        {
            try
            {
                var allVms = await _vmInventoryService.GetInventoryAsync();
                var csv = new System.Text.StringBuilder();

                // Header
                csv.AppendLine("VM Name,Power State,Hostname,vCenter,CPU Cores,Memory GB,Provisioned GB,Used GB,ESXi Host,Cluster,IP Address,Tools Status");

                // Data
                foreach (var vm in allVms)
                {
                    csv.AppendLine($"\"{vm.vm_name}\",\"{vm.power_state}\",\"{vm.guest_hostname}\",\"{vm.vcenter_name}\",{vm.cpu_cores},{vm.memory_gb},{vm.storage_provisioned_gb},{vm.storage_used_gb},\"{vm.esxi_host}\",\"{vm.cluster_name}\",\"{vm.ip_address}\",\"{vm.tools_status}\"");
                }

                var bytes = System.Text.Encoding.UTF8.GetBytes(csv.ToString());
                return File(bytes, "text/csv", $"vm-inventory-{DateTime.Now:yyyyMMdd-HHmmss}.csv");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error exporting CSV: {ex.Message}");
                return Json(new { error = ex.Message });
            }
        }

        private double CalculateStorageUtilization(List<VmInventoryRecord> vms)
        {
            var totalProvisioned = vms.Sum(v => v.storage_provisioned_gb ?? 0);
            if (totalProvisioned == 0) return 0;
            var totalUsed = vms.Sum(v => v.storage_used_gb ?? 0);
            return Math.Round((totalUsed / totalProvisioned) * 100, 1);
        }

        private double CalculateMemoryAllocation(List<VmInventoryRecord> vms)
        {
            var count = vms.Count;
            if (count == 0) return 0;
            var avgMemory = vms.Average(v => v.memory_gb ?? 0);
            return Math.Round(avgMemory, 1);
        }
    }

    public class SearchRequest
    {
        public string SearchTerm { get; set; }
    }

    public class VCenterSearchRequest
    {
        public string VCenterName { get; set; }
        public string PowerState { get; set; }
        public string GuestOs { get; set; }
        public double? MinMemory { get; set; }
        public double? MaxMemory { get; set; }
        public int? MinCpu { get; set; }
        public int? MaxCpu { get; set; }
        public string ToolsStatus { get; set; }
    }

    public class MultiSearchRequest
    {
        public string SearchTerms { get; set; }
    }

    public class ExportRequest
    {
        public List<VmInventoryRecord> Vms { get; set; }
    }
}
