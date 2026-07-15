# VM Monitoring Dashboard

A comprehensive web-based dashboard for searching and monitoring virtual machines across multiple Broadridge vCenter servers. Built with Next.js, React, and Recharts.

## Features

### 🔍 Search Capabilities

1. **Single VM Search**
   - Search for individual VMs by name
   - View detailed information including:
     - Power state (PoweredOn/PoweredOff)
     - vCenter location
     - Guest OS and hostname
     - IP address and ESXi host
     - CPU cores and memory allocation
     - Storage metrics (provisioned vs. used)
     - VMware tools status

2. **vCenter Search**
   - Find all VMs hosted on a specific vCenter
   - View summary statistics:
     - Total VM count
     - VMs powered on/off
   - Expandable list of all VMs on that vCenter

3. **Multi-VM Search**
   - Search multiple VMs at once (one per line)
   - Sortable results by name, vCenter, or power state
   - Paginated table view for easy browsing

### 📊 Analytics & Visualizations

- **Summary Cards:** Total VMs, vCenters, powered-on/off counts
- **vCenter Summary Grid:** Quick stats for each vCenter
- **Trend Charts:** 30-day VM count trends per vCenter
- **Power State Distribution:** Bar chart showing on/off ratios
- **vCenter Distribution:** Pie chart showing VM distribution across vCenters

### 📤 Data Management

- **JSON Upload:** Drag-and-drop or click to upload your VM inventory JSON
- **Automatic Validation:** Ensures JSON format and required fields
- **localStorage Persistence:** Data survives browser session
- **Date Tracking:** Shows when data was last updated

## Quick Start

### For Testing (Immediate Use)

1. **Get Your Data Ready:**
   - Run your PowerShell script to generate `vm_inventory_latest.json`
   - Or use the provided sample JSON file

2. **Upload to Dashboard:**
   - Open the dashboard
   - Click "Update Inventory" section at the top
   - Drag & drop your JSON file or click to browse
   - Dashboard automatically reloads with new data

3. **Start Searching:**
   - Use "Search Single VM" to find individual machines
   - Use "Search by vCenter" to explore vCenter clusters
   - Use "Search Multiple VMs" to batch search

### For Production (Automated Daily Updates)

See **AUTOMATION_GUIDE.md** for detailed setup instructions including:
- Jenkins job configuration
- PowerShell script modifications
- Email-based delivery
- GitHub integration
- API upload endpoint setup

## Expected JSON Format

The dashboard expects a JSON array with the following structure:

```json
[
  {
    "collection_time": "2026-07-14T20:47:04.3314572-04:00",
    "site": "Broadridge Clifton Data Center",
    "vcenter": "clpvvvcsa001",
    "vcenter_version": "7.0.3",
    "vcenter_ip": "10.10.121.248",
    "vm_name": "cldvvssp002",
    "exists": "Yes",
    "power_state": "PoweredOn",
    "guest_os": "Ubuntu Linux (64-bit)",
    "guest_hostname": "cldvvssp002",
    "ip_address": "10.101.147.21",
    "esxi_host": "clppvsanh002.broadridge.net",
    "cluster": "cl-m01-cl01",
    "folder": "vm",
    "datacenter": "cl-m01-dc01",
    "num_cpu": 4,
    "memory_gb": 6,
    "provisioned_gb": 792.39,
    "used_gb": 94.59,
    "tools_status": "toolsOk",
    "vm_id": "VirtualMachine-vm-9025",
    "uuid": "423874b8-a1fc-e922-3b8d-2cadc54e046c"
  }
]
```

**Required Fields:**
- `vm_name` - Virtual machine name
- `vcenter` - vCenter server name
- `power_state` - PoweredOn or PoweredOff
- `site` - Data center name
- Additional fields for detailed view

## Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Main dashboard page
│   └── globals.css             # Global styles
├── components/
│   ├── single-vm-search.tsx    # Single VM search component
│   ├── vcenter-search.tsx      # vCenter search component
│   ├── multi-vm-search.tsx     # Multi-VM search component
│   ├── summary.tsx             # Summary cards and vCenter grid
│   ├── trends.tsx              # Chart visualizations
│   ├── json-upload.tsx         # File upload component
│   └── theme-provider.tsx      # Dark mode support
├── lib/
│   ├── search.ts               # Search logic and utilities
│   └── vm-inventory.json       # Sample inventory data
├── AUTOMATION_GUIDE.md         # Setup guide for Jenkins automation
└── README_DASHBOARD.md         # This file
```

## Key Components

### Search Logic (`lib/search.ts`)

Exported functions:
- `searchVM(vmName)` - Find single VM
- `searchByVCenter(vcentername)` - Find all VMs on vCenter
- `searchMultipleVMs(vmNames)` - Find multiple VMs
- `getVCenters()` - Get all vCenters with stats
- `getOverallStats()` - Get dashboard summary
- `getTrendData()` - Get 30-day trend simulation
- `getPowerStateDistribution()` - Get power state stats

### React Components

All components support:
- Dark/light mode via system preference or manual toggle
- Responsive design for desktop and mobile
- Accessible UI with proper ARIA labels
- Real-time search and filtering

## Technology Stack

- **Frontend:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS with dark mode support
- **Charts:** Recharts for data visualization
- **Icons:** Lucide React
- **Data Format:** JSON (localStorage-backed)
- **Deployment:** Vercel-ready

## Performance Considerations

- In-memory search: O(n) for each query
- Client-side filtering: No server requests needed
- Charts re-render only on data update
- Optimized rendering with React 19

## Dark Mode

The dashboard automatically adapts to your system preferences (light/dark) and includes a manual toggle in the navigation.

## Troubleshooting

### No VMs Found?
- Verify JSON file format using online JSON validators
- Ensure required fields are present
- Check browser console for validation errors

### Data Disappears on Refresh?
- This is normal - data is stored in localStorage
- Re-upload the JSON file to persist data
- See AUTOMATION_GUIDE.md for permanent storage solutions

### Charts Not Showing?
- Ensure Recharts dependency is installed (`pnpm list recharts`)
- Check browser console for errors
- Verify data has vCenter names for trending

### Search Not Working?
- Try exact VM name match (case-insensitive)
- Check that JSON was properly validated during upload
- Clear browser cache and reload

## Deployment

### Local Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

### Vercel Deployment

```bash
# Deploy to Vercel (if you have Vercel CLI installed)
vercel
```

## Future Enhancements

Potential improvements for Phase 2+:

- [ ] Database backend for historical data
- [ ] API endpoint for Jenkins automation
- [ ] User authentication and multi-team support
- [ ] Advanced filtering and saved searches
- [ ] CSV export functionality
- [ ] Real-time alerts for power state changes
- [ ] Capacity planning and trend forecasting
- [ ] Integration with vCenter APIs for live updates
- [ ] Scheduled report generation
- [ ] Custom dashboard dashboards

## Notes

**Current Version:** 1.0 (In-Memory Data)

This dashboard currently stores data in browser memory/localStorage. For production use with automated daily updates, see AUTOMATION_GUIDE.md for Jenkins integration setup.

**Data Retention:** 30-day rolling window recommended (see AUTOMATION_GUIDE.md)

**Performance:** Dashboard handles 2000+ VMs smoothly on modern browsers

## Support

For issues or questions:

1. Check AUTOMATION_GUIDE.md for automation setup
2. Verify JSON format matches expected schema
3. Review browser console for error messages
4. Check system requirements (Node.js 18+, modern browser)

## License

Internal Broadridge tool - For IT Infrastructure Team Use

---

**Last Updated:** July 2026  
**Dashboard Version:** 1.0  
**Data Format Version:** 1.0
