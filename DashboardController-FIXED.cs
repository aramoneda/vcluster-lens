using Microsoft.AspNetCore.Mvc;
using IcsSreVcenterDashboard.Services;
using System.Text;
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

        public async Task<IActionResult> Index()
        {
            try
            {
                var inventory = await _vmInventoryService.GetInventoryAsync();
                return View(inventory);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error loading dashboard: {ex.Message}");
                return View(new List<VmInventoryRecord>());
            }
        }

        [HttpGet]
        [Route("api/dashboard-summary")]
        public async Task<IActionResult> GetDashboardSummary()
        {
            try
            {
                var inventory = await _vmInventoryService.GetInventoryAsync();
                
                if (inventory == null || !inventory.Any())
                {
                    return Json(new
                    {
                        totalVms = 0,
                        vcenters = 0,
                        poweredOn = 0,
                        poweredOff = 0,
                        storageUtilization = 0,
                        memoryAllocation = 0,
                        lastUpdated = DateTime.Now.ToString("g")
                    });
                }

                var vcenters = inventory.Select(v => v.vcenter).Distinct().Count();
                var poweredOn = inventory.Count(v => v.power_state?.ToLower() == "poweredon");
                var poweredOff = inventory.Count(v => v.power_state?.ToLower() == "poweredoff");
                
                var totalStorage = inventory.Sum(v => v.provisioned_gb ?? 0);
                var usedStorage = inventory.Sum(v => v.used_gb ?? 0);
                var storageUtilization = totalStorage > 0 ? Math.Round((usedStorage / totalStorage) * 100, 1) : 0;

                var totalMemory = inventory.Sum(v => v.memory_gb ?? 0);
                var allocatedMemory = inventory.Where(v => v.power_state?.ToLower() == "poweredon").Sum(v => v.memory_gb ?? 0);
                var memoryAllocation = totalMemory > 0 ? Math.Round((allocatedMemory / totalMemory) * 100, 1) : 0;

                return Json(new
                {
                    totalVms = inventory.Count,
                    vcenters = vcenters,
                    poweredOn = poweredOn,
                    poweredOff = poweredOff,
                    storageUtilization = storageUtilization,
                    memoryAllocation = memoryAllocation,
                    totalStorage = Math.Round(totalStorage / 1024, 2),
                    usedStorage = Math.Round(usedStorage / 1024, 2),
                    lastUpdated = DateTime.Now.ToString("g")
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting dashboard summary: {ex.Message}");
                return StatusCode(500, new { error = "Failed to load dashboard data" });
            }
        }

        [HttpGet]
        [Route("api/vcenters")]
        public async Task<IActionResult> GetVCenters()
        {
            try
            {
                var inventory = await _vmInventoryService.GetInventoryAsync();
                var vcenters = inventory?
                    .Select(v => v.vcenter)
                    .Where(v => !string.IsNullOrEmpty(v))
                    .Distinct()
                    .OrderBy(v => v)
                    .ToList() ?? new List<string>();

                return Json(vcenters);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting vcenters: {ex.Message}");
                return StatusCode(500, new { error = "Failed to load vcenters" });
            }
        }

        [HttpPost]
        [Route("api/search-single-vm")]
        public async Task<IActionResult> SearchSingleVm([FromBody] dynamic request)
        {
            try
            {
                var searchTerm = request?.searchTerm?.ToString() ?? "";
                
                if (string.IsNullOrWhiteSpace(searchTerm))
                {
                    return Json(new List<object>());
                }

                var inventory = await _vmInventoryService.GetInventoryAsync();
                
                var results = inventory?
                    .Where(v => v.vm_name != null && 
                           (v.vm_name.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
                            v.guest_hostname != null && v.guest_hostname.Contains(searchTerm, StringComparison.OrdinalIgnoreCase)))
                    .Select(v => new
                    {
                        vm_name = v.vm_name,
                        power_state = v.power_state,
                        guest_hostname = v.guest_hostname,
                        ip_address = v.ip_address,
                        vcenter = v.vcenter,
                        cluster = v.cluster,
                        num_cpu = v.num_cpu,
                        memory_gb = v.memory_gb,
                        provisioned_gb = v.provisioned_gb,
                        used_gb = v.used_gb,
                        esxi_host = v.esxi_host,
                        guest_os = v.guest_os,
                        tools_status = v.tools_status,
                        site = v.site
                    })
                    .ToList() ?? new List<object>();

                return Json(results);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error searching single VM: {ex.Message}");
                return StatusCode(500, new { error = "Search failed" });
            }
        }

        [HttpPost]
        [Route("api/search-vcenter")]
        public async Task<IActionResult> SearchVCenter([FromBody] dynamic request)
        {
            try
            {
                var vcenter = request?.vcenter?.ToString() ?? "";
                
                if (string.IsNullOrWhiteSpace(vcenter))
                {
                    return Json(new List<object>());
                }

                var inventory = await _vmInventoryService.GetInventoryAsync();
                
                var results = inventory?
                    .Where(v => v.vcenter != null && 
                           v.vcenter.Equals(vcenter, StringComparison.OrdinalIgnoreCase))
                    .Select(v => new
                    {
                        vm_name = v.vm_name,
                        power_state = v.power_state,
                        guest_hostname = v.guest_hostname,
                        ip_address = v.ip_address,
                        vcenter = v.vcenter,
                        cluster = v.cluster,
                        num_cpu = v.num_cpu,
                        memory_gb = v.memory_gb,
                        provisioned_gb = v.provisioned_gb,
                        used_gb = v.used_gb,
                        esxi_host = v.esxi_host,
                        guest_os = v.guest_os,
                        tools_status = v.tools_status,
                        site = v.site
                    })
                    .ToList() ?? new List<object>();

                return Json(results);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error searching vCenter: {ex.Message}");
                return StatusCode(500, new { error = "Search failed" });
            }
        }

        [HttpPost]
        [Route("api/advanced-filter")]
        public async Task<IActionResult> AdvancedFilter([FromBody] dynamic request)
        {
            try
            {
                var vcenter = request?.vcenter?.ToString() ?? "";
                var powerState = request?.powerState?.ToString() ?? "";
                var guestOs = request?.guestOs?.ToString() ?? "";
                var minMemory = double.TryParse(request?.minMemory?.ToString(), out var min) ? min : 0;
                var maxMemory = double.TryParse(request?.maxMemory?.ToString(), out var max) ? max : double.MaxValue;
                var minCpu = int.TryParse(request?.minCpu?.ToString(), out var minC) ? minC : 0;
                var maxCpu = int.TryParse(request?.maxCpu?.ToString(), out var maxC) ? maxC : int.MaxValue;
                var toolsStatus = request?.toolsStatus?.ToString() ?? "";

                var inventory = await _vmInventoryService.GetInventoryAsync();
                
                var results = inventory?
                    .Where(v => 
                        (string.IsNullOrEmpty(vcenter) || v.vcenter == vcenter) &&
                        (string.IsNullOrEmpty(powerState) || v.power_state == powerState) &&
                        (string.IsNullOrEmpty(guestOs) || v.guest_os == guestOs) &&
                        (v.memory_gb ?? 0 >= minMemory && v.memory_gb ?? 0 <= maxMemory) &&
                        (v.num_cpu ?? 0 >= minCpu && v.num_cpu ?? 0 <= maxCpu) &&
                        (string.IsNullOrEmpty(toolsStatus) || v.tools_status == toolsStatus))
                    .Select(v => new
                    {
                        vm_name = v.vm_name,
                        power_state = v.power_state,
                        guest_hostname = v.guest_hostname,
                        ip_address = v.ip_address,
                        vcenter = v.vcenter,
                        cluster = v.cluster,
                        num_cpu = v.num_cpu,
                        memory_gb = v.memory_gb,
                        provisioned_gb = v.provisioned_gb,
                        used_gb = v.used_gb,
                        esxi_host = v.esxi_host,
                        guest_os = v.guest_os,
                        tools_status = v.tools_status,
                        site = v.site
                    })
                    .ToList() ?? new List<object>();

                return Json(results);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in advanced filter: {ex.Message}");
                return StatusCode(500, new { error = "Filter failed" });
            }
        }

        [HttpPost]
        [Route("api/search-multiple-vms")]
        public async Task<IActionResult> SearchMultipleVms([FromBody] dynamic request)
        {
            try
            {
                var searchTerms = request?.searchTerms?.ToString()?.Split(',', StringSplitOptions.RemoveEmptyEntries) ?? new string[] { };
                
                if (searchTerms.Length == 0)
                {
                    return Json(new List<object>());
                }

                var inventory = await _vmInventoryService.GetInventoryAsync();
                var results = new List<object>();

                foreach (var term in searchTerms)
                {
                    var trimmedTerm = term.Trim();
                    var termResults = inventory?
                        .Where(v => v.vm_name != null && 
                               (v.vm_name.Contains(trimmedTerm, StringComparison.OrdinalIgnoreCase) ||
                                v.guest_hostname != null && v.guest_hostname.Contains(trimmedTerm, StringComparison.OrdinalIgnoreCase)))
                        .Select(v => new
                        {
                            vm_name = v.vm_name,
                            power_state = v.power_state,
                            guest_hostname = v.guest_hostname,
                            ip_address = v.ip_address,
                            vcenter = v.vcenter,
                            cluster = v.cluster,
                            num_cpu = v.num_cpu,
                            memory_gb = v.memory_gb,
                            provisioned_gb = v.provisioned_gb,
                            used_gb = v.used_gb,
                            esxi_host = v.esxi_host,
                            guest_os = v.guest_os,
                            tools_status = v.tools_status,
                            site = v.site
                        });

                    if (termResults != null)
                    {
                        results.AddRange(termResults);
                    }
                }

                return Json(results);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error searching multiple VMs: {ex.Message}");
                return StatusCode(500, new { error = "Search failed" });
            }
        }

        [HttpPost]
        [Route("api/export-csv")]
        public async Task<IActionResult> ExportCsv([FromBody] dynamic request)
        {
            try
            {
                var data = JsonSerializer.Deserialize<List<dynamic>>(request?.ToString() ?? "[]");

                if (data == null || data.Count == 0)
                {
                    return BadRequest("No data to export");
                }

                var csv = new StringBuilder();
                csv.AppendLine("VM Name,Power State,Hostname,IP Address,vCenter,Cluster,CPU,Memory (GB),Provisioned (GB),Used (GB),ESXi Host,Guest OS,Tools Status,Site");

                foreach (var vm in data)
                {
                    var line = $"\"{vm.vm_name}\",\"{vm.power_state}\",\"{vm.guest_hostname}\",\"{vm.ip_address}\",\"{vm.vcenter}\",\"{vm.cluster}\",{vm.num_cpu},{vm.memory_gb},{vm.provisioned_gb},{vm.used_gb},\"{vm.esxi_host}\",\"{vm.guest_os}\",\"{vm.tools_status}\",\"{vm.site}\"";
                    csv.AppendLine(line);
                }

                var bytes = Encoding.UTF8.GetBytes(csv.ToString());
                return File(bytes, "text/csv", $"vm-inventory-export-{DateTime.Now:yyyyMMdd-HHmmss}.csv");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error exporting CSV: {ex.Message}");
                return StatusCode(500, new { error = "Export failed" });
            }
        }
    }
}
