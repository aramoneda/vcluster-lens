using Microsoft.AspNetCore.Mvc;
using IcsSreVcenterDashboard.Models;
using IcsSreVcenterDashboard.Services;
using System.Text.Json;
using System.Text;

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

        public async Task<IActionResult> Index()
        {
            try
            {
                var vms = await _vmInventoryService.GetInventoryAsync();
                
                // Get unique vCenters for dropdown
                var vcenters = vms?.Where(v => !string.IsNullOrEmpty(v.VCenter))
                    .Select(v => v.VCenter)
                    .Distinct()
                    .OrderBy(v => v)
                    .ToList() ?? new List<string>();

                ViewBag.VCenters = vcenters;
                ViewBag.AllVMs = vms ?? new List<VmInventoryRecord>();

                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading dashboard");
                ViewBag.Error = "Failed to load dashboard data";
                return View();
            }
        }

        [HttpGet]
        [Route("api/dashboard-summary")]
        public async Task<IActionResult> GetDashboardSummary()
        {
            try
            {
                var vms = await _vmInventoryService.GetInventoryAsync();
                if (vms == null || !vms.Any())
                    return Json(new { error = "No data available" });

                var summary = new
                {
                    totalVms = vms.Count(),
                    vcenters = vms.Where(v => !string.IsNullOrEmpty(v.VCenter)).Select(v => v.VCenter).Distinct().Count(),
                    poweredOn = vms.Count(v => v.PowerState == "PoweredOn"),
                    poweredOff = vms.Count(v => v.PowerState == "PoweredOff"),
                    poweredOnPercent = Math.Round((double)vms.Count(v => v.PowerState == "PoweredOn") / vms.Count() * 100, 1),
                    poweredOffTb = Math.Round(vms.Where(v => v.PowerState == "PoweredOff").Sum(v => v.UsedGb ?? 0) / 1024, 1),
                    storageUsedTb = Math.Round(vms.Sum(v => v.UsedGb ?? 0) / 1024, 1),
                    storageTotalTb = Math.Round(vms.Sum(v => v.ProvisionedGb ?? 0) / 1024, 1),
                    storagePercent = Math.Round((vms.Sum(v => v.UsedGb ?? 0) / vms.Sum(v => v.ProvisionedGb ?? 0)) * 100, 1),
                    memoryUsedGb = Math.Round(vms.Sum(v => v.MemoryGb ?? 0), 1),
                    memoryPercent = Math.Round((vms.Where(v => v.PowerState == "PoweredOn").Sum(v => v.MemoryGb ?? 0) / vms.Sum(v => v.MemoryGb ?? 0)) * 100, 1),
                    lastUpdated = DateTime.Now.ToString("g")
                };

                return Json(summary);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting dashboard summary");
                return Json(new { error = ex.Message });
            }
        }

        [HttpPost]
        [Route("api/search-single-vm")]
        public async Task<IActionResult> SearchSingleVm([FromBody] SearchRequest request)
        {
            try
            {
                var vms = await _vmInventoryService.GetInventoryAsync();
                if (string.IsNullOrEmpty(request?.SearchTerm))
                    return Json(new { results = new List<object>(), count = 0 });

                var pattern = request.SearchTerm.Replace("*", ".*");
                var regex = new System.Text.RegularExpressions.Regex($"^{pattern}$", System.Text.RegularExpressions.RegexOptions.IgnoreCase);

                var results = vms?.Where(v => regex.IsMatch(v.VmName ?? ""))
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
                        provisionedGb = Math.Round(v.ProvisionedGb ?? 0, 2),
                        usedGb = Math.Round(v.UsedGb ?? 0, 2),
                        esxiHost = v.EsxiHost,
                        guestOs = v.GuestOs,
                        toolsStatus = v.ToolsStatus,
                        site = v.Site
                    })
                    .ToList() ?? new List<object>();

                return Json(new { results, count = results.Count });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching single VM");
                return Json(new { error = ex.Message, results = new List<object>() });
            }
        }

        [HttpPost]
        [Route("api/search-vcenter")]
        public async Task<IActionResult> SearchVCenter([FromBody] VCenterSearchRequest request)
        {
            try
            {
                var vms = await _vmInventoryService.GetInventoryAsync();
                if (string.IsNullOrEmpty(request?.VCenter))
                    return Json(new { results = new List<object>(), count = 0 });

                var results = vms?.Where(v => v.VCenter == request.VCenter)
                    .ToList() ?? new List<VmInventoryRecord>();

                // Apply advanced filters if provided
                if (request.Filters != null)
                {
                    if (!string.IsNullOrEmpty(request.Filters.PowerState) && request.Filters.PowerState != "All")
                        results = results.Where(v => v.PowerState == request.Filters.PowerState).ToList();

                    if (!string.IsNullOrEmpty(request.Filters.GuestOs) && request.Filters.GuestOs != "All OSes")
                        results = results.Where(v => v.GuestOs?.Contains(request.Filters.GuestOs) == true).ToList();

                    if (request.Filters.MemoryGbMin.HasValue)
                        results = results.Where(v => v.MemoryGb >= request.Filters.MemoryGbMin).ToList();

                    if (request.Filters.MemoryGbMax.HasValue)
                        results = results.Where(v => v.MemoryGb <= request.Filters.MemoryGbMax).ToList();

                    if (request.Filters.CpuCoresMin.HasValue)
                        results = results.Where(v => v.NumCpu >= request.Filters.CpuCoresMin).ToList();

                    if (request.Filters.CpuCoresMax.HasValue)
                        results = results.Where(v => v.NumCpu <= request.Filters.CpuCoresMax).ToList();

                    if (!string.IsNullOrEmpty(request.Filters.ToolsStatus) && request.Filters.ToolsStatus != "All Status")
                        results = results.Where(v => v.ToolsStatus == request.Filters.ToolsStatus).ToList();
                }

                var formattedResults = results.Select(v => new
                {
                    vmName = v.VmName,
                    powerState = v.PowerState,
                    guestHostname = v.GuestHostname,
                    ipAddress = v.IpAddress,
                    vcenter = v.VCenter,
                    cluster = v.Cluster,
                    numCpu = v.NumCpu,
                    memoryGb = v.MemoryGb,
                    provisionedGb = Math.Round(v.ProvisionedGb ?? 0, 2),
                    usedGb = Math.Round(v.UsedGb ?? 0, 2),
                    esxiHost = v.EsxiHost,
                    guestOs = v.GuestOs,
                    toolsStatus = v.ToolsStatus,
                    site = v.Site
                }).ToList();

                return Json(new { results = formattedResults, count = formattedResults.Count });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching vCenter");
                return Json(new { error = ex.Message, results = new List<object>() });
            }
        }

        [HttpPost]
        [Route("api/search-multiple-vms")]
        public async Task<IActionResult> SearchMultipleVMs([FromBody] MultipleVMSearchRequest request)
        {
            try
            {
                var vms = await _vmInventoryService.GetInventoryAsync();
                if (string.IsNullOrEmpty(request?.SearchTerms))
                    return Json(new { results = new List<object>(), count = 0 });

                var searchPatterns = request.SearchTerms.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                    .Select(s => s.Trim())
                    .ToList();

                var results = new List<VmInventoryRecord>();

                foreach (var pattern in searchPatterns)
                {
                    var regexPattern = pattern.Replace("*", ".*");
                    var regex = new System.Text.RegularExpressions.Regex($"^{regexPattern}$", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
                    var matched = vms?.Where(v => regex.IsMatch(v.VmName ?? "")).ToList() ?? new List<VmInventoryRecord>();
                    results.AddRange(matched);
                }

                var uniqueResults = results.DistinctBy(v => v.VmName)
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
                        provisionedGb = Math.Round(v.ProvisionedGb ?? 0, 2),
                        usedGb = Math.Round(v.UsedGb ?? 0, 2),
                        esxiHost = v.EsxiHost,
                        guestOs = v.GuestOs,
                        toolsStatus = v.ToolsStatus,
                        site = v.Site
                    })
                    .ToList();

                return Json(new { results = uniqueResults, count = uniqueResults.Count });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching multiple VMs");
                return Json(new { error = ex.Message, results = new List<object>() });
            }
        }

        [HttpPost]
        [Route("api/export-csv")]
        public async Task<IActionResult> ExportCsv([FromBody] ExportRequest request)
        {
            try
            {
                var vms = await _vmInventoryService.GetInventoryAsync();
                if (string.IsNullOrEmpty(request?.SearchResults))
                    return BadRequest("No data to export");

                var results = JsonSerializer.Deserialize<List<object>>(request.SearchResults);
                var csv = new StringBuilder();
                csv.AppendLine("VM Name,Power State,Guest Hostname,IP Address,vCenter,Cluster,CPU Cores,Memory (GB),Provisioned (GB),Used (GB),ESXi Host,Guest OS,Tools Status,Site");

                if (results != null)
                {
                    foreach (var item in results)
                    {
                        // Parse each item and add to CSV
                        var dict = JsonSerializer.Deserialize<Dictionary<string, object>>(item.ToString() ?? "");
                        if (dict != null)
                        {
                            csv.AppendLine($"\"{dict.GetValueOrDefault("vmName", "")}\"," +
                                $"\"{dict.GetValueOrDefault("powerState", "")}\"," +
                                $"\"{dict.GetValueOrDefault("guestHostname", "")}\"," +
                                $"\"{dict.GetValueOrDefault("ipAddress", "")}\"," +
                                $"\"{dict.GetValueOrDefault("vcenter", "")}\"," +
                                $"\"{dict.GetValueOrDefault("cluster", "")}\"," +
                                $"{dict.GetValueOrDefault("numCpu", "")}," +
                                $"{dict.GetValueOrDefault("memoryGb", "")}," +
                                $"{dict.GetValueOrDefault("provisionedGb", "")}," +
                                $"{dict.GetValueOrDefault("usedGb", "")}," +
                                $"\"{dict.GetValueOrDefault("esxiHost", "")}\"," +
                                $"\"{dict.GetValueOrDefault("guestOs", "")}\"," +
                                $"\"{dict.GetValueOrDefault("toolsStatus", "")}\"," +
                                $"\"{dict.GetValueOrDefault("site", "")}\"");
                        }
                    }
                }

                var bytes = Encoding.UTF8.GetBytes(csv.ToString());
                return File(bytes, "text/csv", $"vm-export-{DateTime.Now:yyyyMMdd-HHmmss}.csv");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error exporting CSV");
                return BadRequest(ex.Message);
            }
        }
    }

    public class SearchRequest
    {
        public string? SearchTerm { get; set; }
    }

    public class VCenterSearchRequest
    {
        public string? VCenter { get; set; }
        public AdvancedFilters? Filters { get; set; }
    }

    public class AdvancedFilters
    {
        public string? PowerState { get; set; }
        public string? GuestOs { get; set; }
        public double? MemoryGbMin { get; set; }
        public double? MemoryGbMax { get; set; }
        public int? CpuCoresMin { get; set; }
        public int? CpuCoresMax { get; set; }
        public string? ToolsStatus { get; set; }
    }

    public class MultipleVMSearchRequest
    {
        public string? SearchTerms { get; set; }
    }

    public class ExportRequest
    {
        public string? SearchResults { get; set; }
    }
}
