using Microsoft.AspNetCore.Mvc;
using IcsSreVcenterDashboard.Models;
using IcsSreVcenterDashboard.Services;
using System.Text.RegularExpressions;

namespace IcsSreVcenterDashboard.Controllers
{
    public class DashboardController : Controller
    {
        private readonly IVmInventoryService _vmService;

        public DashboardController(IVmInventoryService vmService)
        {
            _vmService = vmService;
        }

        public async Task<IActionResult> Index()
        {
            var allVms = await _vmService.GetInventoryAsync();
            
            // Calculate summary
            var summary = new
            {
                TotalVms = allVms.Count,
                VCenters = allVms.Select(v => v.VCenter).Distinct().Count(),
                PoweredOn = allVms.Count(v => v.PowerState?.ToLower() == "poweredon"),
                PoweredOff = allVms.Count(v => v.PowerState?.ToLower() == "poweredoff"),
                StorageUsed = allVms.Sum(v => v.UsedGb),
                StorageProvisioned = allVms.Sum(v => v.ProvisionedGb),
                MemoryAllocated = allVms.Sum(v => v.MemoryGb ?? 0)
            };

            ViewBag.Summary = summary;
            ViewBag.VCenters = allVms.Select(v => v.VCenter).Distinct().OrderBy(v => v).ToList();
            return View();
        }

        [HttpGet("api/dashboard-summary")]
        public async Task<IActionResult> GetDashboardSummary()
        {
            var allVms = await _vmService.GetInventoryAsync();
            
            var summary = new
            {
                totalVms = allVms.Count,
                vcenters = allVms.Select(v => v.VCenter).Distinct().Count(),
                poweredOn = allVms.Count(v => v.PowerState?.ToLower() == "poweredon"),
                poweredOff = allVms.Count(v => v.PowerState?.ToLower() == "poweredoff"),
                storageUtilization = allVms.Sum(v => v.ProvisionedGb) > 0 
                    ? Math.Round((allVms.Sum(v => v.UsedGb) / allVms.Sum(v => v.ProvisionedGb)) * 100, 1)
                    : 0,
                memoryAllocation = allVms.Sum(v => v.MemoryGb ?? 0),
                storageUsed = Math.Round(allVms.Sum(v => v.UsedGb), 2),
                storageProvisioned = Math.Round(allVms.Sum(v => v.ProvisionedGb), 2)
            };

            return Json(summary);
        }

        [HttpPost("api/search-single-vm")]
        public async Task<IActionResult> SearchSingleVm([FromBody] dynamic request)
        {
            string pattern = request?.pattern;
            if (string.IsNullOrEmpty(pattern))
                return Json(new { results = new List<object>(), count = 0 });

            var allVms = await _vmService.GetInventoryAsync();
            
            // Convert wildcard pattern to regex
            string regexPattern = "^" + Regex.Escape(pattern).Replace("\\*", ".*").Replace("\\?", ".") + "$";
            var regex = new Regex(regexPattern, RegexOptions.IgnoreCase);

            var results = allVms
                .Where(v => regex.IsMatch(v.VmName ?? ""))
                .Select(v => new
                {
                    vmName = v.VmName,
                    powerState = v.PowerState,
                    guestHostname = v.GuestHostname,
                    ipAddress = v.IpAddress,
                    vcenter = v.VCenter,
                    cluster = v.Cluster,
                    numCpu = v.NumCpu,
                    memoryGb = v.MemoryGb,
                    provisionedGb = Math.Round(v.ProvisionedGb, 2),
                    usedGb = Math.Round(v.UsedGb, 2),
                    esxiHost = v.EsxiHost,
                    guestOs = v.GuestOs,
                    toolsStatus = v.ToolsStatus,
                    site = v.Site
                })
                .ToList();

            return Json(new { results, count = results.Count });
        }

        [HttpPost("api/search-vcenter")]
        public async Task<IActionResult> SearchVCenter([FromBody] dynamic request)
        {
            string vcenter = request?.vcenter;
            if (string.IsNullOrEmpty(vcenter))
                return Json(new { results = new List<object>(), count = 0 });

            var allVms = await _vmService.GetInventoryAsync();
            
            var results = allVms
                .Where(v => v.VCenter == vcenter)
                .Select(v => new
                {
                    vmName = v.VmName,
                    powerState = v.PowerState,
                    guestHostname = v.GuestHostname,
                    ipAddress = v.IpAddress,
                    vcenter = v.VCenter,
                    cluster = v.Cluster,
                    numCpu = v.NumCpu,
                    memoryGb = v.MemoryGb,
                    provisionedGb = Math.Round(v.ProvisionedGb, 2),
                    usedGb = Math.Round(v.UsedGb, 2),
                    esxiHost = v.EsxiHost,
                    guestOs = v.GuestOs,
                    toolsStatus = v.ToolsStatus,
                    site = v.Site
                })
                .ToList();

            return Json(new { results, count = results.Count });
        }

        [HttpPost("api/advanced-filter")]
        public async Task<IActionResult> AdvancedFilter([FromBody] dynamic request)
        {
            string vcenter = request?.vcenter;
            string powerState = request?.powerState;
            string guestOs = request?.guestOs;
            string memoryRange = request?.memoryRange;
            string cpuRange = request?.cpuRange;
            string toolsStatus = request?.toolsStatus;

            var allVms = await _vmService.GetInventoryAsync();
            
            var filtered = allVms.Where(v => v.VCenter == vcenter);

            if (!string.IsNullOrEmpty(powerState) && powerState != "All")
                filtered = filtered.Where(v => v.PowerState == powerState);

            if (!string.IsNullOrEmpty(guestOs) && guestOs != "All")
                filtered = filtered.Where(v => v.GuestOs == guestOs);

            if (!string.IsNullOrEmpty(toolsStatus) && toolsStatus != "All")
                filtered = filtered.Where(v => v.ToolsStatus == toolsStatus);

            // Parse memory range
            if (!string.IsNullOrEmpty(memoryRange) && memoryRange != "All")
            {
                var memoryRanges = new Dictionary<string, (double min, double max)>
                {
                    { "0-4GB", (0, 4) },
                    { "4-8GB", (4, 8) },
                    { "8-16GB", (8, 16) },
                    { "16-32GB", (16, 32) },
                    { "32GB+", (32, double.MaxValue) }
                };

                if (memoryRanges.TryGetValue(memoryRange, out var range))
                    filtered = filtered.Where(v => (v.MemoryGb ?? 0) >= range.min && (v.MemoryGb ?? 0) < range.max);
            }

            // Parse CPU range
            if (!string.IsNullOrEmpty(cpuRange) && cpuRange != "All")
            {
                var cpuRanges = new Dictionary<string, (int min, int max)>
                {
                    { "1-2", (1, 2) },
                    { "2-4", (2, 4) },
                    { "4-8", (4, 8) },
                    { "8+", (8, int.MaxValue) }
                };

                if (cpuRanges.TryGetValue(cpuRange, out var range))
                    filtered = filtered.Where(v => (v.NumCpu ?? 0) >= range.min && (v.NumCpu ?? 0) < range.max);
            }

            var results = filtered
                .Select(v => new
                {
                    vmName = v.VmName,
                    powerState = v.PowerState,
                    guestHostname = v.GuestHostname,
                    ipAddress = v.IpAddress,
                    vcenter = v.VCenter,
                    cluster = v.Cluster,
                    numCpu = v.NumCpu,
                    memoryGb = v.MemoryGb,
                    provisionedGb = Math.Round(v.ProvisionedGb, 2),
                    usedGb = Math.Round(v.UsedGb, 2),
                    esxiHost = v.EsxiHost,
                    guestOs = v.GuestOs,
                    toolsStatus = v.ToolsStatus,
                    site = v.Site
                })
                .ToList();

            return Json(new { results, count = results.Count });
        }

        [HttpPost("api/search-multiple-vms")]
        public async Task<IActionResult> SearchMultipleVMs([FromBody] dynamic request)
        {
            string patterns = request?.patterns;
            if (string.IsNullOrEmpty(patterns))
                return Json(new { results = new List<object>(), count = 0 });

            var allVms = await _vmService.GetInventoryAsync();
            var patternList = patterns.Split(',').Select(p => p.Trim()).Where(p => !string.IsNullOrEmpty(p)).ToList();

            var results = new List<object>();
            foreach (var pattern in patternList)
            {
                string regexPattern = "^" + Regex.Escape(pattern).Replace("\\*", ".*").Replace("\\?", ".") + "$";
                var regex = new Regex(regexPattern, RegexOptions.IgnoreCase);

                var matches = allVms
                    .Where(v => regex.IsMatch(v.VmName ?? ""))
                    .Select(v => new
                    {
                        vmName = v.VmName,
                        powerState = v.PowerState,
                        guestHostname = v.GuestHostname,
                        ipAddress = v.IpAddress,
                        vcenter = v.VCenter,
                        cluster = v.Cluster,
                        numCpu = v.NumCpu,
                        memoryGb = v.MemoryGb,
                        provisionedGb = Math.Round(v.ProvisionedGb, 2),
                        usedGb = Math.Round(v.UsedGb, 2),
                        esxiHost = v.EsxiHost,
                        guestOs = v.GuestOs,
                        toolsStatus = v.ToolsStatus,
                        site = v.Site
                    });

                results.AddRange(matches);
            }

            return Json(new { results, count = results.Count });
        }

        [HttpPost("api/export-csv")]
        public async Task<IActionResult> ExportCsv([FromBody] dynamic request)
        {
            var vms = request?.vms;
            if (vms == null || vms.Count == 0)
                return BadRequest("No data to export");

            var csv = new System.Text.StringBuilder();
            csv.AppendLine("VM Name,Power State,Guest Hostname,IP Address,vCenter,Cluster,CPU,Memory (GB),Provisioned (GB),Used (GB),ESXi Host,Guest OS,Tools Status,Site");

            foreach (var vm in vms)
            {
                csv.AppendLine($"\"{vm.vmName}\",\"{vm.powerState}\",\"{vm.guestHostname}\",\"{vm.ipAddress}\",\"{vm.vcenter}\",\"{vm.cluster}\",{vm.numCpu},{vm.memoryGb},{vm.provisionedGb},{vm.usedGb},\"{vm.esxiHost}\",\"{vm.guestOs}\",\"{vm.toolsStatus}\",\"{vm.site}\"");
            }

            var bytes = System.Text.Encoding.UTF8.GetBytes(csv.ToString());
            return File(bytes, "text/csv", $"vm-export-{DateTime.Now:yyyyMMdd-HHmmss}.csv");
        }
    }
}
