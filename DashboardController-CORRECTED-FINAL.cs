using IcsSreVcenterDashboard.Models;
using IcsSreVcenterDashboard.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
                var summary = await _vmInventoryService.GetDashboardSummaryAsync();
                var vcenters = await _vmInventoryService.GetVCentersAsync();
                
                ViewBag.Summary = summary;
                ViewBag.VCenters = vcenters ?? new List<string>();
                
                return View();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error loading index: {ex.Message}");
                ViewBag.Error = "Failed to load dashboard";
                return View();
            }
        }

        [HttpPost]
        [Route("api/search-single-vm")]
        public async Task<IActionResult> SearchSingleVm([FromBody] SearchRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request?.Query))
                    return Json(new { success = false, message = "Please enter a VM name" });

                var results = await _vmInventoryService.SearchSingleVmAsync(request.Query);
                return Json(new { success = true, results = results ?? new List<VmInventoryRecord>() });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error searching single VM: {ex.Message}");
                return Json(new { success = false, message = $"Search failed: {ex.Message}" });
            }
        }

        [HttpPost]
        [Route("api/search-vcenter")]
        public async Task<IActionResult> SearchVCenter([FromBody] SearchRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request?.Query))
                    return Json(new { success = false, message = "Please select a vCenter" });

                var results = await _vmInventoryService.SearchByVCenterAsync(request.Query);
                return Json(new { success = true, results = results ?? new List<VmInventoryRecord>() });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error searching vCenter: {ex.Message}");
                return Json(new { success = false, message = $"Search failed: {ex.Message}" });
            }
        }

        [HttpPost]
        [Route("api/search-multiple-vms")]
        public async Task<IActionResult> SearchMultipleVms([FromBody] SearchRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request?.Query))
                    return Json(new { success = false, message = "Please enter VM names" });

                var vmNames = request.Query.Split(new[] { '\n', '\r', ',' }, System.StringSplitOptions.RemoveEmptyEntries)
                    .Select(x => x.Trim())
                    .ToList();

                var results = await _vmInventoryService.SearchMultipleVMsAsync(vmNames);
                return Json(new { success = true, results = results ?? new List<VmInventoryRecord>() });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error searching multiple VMs: {ex.Message}");
                return Json(new { success = false, message = $"Search failed: {ex.Message}" });
            }
        }

        [HttpPost]
        [Route("api/advanced-filter")]
        public async Task<IActionResult> AdvancedFilter([FromBody] AdvancedFilterRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request?.VCenter))
                    return Json(new { success = false, message = "Please select a vCenter" });

                // Get VMs for the vCenter first
                var vms = await _vmInventoryService.SearchByVCenterAsync(request.VCenter);
                
                if (vms == null) vms = new List<VmInventoryRecord>();

                // Apply filters
                var filtered = vms.AsEnumerable();

                if (!string.IsNullOrEmpty(request.PowerState) && request.PowerState != "All")
                {
                    filtered = filtered.Where(v => v.PowerState == request.PowerState);
                }

                if (!string.IsNullOrEmpty(request.GuestOS) && request.GuestOS != "All OSes")
                {
                    filtered = filtered.Where(v => v.GuestOS == request.GuestOS);
                }

                if (request.MinMemoryGB.HasValue)
                {
                    filtered = filtered.Where(v => (v.MemoryGB ?? 0) >= request.MinMemoryGB);
                }

                if (request.MaxMemoryGB.HasValue)
                {
                    filtered = filtered.Where(v => (v.MemoryGB ?? 0) <= request.MaxMemoryGB);
                }

                if (request.MinCPUCores.HasValue)
                {
                    filtered = filtered.Where(v => (v.CPUCores ?? 0) >= request.MinCPUCores);
                }

                if (request.MaxCPUCores.HasValue)
                {
                    filtered = filtered.Where(v => (v.CPUCores ?? 0) <= request.MaxCPUCores);
                }

                if (!string.IsNullOrEmpty(request.ToolsStatus) && request.ToolsStatus != "All Statuses")
                {
                    filtered = filtered.Where(v => v.ToolsStatus == request.ToolsStatus);
                }

                return Json(new { success = true, results = filtered.ToList() });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error applying advanced filter: {ex.Message}");
                return Json(new { success = false, message = $"Filter failed: {ex.Message}" });
            }
        }

        [HttpPost]
        [Route("api/dashboard-summary")]
        public async Task<IActionResult> GetDashboardSummary()
        {
            try
            {
                var summary = await _vmInventoryService.GetDashboardSummaryAsync();
                return Json(new { success = true, data = summary });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error loading dashboard summary: {ex.Message}");
                return Json(new { success = false, message = $"Failed to load summary: {ex.Message}" });
            }
        }

        [HttpGet]
        [Route("api/vcenters")]
        public async Task<IActionResult> GetVCenters()
        {
            try
            {
                var vcenters = await _vmInventoryService.GetVCentersAsync();
                return Json(new { success = true, data = vcenters ?? new List<string>() });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error loading vCenters: {ex.Message}");
                return Json(new { success = false, message = $"Failed to load vCenters: {ex.Message}" });
            }
        }

        [HttpPost]
        [Route("api/export-csv")]
        public async Task<IActionResult> ExportCsv([FromBody] ExportRequest request)
        {
            try
            {
                if (request?.Vms == null || request.Vms.Count == 0)
                    return BadRequest("No data to export");

                var csv = GenerateCsv(request.Vms);
                var bytes = System.Text.Encoding.UTF8.GetBytes(csv);
                return File(bytes, "text/csv", $"vm-inventory-{DateTime.Now:yyyyMMdd-HHmmss}.csv");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error exporting CSV: {ex.Message}");
                return BadRequest($"Export failed: {ex.Message}");
            }
        }

        private string GenerateCsv(List<VmInventoryRecord> vms)
        {
            var sb = new System.Text.StringBuilder();
            sb.AppendLine("VM Name,Power State,Hostname,vCenter,CPU Cores,Memory GB,Provisioned GB,Used GB,ESXi Host,Cluster,IP Address,Tools Status");

            foreach (var vm in vms)
            {
                sb.AppendLine($"\"{vm.Name}\",\"{vm.PowerState}\",\"{vm.Hostname}\",\"{vm.VCenter}\",{vm.CPUCores},{vm.MemoryGB},{vm.ProvisionedGB},{vm.UsedGB},\"{vm.ESXiHost}\",\"{vm.Cluster}\",\"{vm.IPAddress}\",\"{vm.ToolsStatus}\"");
            }

            return sb.ToString();
        }
    }

    public class SearchRequest
    {
        public string Query { get; set; }
    }

    public class AdvancedFilterRequest
    {
        public string VCenter { get; set; }
        public string PowerState { get; set; }
        public string GuestOS { get; set; }
        public double? MinMemoryGB { get; set; }
        public double? MaxMemoryGB { get; set; }
        public int? MinCPUCores { get; set; }
        public int? MaxCPUCores { get; set; }
        public string ToolsStatus { get; set; }
    }

    public class ExportRequest
    {
        public List<VmInventoryRecord> Vms { get; set; }
    }
}
