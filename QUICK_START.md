# Quick Start Guide - VM Monitoring Dashboard

## 🚀 Get Started in 2 Minutes

### Step 1: Access the Dashboard
```
http://localhost:3000
```

### Step 2: Load Your Data
1. Click the **"Update Inventory"** section at the top
2. Drag & drop your `vm_inventory_latest.json` file
   - OR click to browse and select the file
3. Dashboard auto-loads with your VMs (no page refresh needed)

### Step 3: Start Searching

#### Find a Single VM
```
Search Section: "Search Single VM"
Input: cldvvssp002
Click: Search
Result: Full details (vCenter, IP, CPU, Memory, Storage, Power State)
```

#### Find All VMs on a vCenter
```
Search Section: "Search by vCenter"
Input: clpvvvcsa001
Click: Search
Result: 43 total VMs with power state breakdown
Click: "Show VMs" to expand list
```

#### Find Multiple VMs at Once
```
Search Section: "Search Multiple VMs"
Input:
  cldvvssp002
  clpvvssp001
  your-vm-name
Click: Search
Result: Table with all matching VMs, sortable by name/vCenter/power state
```

---

## 📊 Dashboard Overview

### Top Section: Summary Cards
- **Total VMs** - Count of all virtual machines
- **Total vCenters** - Count of vCenter servers
- **Powered On** - VMs currently powered on
- **Powered Off** - VMs currently powered off

### Middle Section: vCenter Grid
- Shows each vCenter with:
  - Location/site
  - Total VM count
  - On/Off breakdown

### Bottom Section: Charts
- **VM Count Trend** - 30-day historical trend
- **Power State Distribution** - Bar chart of on/off ratios
- **vCenter Distribution** - Pie chart showing VM spread

---

## 🔧 Setting Up Automation

### Quick Setup (Email Method)
1. Modify your PowerShell script to output JSON
2. Create Jenkins job with these settings:
   - Schedule: `H 2 * * *` (daily at 2 AM)
   - Run: Your PowerShell script
   - Email: Send JSON attachment
3. When you receive email, download and upload to dashboard

### Full Setup (GitHub Method)
See **AUTOMATION_GUIDE.md** for complete instructions

---

## 💡 Tips & Tricks

### Tip 1: Use Exact VM Names
```
❌ Wrong: "your vm"
✓ Correct: "cldvvssp002"
```

### Tip 2: Multi-Line Search is Flexible
```
Can have spaces:   ✓ Handles blank lines   ✓ Handles duplicates
cldvvssp002         (ignored)               (shows once)
clpvvssp001

your-vm-name
```

### Tip 3: Sort Multi-VM Results
Dropdown menu to sort by:
- Name (default, A→Z)
- vCenter (alphabetical)
- Power State (on first, then off)

### Tip 4: vCenter Expansion
Click "Show VMs" to see all VMs on a vCenter:
- Shows VM name + hostname
- Shows power state badge
- Color-coded: Green=On, Gray=Off

### Tip 5: Dark Mode
Your dashboard automatically switches to dark mode if your system prefers it.

---

## 📋 Common Tasks

### Task: Find which vCenter hosts VM "prod-app-01"
1. Search for: `prod-app-01`
2. Look at results under "vCenter"
3. Shows: `clpvvvcsa003` in Broadridge Clifton Data Center

### Task: Count how many VMs are on "clpvvvcsa003"
1. Search vCenter: `clpvvvcsa003`
2. Look at summary stats
3. Shows: 1374 total VMs, 1349 powered on, 25 powered off

### Task: Check status of 5 specific servers
1. Multi-VM Search
2. Enter all 5 names (one per line)
3. Results show all in one table
4. Sort by power state to see problems

### Task: Export search results
1. Perform your search
2. Screenshot the results table
3. Or copy-paste from the table

### Task: Update data with new inventory
1. Run PowerShell script to generate JSON
2. Go to dashboard
3. Upload new JSON in "Update Inventory" section
4. Done! Data refreshes automatically

---

## ⚠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| "VM not found" | Try exact name match, check spelling |
| No results showing | Upload JSON file first in "Update Inventory" |
| Charts blank | Ensure JSON has valid data, try refresh |
| Data disappeared | Re-upload JSON (data stored locally until uploaded) |
| Slow performance | Close other tabs, clear browser cache |

---

## 🔑 Key Statistics Explained

### Power State Distribution Chart
- **Green bar** = VMs Powered On (usually highest)
- **Gray bar** = VMs Powered Off

### VM Count Trend
- Shows last 30 days
- Line per vCenter
- Watch for unusual spikes/drops

### vCenter Distribution Pie
- Slice size = number of VMs
- Hover to see exact count
- Helps identify busy vCenters

---

## 📞 Need Help?

### For Automation Setup
See: **AUTOMATION_GUIDE.md**

### For Dashboard Features
See: **README_DASHBOARD.md**

### For JSON Format Issues
Ensure file matches format in README_DASHBOARD.md

### For Jenkins Setup
Contact: Your infrastructure team

---

## 🎯 Next Steps

1. ✅ Load sample data
2. ✅ Try each search type
3. ✅ Explore the charts
4. → Set up Jenkins automation (see AUTOMATION_GUIDE.md)
5. → Deploy to production

---

**Version:** 1.0  
**Last Updated:** July 2026  
**Status:** Ready for Production Use
