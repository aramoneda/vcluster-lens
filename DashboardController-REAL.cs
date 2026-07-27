using Microsoft.AspNetCore.Mvc;
using IcsSreVcenterDashboard.Models;
using IcsSreVcenterDashboard.Services;
using System.Text.RegularExpressions;

namespace IcsSreVcenterDashboard.Controllers
{
    [ApiController]
    [Route("api")]
    public class DashboardController : ControllerBase
    {
        private readonly IVmInventoryService _vmInventoryService;

        public DashboardController(IVmInventoryService vmInventoryService)
        {
            _vmInventoryService = vmInventoryService;
        }

        [HttpGet("dashboard-summary")]
        public async Task<IActionResult> GetDashboardSummary()
        {
            try
            {
                var allVms = await _vmInventoryService.GetInventoryAsync();

                var summary = new
                {
                    totalVMs = allVms.Count(),
                    vcenters = allVms.Select(v => v.VCenter).Distinct().Count(),
                    poweredOn = allVms.Count(v => v.PowerState?.ToLower() == "poweredon"),
                    poweredOff = allVms.Count(v => v.PowerState?.ToLower() == "poweredoff"),
                    storageUtilization = CalculateStorageUtilization(allVms),
                    memoryAllocation = CalculateMemoryAllocation(allVms),
                    lastUpdated = DateTime.Now,
                    onlineCount = allVms.Count(v => v.Exists?.ToLower() == "true")
                };

                return Ok(summary);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("vcenters")]
        public async Task<IActionResult> GetVCenters()
        {
            try
            {
                var allVms = await _vmInventoryService.GetInventoryAsync();
                var vcenters = allVms
                    .Select(v => v.VCenter)
                    .Where(v => !string.IsNullOrEmpty(v))
                    .Distinct()
                    .OrderBy(v => v)
                    .ToList();

                return Ok(vcenters);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("search-single-vm")]
        public async Task<IActionResult> SearchSingleVm([FromBody] dynamic request)
        {
            try
            {
                string vmName = request?.vmName ?? "";
                if (string.IsNullOrWhiteSpace(vmName))
                {
                    return Ok(new { vms = new List<VmInventoryRecord>(), count = 0 });
                }

                var allVms = await _vmInventoryService.GetInventoryAsync();
                var pattern = WildcardToRegex(vmName);
                var regex = new Regex(pattern, RegexOptions.IgnoreCase);

                var results = allVms
                    .Where(v => !string.IsNullOrEmpty(v.VmName) && regex.IsMatch(v.VmName))
                    .ToList();

                return Ok(new { vms = results, count = results.Count() });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("search-vcenter")]
        public async Task<IActionResult> SearchByVCenter([FromBody] dynamic request)
        {
            try
            {
                string vCenter = request?.vCenter ?? "";
                string powerState = request?.powerState ?? "";
                string guestOs = request?.guestOs ?? "";
                double? minMemory = request?.minMemory;
                double? maxMemory = request?.maxMemory;
                int? minCpu = request?.minCpu;
                int? maxCpu = request?.maxCpu;
                string toolsStatus = request?.toolsStatus ?? "";

                var allVms = await _vmInventoryService.GetInventoryAsync();

                var results = allVms
                    .Where(v => string.IsNullOrEmpty(vCenter) || (v.VCenter ?? "").Equals(vCenter, StringComparison.OrdinalIgnoreCase))
                    .Where(v => string.IsNullOrEmpty(powerState) || (v.PowerState ?? "").Equals(powerState, StringComparison.OrdinalIgnoreCase))
                    .Where(v => string.IsNullOrEmpty(guestOs) || (v.GuestOs ?? "").Contains(guestOs, StringComparison.OrdinalIgnoreCase))
                    .Where(v => !minMemory.HasValue || v.MemoryGb >= minMemory)
                    .Where(v => !maxMemory.HasValue || v.MemoryGb <= maxMemory)
                    .Where(v => !minCpu.HasValue || v.NumCpu >= minCpu)
                    .Where(v => !maxCpu.HasValue || v.NumCpu <= maxCpu)
                    .Where(v => string.IsNullOrEmpty(toolsStatus) || (v.ToolsStatus ?? "").Equals(toolsStatus, StringComparison.OrdinalIgnoreCase))
                    .ToList();

                return Ok(new { vms = results, count = results.Count() });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("search-multiple-vms")]
        public async Task<IActionResult> SearchMultipleVMs([FromBody] dynamic request)
        {
            try
            {
                string vmPatterns = request?.vmPatterns ?? "";
                if (string.IsNullOrWhiteSpace(vmPatterns))
                {
                    return Ok(new { vms = new List<VmInventoryRecord>(), count = 0 });
                }

                var allVms = await _vmInventoryService.GetInventoryAsync();
                var patterns = vmPatterns.Split(new[] { "\r\n", "\r", "\n" }, StringSplitOptions.RemoveEmptyEntries);
                var results = new List<VmInventoryRecord>();

                foreach (var pattern in patterns)
                {
                    if (!string.IsNullOrWhiteSpace(pattern))
                    {
                        var regexPattern = WildcardToRegex(pattern.Trim());
                        var regex = new Regex(regexPattern, RegexOptions.IgnoreCase);
                        results.AddRange(allVms
                            .Where(v => !string.IsNullOrEmpty(v.VmName) && regex.IsMatch(v.VmName))
                            .ToList());
                    }
                }

                results = results.Distinct().ToList();
                return Ok(new { vms = results, count = results.Count() });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("export-csv")]
        public async Task<IActionResult> ExportCsv([FromBody] dynamic request)
        {
            try
            {
                var vms = ((System.Collections.IEnumerable)request?.vms)?.Cast<dynamic>() ?? new List<dynamic>();

                var csv = "VM Name,Power State,Hostname,vCenter,CPU,Memory (GB),Provisioned (GB),Used (GB),ESXi Host,Cluster,IP Address,Tools Status\n";

                foreach (var vm in vms)
                {
                    csv += $"\"{vm?.VmName}\",\"{vm?.PowerState}\",\"{vm?.GuestHostname}\",\"{vm?.VCenter}\",\"{vm?.NumCpu}\",\"{vm?.MemoryGb}\",\"{vm?.ProvisionedGb}\",\"{vm?.UsedGb}\",\"{vm?.EsxiHost}\",\"{vm?.Cluster}\",\"{vm?.IpAddress}\",\"{vm?.ToolsStatus}\"\n";
                }

                return File(System.Text.Encoding.UTF8.GetBytes(csv), "text/csv", "vm-inventory.csv");
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        private double CalculateStorageUtilization(List<VmInventoryRecord> vms)
        {
            var totalProvisioned = vms.Where(v => v.ProvisionedGb.HasValue).Sum(v => v.ProvisionedGb.Value);
            var totalUsed = vms.Where(v => v.UsedGb.HasValue).Sum(v => v.UsedGb.Value);

            if (totalProvisioned == 0) return 0;
            return Math.Round((totalUsed / totalProvisioned) * 100, 1);
        }

        private double CalculateMemoryAllocation(List<VmInventoryRecord> vms)
        {
            var totalMemory = vms.Where(v => v.MemoryGb.HasValue).Sum(v => v.MemoryGb.Value);
            var avgMemory = vms.Count > 0 ? totalMemory / vms.Count : 0;
            return Math.Round(avgMemory, 1);
        }

        private string WildcardToRegex(string pattern)
        {
            return "^" + Regex.Escape(pattern)
                .Replace("\\*", ".*")
                .Replace("\\?", ".")
                + "$";
        }
    }
}
