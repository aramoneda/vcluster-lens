using System.Text.Json.Serialization;

namespace IcsSreVcenterDashboard.Models
{
    public class VmInventoryRecord
    {
        [JsonPropertyName("vm_name")]
        public string VmName { get; set; }

        [JsonPropertyName("power_state")]
        public string PowerState { get; set; }

        [JsonPropertyName("guest_hostname")]
        public string GuestHostname { get; set; }

        [JsonPropertyName("vcenter")]
        public string VCenter { get; set; }

        [JsonPropertyName("cluster")]
        public string Cluster { get; set; }

        [JsonPropertyName("num_cpu")]
        public int? NumCpu { get; set; }

        [JsonPropertyName("memory_gb")]
        public double? MemoryGb { get; set; }

        [JsonPropertyName("provisioned_gb")]
        public double ProvisionedGb { get; set; }

        [JsonPropertyName("used_gb")]
        public double UsedGb { get; set; }

        [JsonPropertyName("esxi_host")]
        public string EsxiHost { get; set; }

        [JsonPropertyName("guest_os")]
        public string GuestOs { get; set; }

        [JsonPropertyName("tools_status")]
        public string ToolsStatus { get; set; }

        [JsonPropertyName("ip_address")]
        public string IpAddress { get; set; }

        [JsonPropertyName("site")]
        public string Site { get; set; }
    }
}
