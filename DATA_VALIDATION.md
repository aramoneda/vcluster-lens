# VM Inventory Dashboard - Data Validation & Pipeline Guide

## Jenkins Pipeline Integration

When the Jenkins pipeline completes, it should update `/public/vm-inventory.json` with fresh vCenter VM inventory data. The application automatically detects the updated file and refreshes data on next load (cache TTL: 8 hours).

## JSON Data Structure

### Expected Fields (from vm-inventory.json)

```json
{
  "collection_time": "ISO-8601 timestamp",
  "site": "Data center name",
  "vcenter": "vCenter FQDN",
  "vcenter_version": "vCenter version",
  "vcenter_ip": "vCenter IP address",
  "vm_name": "VM display name",
  "exists": "Yes|No (accessibility indicator)",
  "power_state": "PoweredOn|PoweredOff",
  "guest_os": "Full OS name with bit version",
  "guest_hostname": "OS hostname",
  "ip_address": "IPv4/IPv6 comma-separated",
  "esxi_host": "Host FQDN",
  "cluster": "Cluster name",
  "datacenter": "Datacenter name",
  "num_cpu": "Integer (1-48)",
  "memory_gb": "Integer (GB)",
  "provisioned_gb": "Float",
  "used_gb": "Float",
  "tools_status": "toolsOk|toolsRunning|toolsNotRunning|toolsNotInstalled|toolsOld",
  "tools_version": "Version number (e.g., '11333')",
  "tools_version_status": "Status qualifier",
  "tools_running_status": "Running|Not Running|etc.",
  "has_snapshot": "Yes|No|Boolean",
  "snapshot_count": "Integer",
  "vm_compatibility": "vSphere compatibility string",
  "vm_hardware_version": "vmx-XX",
  "cluster": "Cluster name"
}
```

## Application Field Mappings

### Search & Filtering (Advanced Filtering Section)

| UI Filter | JSON Field | Type | Description |
|-----------|-----------|------|-------------|
| Power State | `power_state` | string | PoweredOn, PoweredOff |
| Tools Status | `tools_status` | string | toolsOk, toolsOld, toolsNotRunning, etc. |
| Guest OS | `guest_os` | string | Full OS name, grouped by category |
| Memory (GB) | `memory_gb` | integer | RAM in GB |
| CPU Count | `num_cpu` | integer | Number of vCPUs |

### Results Table Display

| Table Column | JSON Field(s) | Display Format |
|-------------|-----------|-----------------|
| Guest OS | `guest_os` | Full OS name with bit version |
| IP Address | `ip_address` | Comma-separated IPs |
| CPU/Memory | `num_cpu`, `memory_gb` | "{cpu} / {memory}GB" |
| Storage | `provisioned_gb`, `used_gb` | "Used: {used}GB / Provisioned: {provisioned}GB" |
| Compatibility | `vm_compatibility` | vSphere version requirement |
| VMware Tools Status | `tools_status`, `tools_version` | "Status (vVersion)" e.g., "Running (v11333)" |
| Has Snapshots? | `has_snapshot` | Yes/No |

### CSV Export

All fields from Results Table are exported as-is with tools status formatted as `"Status (vVersion)"`.

## Data Validation Rules

### Power State
- Valid values: `PoweredOn`, `PoweredOff`
- Only valid power states are counted in vCenter statistics
- Used in filtering and displayed with colored icons (green=PoweredOn, gray=PoweredOff)

### Memory & CPU
- Memory: Must be positive integer (GB)
- CPU: Must be positive integer (1-48 range typical)
- Empty/zero values excluded from filter options
- Duplicates automatically deduplicated in dropdown

### Guest OS
- Full name format: `OS Name (64-bit)` or `OS Name (32-bit)`
- Grouped by category (Linux, Windows, VMware, etc.) in dropdown
- Type-ahead search filters by OS name

### Tools Status
- Valid values map to display text:
  - `toolsOk` → "Running"
  - `toolsRunning` → "Running"
  - `toolsNotRunning` → "Not Running"
  - `toolsNotInstalled` → "Not Installed"
  - `toolsOld` → "Outdated"
- Version displayed from `tools_version` field (e.g., "11333")

## Verification Checklist After Pipeline Run

After Jenkins pipeline updates `/public/vm-inventory.json`:

- [ ] File exists at `/public/vm-inventory.json`
- [ ] JSON is valid (parseable)
- [ ] `collection_time` field is recent (matches pipeline run time)
- [ ] All 13,732+ VMs present in array
- [ ] Sample VM contains all required fields
- [ ] `power_state` values are exactly "PoweredOn" or "PoweredOff" (case-sensitive)
- [ ] `tools_status` values use camelCase (toolsOk, toolsOld, etc.)
- [ ] `num_cpu` and `memory_gb` are integers or present
- [ ] `guest_os` contains full OS name
- [ ] No nulls/undefined for critical fields (vm_name, vcenter, power_state)

## Data Flow on Application Load

1. **User navigates to dashboard** → Calls `getVCenters()`
2. **getVCenters() executes**:
   - Checks IndexedDB cache (8-hour TTL)
   - If expired/missing, fetches `/vm-inventory.json`
   - Groups VMs by vCenter
   - Calculates stats (total, PoweredOn, PoweredOff)
   - Returns `VCenterStats[]` array
3. **User selects vCenter** → Filters load options for Power State, Tools Status, Guest OS, Memory, CPU
4. **Advanced Filters applied** → Component filters VMs by selected criteria
5. **Results displayed** → Table shows matching VMs with all relevant fields
6. **CSV export** → Includes tools status with version information

## Cache Behavior

- **Cache TTL**: 8 hours (28,800,000 ms)
- **Cache location**: In-memory (JavaScript) + IndexedDB
- **Manual clear**: Call `clearCache()` from DevTools console to force refresh

To clear cache manually:
```javascript
// In browser console:
import('lib/search').then(m => m.clearCache()).then(() => location.reload());
```

## Troubleshooting

### Tools Status Not Displaying Correctly
- Verify `tools_status` field uses correct camelCase (toolsOk, not toolsOK)
- Verify `tools_version` field exists (can be string or null)

### Filters Show No Options
- Verify sample VMs have non-null values for the field
- Check for whitespace/empty string values (should be trimmed)

### vCenter Not Appearing
- Verify VM's `exists` field is "Yes"
- Verify VM's `vcenter` field is not empty
- At least one VM must exist per vCenter to display

