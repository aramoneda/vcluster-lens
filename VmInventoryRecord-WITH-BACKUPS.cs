using System.Text.Json.Serialization;

namespace IcsSreVcenterDashboard.Models
{
    public class VmInventoryRecord
    {
        [JsonPropertyName("collection_time")]
        public string? CollectionTime { get; set; }

        [JsonPropertyName("site")]
        public string? Site { get; set; }

        [JsonPropertyName("vcenter")]
        public string? VCenter { get; set; }

        [JsonPropertyName("vcenter_version")]
        public string? VCenterVersion { get; set; }

        [JsonPropertyName("vcenter_ip")]
        public string? VCenterIp { get; set; }

        [JsonPropertyName("vm_name")]
        public string? VmName { get; set; }

        [JsonPropertyName("exists")]
        public string? Exists { get; set; }

        [JsonPropertyName("power_state")]
        public string? PowerState { get; set; }

        [JsonPropertyName("guest_os")]
        public string? GuestOs { get; set; }

        [JsonPropertyName("guest_hostname")]
        public string? GuestHostname { get; set; }

        [JsonPropertyName("ip_address")]
        public string? IpAddress { get; set; }

        [JsonPropertyName("esxi_host")]
        public string? EsxiHost { get; set; }

        [JsonPropertyName("cluster")]
        public string? Cluster { get; set; }

        [JsonPropertyName("folder")]
        public string? Folder { get; set; }

        [JsonPropertyName("datacenter")]
        public string? DataCenter { get; set; }

        [JsonPropertyName("vm_hardware_version")]
        public string? VmHardwareVersion { get; set; }

        [JsonPropertyName("vm_compatibility")]
        public string? VmCompatibility { get; set; }

        [JsonPropertyName("num_cpu")]
        public int? NumCpu { get; set; }

        [JsonPropertyName("memory_gb")]
        public double? MemoryGb { get; set; }

        [JsonPropertyName("provisioned_gb")]
        public double ProvisionedGb { get; set; }

        [JsonPropertyName("used_gb")]
        public double UsedGb { get; set; }

        [JsonPropertyName("vmtools")]
        public string? VmTools { get; set; }

        [JsonPropertyName("tools_status")]
        public string? ToolsStatus { get; set; }

        [JsonPropertyName("tools_version")]
        public string? ToolsVersion { get; set; }

        [JsonPropertyName("tools_version_status")]
        public string? ToolsVersionStatus { get; set; }

        [JsonPropertyName("tools_running_status")]
        public string? ToolsRunningStatus { get; set; }

        [JsonPropertyName("has_snapshot")]
        public string? HasSnapshot { get; set; }

        [JsonPropertyName("snapshot_count")]
        public int SnapshotCount { get; set; }

        [JsonPropertyName("snapshot_details")]
        public List<object>? SnapshotDetails { get; set; }

        // ========== BACKUP DATA FIELDS ==========
        [JsonPropertyName("backup_last_ibm_spectrum_protect")]
        public string? BackupLastIbmSpectrumProtect { get; set; }

        [JsonPropertyName("backup_server")]
        public string? BackupServer { get; set; }

        [JsonPropertyName("backup_policy")]
        public string? BackupPolicy { get; set; }

        [JsonPropertyName("backup_stage")]
        public string? BackupStage { get; set; }

        [JsonPropertyName("backup_start_time")]
        public string? BackupStartTime { get; set; }

        [JsonPropertyName("backup_end_time")]
        public string? BackupEndTime { get; set; }

        [JsonPropertyName("backup_status")]
        public string? BackupStatus { get; set; }

        [JsonPropertyName("backup_type")]
        public string? BackupType { get; set; }

        [JsonPropertyName("backup_schedule")]
        public string? BackupSchedule { get; set; }

        [JsonPropertyName("backup_data_transferred")]
        public string? BackupDataTransferred { get; set; }

        [JsonPropertyName("backup_duration")]
        public string? BackupDuration { get; set; }

        [JsonPropertyName("backup_management_ibm")]
        public string? BackupManagementIbm { get; set; }

        [JsonPropertyName("data_mover_ibm")]
        public string? DataMoverIbm { get; set; }

        [JsonPropertyName("ppdm_backups")]
        public string? PpdmBackups { get; set; }

        [JsonPropertyName("backup_raw")]
        public string? BackupRaw { get; set; }

        [JsonPropertyName("ibm_annotation_raw")]
        public string? IbmAnnotationRaw { get; set; }

        [JsonPropertyName("ibm_last_run_time")]
        public string? IbmLastRunTime { get; set; }

        [JsonPropertyName("ibm_status")]
        public string? IbmStatus { get; set; }

        [JsonPropertyName("ibm_data_transmitted")]
        public string? IbmDataTransmitted { get; set; }

        [JsonPropertyName("ibm_duration")]
        public string? IbmDuration { get; set; }

        [JsonPropertyName("ibm_type")]
        public string? IbmType { get; set; }

        [JsonPropertyName("ibm_schedule")]
        public string? IbmSchedule { get; set; }

        [JsonPropertyName("ibm_data_mover")]
        public string? IbmDataMover { get; set; }

        [JsonPropertyName("ibm_snapshot_type")]
        public string? IbmSnapshotType { get; set; }

        [JsonPropertyName("ibm_application_protection")]
        public string? IbmApplicationProtection { get; set; }

        [JsonPropertyName("ibm_transport")]
        public string? IbmTransport { get; set; }

        [JsonPropertyName("annotation")]
        public string? Annotation { get; set; }

        [JsonPropertyName("backup_tags")]
        public List<object>? BackupTags { get; set; }

        [JsonPropertyName("backup_tags_text")]
        public string? BackupTagsText { get; set; }

        [JsonPropertyName("ppdm_backups_tag")]
        public string? PpdmBackupsTag { get; set; }

        [JsonPropertyName("ibm_backup_management_tag")]
        public string? IbmBackupManagementTag { get; set; }

        // ========== RECENT EVENTS FIELDS ==========
        [JsonPropertyName("recent_event_count")]
        public int RecentEventCount { get; set; }

        [JsonPropertyName("recent_events")]
        public List<RecentEvent>? RecentEvents { get; set; }

        [JsonPropertyName("recent_backup_events")]
        public List<RecentEvent>? RecentBackupEvents { get; set; }

        // ========== OTHER FIELDS ==========
        [JsonPropertyName("custom_attributes")]
        public Dictionary<string, object>? CustomAttributes { get; set; }

        [JsonPropertyName("vm_id")]
        public string? VmId { get; set; }

        [JsonPropertyName("uuid")]
        public string? Uuid { get; set; }

        [JsonPropertyName("instance_uuid")]
        public string? InstanceUuid { get; set; }

        [JsonPropertyName("notes")]
        public string? Notes { get; set; }
    }

    public class RecentEvent
    {
        [JsonPropertyName("event_type")]
        public string? EventType { get; set; }

        [JsonPropertyName("timestamp")]
        public string? Timestamp { get; set; }

        [JsonPropertyName("description")]
        public string? Description { get; set; }

        [JsonPropertyName("user")]
        public string? User { get; set; }

        [JsonPropertyName("status")]
        public string? Status { get; set; }
    }
}
