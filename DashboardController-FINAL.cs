using IcsSreVcenterDashboard.Models;
using IcsSreVcenterDashboard.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace IcsSreVcenterDashboard.Controllers
{
    public class DashboardController : Controller
    {
        private readonly IVmInventoryService _vmService;
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(IVmInventoryService vmService, ILogger<DashboardController> logger)
        {
            _vmService = vmService;
            _logger = logger;
        }

        public async Task<IActionResult> Index()
        {
            try
            {
                _logger.LogInformation("Dashboard Index called");
                var vms = await _vmService.GetAllVmsAsync();
                
                if (vms == null || vms.Count == 0)
                {
                    _logger.LogWarning("No VMs found in inventory");
                    ViewBag.VCenters = new List<string>();
                    return View();
                }

                // Get unique vCenters
                var vcenters = vms
                    .Where(v => !string.IsNullOrEmpty(v.VCenter))
                    .Select(v => v.VCenter)
                    .Distinct()
                    .OrderBy(v => v)
                    .ToList();

                ViewBag.VCenters = vcenters;
                _logger.LogInformation($"Found {vms.Count} VMs and {vcenters.Count} vCenters");
                
                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in Dashboard Index");
                ViewBag.VCenters = new List<string>();
                ViewBag.Error = ex.Message;
                return View();
            }
        }

        [HttpPost]
        public async Task<IActionResult> GetDashboardSummary()
        {
            try
            {
                var vms = await _vmService.GetAllVmsAsync();
                
                if (vms == null || vms.Count == 0)
                {
                    return Json(new
                    {
                        totalVms = 0,
                        totalVCenters = 0,
                        poweredOn = 0,
                        poweredOff = 0,
                        storageUtilization = 0,
                        memoryAllocation = 0,
                        online = 0
                    });
                }

                var vcenters = vms.Select(v => v.VCenter).Distinct().Count();
                var poweredOn = vms.Count(v => v.PowerState?.ToLower() == "poweredon");
                var poweredOff = vms.Count(v => v.PowerState?.ToLower() == "poweredoff");
                var totalStorage = vms.Sum(v => v.ProvisionedGB ?? 0);
                var usedStorage = vms.Sum(v => v.UsedGB ?? 0);
                var totalMemory = vms.Sum(v => v.MemoryGB ?? 0);
                var usedMemory = vms.Sum(v => (v.MemoryGB ?? 0) * 0.7); // Approximation
                var storageUtil = totalStorage > 0 ? (usedStorage / totalStorage) * 100 : 0;
                var memoryUtil = totalMemory > 0 ? (usedMemory / totalMemory) * 100 : 0;

                return Json(new
                {
                    totalVms = vms.Count,
                    totalVCenters = vcenters,
                    poweredOn = poweredOn,
                    poweredOff = poweredOff,
                    storageUtilization = Math.Round(storageUtil, 1),
                    memoryAllocation = Math.Round(memoryUtil, 1),
                    online = poweredOn
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting dashboard summary");
                return Json(new { error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> SearchSingleVm(string vmName)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(vmName))
                    return Json(new { success = false, message = "VM name required", results = new List<object>() });

                var vms = await _vmService.GetAllVmsAsync();
                var pattern = vmName.Replace("*", ".*");
                var regex = new System.Text.RegularExpressions.Regex($"^{pattern}$", System.Text.RegularExpressions.RegexOptions.IgnoreCase);

                var results = vms
                    .Where(v => regex.IsMatch(v.VmName ?? ""))
                    .Select(v => new
                    {
                        v.VmName,
                        v.PowerState,
                        v.Hostname,
                        v.VCenter,
                        v.CpuCores,
                        v.MemoryGB,
                        v.ProvisionedGB,
                        v.UsedGB,
                        v.EsxiHost,
                        v.Cluster,
                        v.IpAddress,
                        v.ToolsStatus
                    })
                    .ToList();

                return Json(new { success = true, message = $"Found {results.Count} VM(s)", results });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching single VM");
                return Json(new { success = false, message = ex.Message, results = new List<object>() });
            }
        }

        [HttpPost]
        public async Task<IActionResult> SearchByVCenter(string vCenter)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(vCenter))
                    return Json(new { success = false, message = "vCenter required", results = new List<object>() });

                var vms = await _vmService.GetAllVmsAsync();
                var results = vms
                    .Where(v => v.VCenter?.Equals(vCenter, StringComparison.OrdinalIgnoreCase) == true)
                    .Select(v => new
                    {
                        v.VmName,
                        v.PowerState,
                        v.Hostname,
                        v.VCenter,
                        v.CpuCores,
                        v.MemoryGB,
                        v.ProvisionedGB,
                        v.UsedGB,
                        v.EsxiHost,
                        v.Cluster,
                        v.IpAddress,
                        v.ToolsStatus
                    })
                    .ToList();

                return Json(new { success = true, message = $"Found {results.Count} VM(s)", results });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching by vCenter");
                return Json(new { success = false, message = ex.Message, results = new List<object>() });
            }
        }

        [HttpPost]
        public async Task<IActionResult> ApplyAdvancedFilters(
            string vCenter,
            string powerState = "",
            string guestOs = "",
            string toolsStatus = "",
            int? minMemory = null,
            int? maxMemory = null,
            int? minCpu = null,
            int? maxCpu = null)
        {
            try
            {
                var vms = await _vmService.GetAllVmsAsync();

                var results = vms
                    .Where(v => v.VCenter?.Equals(vCenter, StringComparison.OrdinalIgnoreCase) == true)
                    .Where(v => string.IsNullOrEmpty(powerState) || v.PowerState?.Equals(powerState, StringComparison.OrdinalIgnoreCase) == true)
                    .Where(v => string.IsNullOrEmpty(guestOs) || v.GuestOs?.Equals(guestOs, StringComparison.OrdinalIgnoreCase) == true)
                    .Where(v => string.IsNullOrEmpty(toolsStatus) || v.ToolsStatus?.Equals(toolsStatus, StringComparison.OrdinalIgnoreCase) == true)
                    .Where(v => !minMemory.HasValue || (v.MemoryGB ?? 0) >= minMemory)
                    .Where(v => !maxMemory.HasValue || (v.MemoryGB ?? 0) <= maxMemory)
                    .Where(v => !minCpu.HasValue || (v.CpuCores ?? 0) >= minCpu)
                    .Where(v => !maxCpu.HasValue || (v.CpuCores ?? 0) <= maxCpu)
                    .Select(v => new
                    {
                        v.VmName,
                        v.PowerState,
                        v.Hostname,
                        v.VCenter,
                        v.CpuCores,
                        v.MemoryGB,
                        v.ProvisionedGB,
                        v.UsedGB,
                        v.EsxiHost,
                        v.Cluster,
                        v.IpAddress,
                        v.ToolsStatus
                    })
                    .ToList();

                return Json(new { success = true, message = $"Found {results.Count} VM(s)", results });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error applying advanced filters");
                return Json(new { success = false, message = ex.Message, results = new List<object>() });
            }
        }

        [HttpPost]
        public async Task<IActionResult> SearchMultipleVms(string vmPatterns)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(vmPatterns))
                    return Json(new { success = false, message = "VM patterns required", results = new List<object>() });

                var patterns = vmPatterns.Split('\n', StringSplitOptions.RemoveEmptyEntries)
                    .Select(p => p.Trim())
                    .ToList();

                var vms = await _vmService.GetAllVmsAsync();
                var results = new List<object>();

                foreach (var pattern in patterns)
                {
                    var regexPattern = pattern.Replace("*", ".*");
                    var regex = new System.Text.RegularExpressions.Regex($"^{regexPattern}$", System.Text.RegularExpressions.RegexOptions.IgnoreCase);

                    var matches = vms
                        .Where(v => regex.IsMatch(v.VmName ?? ""))
                        .Select(v => new
                        {
                            v.VmName,
                            v.PowerState,
                            v.Hostname,
                            v.VCenter,
                            v.CpuCores,
                            v.MemoryGB,
                            v.ProvisionedGB,
                            v.UsedGB,
                            v.EsxiHost,
                            v.Cluster,
                            v.IpAddress,
                            v.ToolsStatus
                        })
                        .ToList();

                    results.AddRange(matches);
                }

                return Json(new { success = true, message = $"Found {results.Count} VM(s)", results });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching multiple VMs");
                return Json(new { success = false, message = ex.Message, results = new List<object>() });
            }
        }

        [HttpPost]
        public async Task<IActionResult> ExportCsv()
        {
            try
            {
                var vms = await _vmService.GetAllVmsAsync();

                if (vms == null || vms.Count == 0)
                    return BadRequest("No data to export");

                var csv = "VM Name,Power State,Hostname,vCenter,CPU Cores,Memory (GB),Provisioned (GB),Used (GB),ESXi Host,Cluster,IP Address,Tools Status\n";

                foreach (var vm in vms)
                {
                    csv += $"\"{vm.VmName}\",\"{vm.PowerState}\",\"{vm.Hostname}\",\"{vm.VCenter}\",{vm.CpuCores},{vm.MemoryGB},{vm.ProvisionedGB},{vm.UsedGB},\"{vm.EsxiHost}\",\"{vm.Cluster}\",\"{vm.IpAddress}\",\"{vm.ToolsStatus}\"\n";
                }

                var bytes = System.Text.Encoding.UTF8.GetBytes(csv);
                return File(bytes, "text/csv", $"vm-inventory-{DateTime.Now:yyyy-MM-dd-HHmmss}.csv");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error exporting CSV");
                return BadRequest(ex.Message);
            }
        }
    }
}
