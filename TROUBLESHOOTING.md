# VM Monitoring Dashboard - Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: "Invalid JSON" Error on Upload

**Symptoms**: Error message appears when uploading JSON file

**Causes & Solutions**:

1. **JSON file is not valid**
   - Use an online JSON validator: https://jsonlint.com/
   - Ensure the file starts with `[` and ends with `]`
   - Fix any syntax errors

2. **Missing required fields**
   - JSON array items must have: `vm_name`, `vcenter`, `power_state`
   - Check the PowerShell script output format
   - Verify all VMs have these three fields

3. **Empty JSON array**
   - File contains `[]` with no data
   - Re-run the PowerShell inventory collection script
   - Ensure vCenters are reachable and contain VMs

### Issue 2: Dashboard Shows "Powered On: 0" for All VMs

**Symptoms**: All VMs show 0 powered on, even though they should be running

**Causes & Solutions**:

1. **PowerShell script not capturing power state**
   - Verify PowerShell has vSphere module installed
   - Check vCenter credentials are correct
   - Ensure service account has read permissions

2. **Power state field value mismatch**
   - PowerShell might use different case: "poweredon" vs "PoweredOn"
   - Check the exact value in your JSON
   - Update search logic if needed

3. **Data not loaded from IndexedDB**
   - Open browser DevTools (F12) → Application → IndexedDB
   - Check if "VMInventoryDB" exists with data
   - Clear and re-upload if corrupted

### Issue 3: Browser Freezes When Uploading Large File

**Symptoms**: Browser becomes unresponsive during JSON upload/parsing

**Causes & Solutions**:

1. **File is too large for browser to parse**
   - Maximum recommended: 200MB JSON file
   - If larger, split into multiple uploads
   - Run PowerShell script in parallel jobs for smaller chunks

2. **Insufficient browser memory**
   - Close other tabs to free memory
   - Use a different browser (Chrome usually handles larger files better)
   - Restart browser and try again

3. **Slow disk I/O**
   - IndexedDB operations may be slow on spinning disks
   - Use SSD for better performance
   - Wait longer for upload to complete

### Issue 4: Search Returns "VM Not Found"

**Symptoms**: VM exists but search returns no results

**Causes & Solutions**:

1. **VM name case mismatch**
   - Search is case-insensitive, so this shouldn't be the issue
   - Check for leading/trailing spaces in search box
   - Verify exact spelling from dashboard

2. **VM data not loaded**
   - Check if JSON was successfully uploaded
   - Look for green success message after upload
   - Wait for page to reload automatically

3. **Wrong JSON file uploaded**
   - Wrong PowerShell script output
   - JSON from different vCenter inventory
   - Outdated inventory file

4. **VM doesn't exist in any vCenter**
   - VM may have been deleted
   - Check if PowerShell script is querying all vCenters
   - Verify vCenter connectivity in PowerShell

### Issue 5: "Clear Inventory" Button Deletes All Data

**Symptoms**: Accidentally cleared data

**Causes & Solutions**:

1. **Re-upload JSON file**
   - Use the "Update Inventory" section
   - Select your latest JSON file
   - Wait for page reload

2. **Restore from backup**
   - If you have previous JSON exports, use those
   - Jenkins should have artifacts with historical data
   - Upload any recent JSON snapshot

### Issue 6: Dashboard Very Slow to Load

**Symptoms**: Page takes 10+ seconds to load or display results

**Causes & Solutions**:

1. **IndexedDB query is slow with large dataset**
   - This is normal for 10,000+ VMs
   - First load may take longer (caching helps)
   - Summary and Trends sections query all data

2. **Network connectivity issue**
   - Check internet connection
   - Dashboard doesn't require network (all local), so likely browser cache
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

3. **Too many vCenters loaded**
   - Trends chart limits to first 5 vCenters
   - This is by design to avoid clutter
   - Summary shows all vCenters

4. **Browser extensions interfering**
   - Disable ad blockers and VPN temporarily
   - Try in incognito/private mode
   - Check browser console for errors (F12 → Console)

### Issue 7: Multi-VM Search Doesn't Find Some VMs

**Symptoms**: Searching for 10 VMs but only gets 5 results

**Causes & Solutions**:

1. **VMs don't exist in current dataset**
   - Only VMs in uploaded JSON are searchable
   - Check if all VMs are present in PowerShell output
   - Verify all vCenters were queried

2. **Extra spaces or line breaks**
   - TextArea may have invisible characters
   - Copy-paste from Excel adds extra spaces
   - Clean input before pasting

3. **JSON array truncated**
   - Large PowerShell output might be cut off
   - Check JSON file is complete (ends with `]`)
   - Re-run PowerShell if incomplete

### Issue 8: vCenter Search Returns No Results

**Symptoms**: Searching for vCenter name shows "Not Found"

**Causes & Solutions**:

1. **Exact name required**
   - Use full vCenter FQDN (e.g., "clpvvvcsa001.bsg.ad.adp.com")
   - Check spelling carefully
   - Copy from Summary section vCenter Summary

2. **vCenter has no VMs**
   - Empty vCenter won't appear in search results
   - Check if any VMs exist for that vCenter
   - PowerShell script may not have queried it

3. **Different vCenter naming in different systems**
   - Confluence may list FQDN, JSON has short name
   - Try both formats
   - Check actual value in vCenter Summary

### Issue 9: Trends Chart Shows Wrong Data

**Symptoms**: Trend line shows sudden spikes or drops

**Causes & Solutions**:

1. **Simulated historical data**
   - Trends use simulated data (±1-2 VM variation)
   - Real historical trends require multiple JSON snapshots
   - Plan to implement actual trend tracking

2. **Only current snapshot shown**
   - For real trends, need to save multiple JSON files daily
   - Use Jenkins to archive JSON in versioned folder
   - Create SQL database to track changes

### Issue 10: Dark Mode Not Working

**Symptoms**: Dashboard stays light even when system dark mode is enabled

**Causes & Solutions**:

1. **Browser dark mode override needed**
   - Check browser settings for dark mode preference
   - Tailwind CSS respects `prefers-color-scheme`
   - Try manual toggle if available

2. **System-wide dark mode not recognized**
   - Some browsers don't pass through OS dark mode
   - Try Chrome/Edge for better support
   - Check "System Dark Mode" in browser settings

## Debug Mode

To enable debug logging, open browser console (F12) and run:

```javascript
// View IndexedDB contents
indexedDB.databases().then(dbs => console.log('Databases:', dbs));

// Manually query IndexedDB
const request = indexedDB.open('VMInventoryDB');
request.onsuccess = (e) => {
  const db = e.target.result;
  const tx = db.transaction('inventory', 'readonly');
  const store = tx.objectStore('inventory');
  store.get(1).onsuccess = (e) => {
    console.log('Stored VMs:', e.target.result?.data?.length);
  };
};
```

## Getting Help

1. **Check Dashboard Docs**: See `DOCS_INDEX.md` for all available guides
2. **Review Automation Guide**: See `AUTOMATION_GUIDE.md` for Jenkins setup
3. **Check Implementation**: See `IMPLEMENTATION_SUMMARY.md` for technical details
4. **Browser Console**: Press F12 and check console for JavaScript errors

## Reporting Issues

Include:
1. Browser and version (Chrome 128, Firefox 131, etc.)
2. Error message text
3. Steps to reproduce
4. JSON file size (approximate)
5. Number of VMs in inventory
6. Browser console errors (F12 → Console tab)
