using Microsoft.AspNetCore.Mvc;
using IcsSreVcenterDashboard.Models;
using IcsSreVcenterDashboard.Services;
using System.Text.Json;

namespace IcsSreVcenterDashboard.Controllers
{
    [ApiController]
    [Route("api")]
    public class DashboardController : ControllerBase
    {
        private readonly IVmInventoryService _vmInventoryService;
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(IVmInventoryService vmInventoryService, ILogger<DashboardController> logger)
        {
            _vmInventoryService = vmInventoryService;
            _logger = logger;
        }

        [HttpGet("dashboard-summary")]
        public async Task<IActionResult> GetDashboardSummary()
        {
            try
            {
                var vms = await _vmInventoryService.GetInventoryAsync();

                if (vms == null || !vms.Any())
                {
                    return Ok(new
                    {
                        totalVms = 0,
                        vcenters = 0,
                        poweredOn = 0,
                        poweredOff = 0,
                        storageUtilization = "0%",
                        memoryAllocation = "0%",
                        totalStorageUsed = 0,
                        totalStorageProvisioned = 0,
                        totalMemoryGb = 0
                    });
                }

                var distinctVCenters = vms.Select(v => v.VCenter).Distinct().Count();
                var poweredOnCount = vms.Count(v => v.PowerState == "PoweredOn");
                var poweredOffCount = vms.Count(v => v.PowerState == "PoweredOff");
                var totalStorageUsed = vms.Sum(v => v.UsedGb);
                var totalStorageProvisioned = vms.Sum(v => v.ProvisionedGb);
                var totalMemory = vms.Sum(v => v.MemoryGb ?? 0);
                var storageUtilization = totalStorageProvisioned > 0 ? (totalStorageUsed / totalStorageProvisioned * 100) : 0;
                var memoryAllocation = vms.Count > 0 ? (totalMemory / (vms.Count * 16) * 100) : 0; // Assuming 16GB average

                return Ok(new
                {
                    totalVms = vms.Count,
                    vcenters = distinctVCenters,
                    poweredOn = poweredOnCount,
                    poweredOff = poweredOffCount,
                    storageUtilization = Math.Round(storageUtilization, 1),
                    memoryAllocation = Math.Round(memoryAllocation, 1),
                    totalStorageUsed = Math.Round(totalStorageUsed, 2),
                    totalStorageProvisioned = Math.Round(totalStorageProvisioned, 2),
                    totalMemoryGb = Math.Round(totalMemory, 2)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading dashboard summary");
                return StatusCode(500, new { error = "Failed to load dashboard data" });
            }
        }

        [HttpGet("vcenters")]
        public async Task<IActionResult> GetVCenters()
        {
            try
            {
                var vms = await _vmInventoryService.GetInventoryAsync();
                var vcenters = vms?.Select(v => v.VCenter).Distinct().OrderBy(v => v).ToList() ?? new List<string>();

                return Ok(new { vcenters });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading vcenters");
                return StatusCode(500, new { error = "Failed to load vcenters" });
            }
        }

        [HttpPost("search-single-vm")]
        public async Task<IActionResult> SearchSingleVm([FromBody] dynamic request)
        {
            try
            {
                string pattern = request?.pattern?.ToString() ?? "";
                var vms = await _vmInventoryService.GetInventoryAsync();

                var results = vms?.Where(v => 
                    v.VmName != null && v.VmName.Contains(pattern, StringComparison.OrdinalIgnoreCase)
                ).Select(v => new
                {
                    v.VmName,
                    v.PowerState,
                    v.GuestHostname,
                    v.IpAddress,
                    v.VCenter,
                    v.Cluster,
                    v.NumCpu,
                    v.MemoryGb,
                    v.ProvisionedGb,
                    v.UsedGb,
                    v.EsxiHost,
                    v.GuestOs,
                    v.ToolsStatus,
                    v.BackupStatus,
                    v.RecentEventCount
                }).ToList() ?? new List<dynamic>();

                return Ok(new { count = results.Count, results });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching single VM");
                return StatusCode(500, new { error = "Search failed" });
            }
        }

        [HttpPost("search-vcenter")]
        public async Task<IActionResult> SearchVCenter([FromBody] dynamic request)
        {
            try
            {
                string vcenter = request?.vcenter?.ToString() ?? "";
                var vms = await _vmInventoryService.GetInventoryAsync();

                var results = vms?.Where(v => v.VCenter == vcenter)
                    .Select(v => new
                    {
                        v.VmName,
                        v.PowerState,
                        v.GuestHostname,
                        v.IpAddress,
                        v.VCenter,
                        v.Cluster,
                        v.NumCpu,
                        v.MemoryGb,
                        v.ProvisionedGb,
                        v.UsedGb,
                        v.EsxiHost,
                        v.GuestOs,
                        v.ToolsStatus,
                        v.BackupStatus,
                        v.RecentEventCount
                    }).ToList() ?? new List<dynamic>();

                return Ok(new { count = results.Count, results });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching vCenter");
                return StatusCode(500, new { error = "Search failed" });
            }
        }

        [HttpPost("vm-details")]
        public async Task<IActionResult> GetVmDetails([FromBody] dynamic request)
        {
            try
            {
                string vmName = request?.vmName?.ToString() ?? "";
                var vms = await _vmInventoryService.GetInventoryAsync();
                var vm = vms?.FirstOrDefault(v => v.VmName == vmName);

                if (vm == null)
                    return NotFound(new { error = "VM not found" });

                return Ok(new
                {
                    vm.VmName,
                    vm.PowerState,
                    vm.GuestHostname,
                    vm.IpAddress,
                    vm.VCenter,
                    vm.Cluster,
                    vm.NumCpu,
                    vm.MemoryGb,
                    vm.ProvisionedGb,
                    vm.UsedGb,
                    vm.EsxiHost,
                    vm.GuestOs,
                    vm.ToolsStatus,
                    vm.HasSnapshot,
                    vm.SnapshotCount,
                    // Backup Data
                    vm.BackupServer,
                    vm.BackupPolicy,
                    vm.BackupStatus,
                    vm.BackupStartTime,
                    vm.BackupEndTime,
                    vm.BackupType,
                    vm.BackupSchedule,
                    vm.BackupDuration,
                    vm.IbmStatus,
                    vm.IbmLastRunTime,
                    vm.PpdmBackups,
                    // Events
                    vm.RecentEventCount,
                    vm.RecentEvents,
                    vm.RecentBackupEvents
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting VM details");
                return StatusCode(500, new { error = "Failed to get VM details" });
            }
        }

        [HttpPost("export-csv")]
        public async Task<IActionResult> ExportCsv([FromBody] dynamic request)
        {
            try
            {
                var vms = await _vmInventoryService.GetInventoryAsync();
                var resultsJson = request?.results?.ToString() ?? "[]";
                var results = JsonSerializer.Deserialize<List<Dictionary<string, object>>>(resultsJson) ?? new List<Dictionary<string, object>>();

                var csv = new System.Text.StringBuilder();
                csv.AppendLine("VM Name,Power State,Hostname,IP Address,vCenter,Cluster,CPU,Memory GB,Provisioned GB,Used GB,ESXi Host,Guest OS,Tools Status,Backup Status,Recent Events");

                foreach (var result in results)
                {
                    csv.AppendLine($"\"{result.ContainsKey("VmName") ? result["VmName"] : ""}\"," +
                        $"\"{result.ContainsKey("PowerState") ? result["PowerState"] : ""}\"," +
                        $"\"{result.ContainsKey("GuestHostname") ? result["GuestHostname"] : ""}\"," +
                        $"\"{result.ContainsKey("IpAddress") ? result["IpAddress"] : ""}\"," +
                        $"\"{result.ContainsKey("VCenter") ? result["VCenter"] : ""}\"," +
                        $"\"{result.ContainsKey("Cluster") ? result["Cluster"] : ""}\"," +
                        $"{result.ContainsKey("NumCpu") ? result["NumCpu"] : ""}," +
                        $"{result.ContainsKey("MemoryGb") ? result["MemoryGb"] : ""}," +
                        $"{result.ContainsKey("ProvisionedGb") ? result["ProvisionedGb"] : ""}," +
                        $"{result.ContainsKey("UsedGb") ? result["UsedGb"] : ""}," +
                        $"\"{result.ContainsKey("EsxiHost") ? result["EsxiHost"] : ""}\"," +
                        $"\"{result.ContainsKey("GuestOs") ? result["GuestOs"] : ""}\"," +
                        $"\"{result.ContainsKey("ToolsStatus") ? result["ToolsStatus"] : ""}\"," +
                        $"\"{result.ContainsKey("BackupStatus") ? result["BackupStatus"] : ""}\"," +
                        $"{result.ContainsKey("RecentEventCount") ? result["RecentEventCount"] : "0"}");
                }

                var bytes = System.Text.Encoding.UTF8.GetBytes(csv.ToString());
                return File(bytes, "text/csv", "vm-inventory.csv");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error exporting CSV");
                return StatusCode(500, new { error = "Export failed" });
            }
        }
    }
}
