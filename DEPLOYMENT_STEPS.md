# Deployment Steps to Fix Data on Vercel

## Issue: Old Data Showing on Deployed Site

After updating the JSON data file, the deployed version at `https://v0-vcenter-monitor.vercel.app/` may still show old data because:
- The old `vm-inventory.json` was bundled in the previous build
- Browser IndexedDB cache can persist old data
- Vercel caches the Next.js build

## Solution: Full Redeploy

### Option 1: Push to GitHub (Automatic Deployment)

If your project is connected to GitHub:

```bash
# From the v0 project directory
git add lib/vm-inventory.json
git commit -m "Update VM inventory with complete vCenter list (13,646 VMs, 61 vCenters)"
git push origin main
```

Vercel automatically deploys on every push. Check deployment status at:
https://vercel.com/projects/v0-vcenter-monitor

### Option 2: Manual Redeploy via Vercel CLI

```bash
# Login to Vercel
vercel login

# Deploy from project root
cd /vercel/share/v0-project
vercel --prod --force
```

The `--force` flag ensures a fresh build, bypassing any cache.

### Option 3: Redeploy from Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project "v0-vcenter-monitor"
3. Click "Deployments" tab
4. Find the latest deployment
5. Click the three-dot menu and select "Redeploy"

## Clear Browser Cache

After redeployment, users may need to clear cached data:

1. **Clear IndexedDB:**
   - Open DevTools (F12)
   - Go to Application > IndexedDB > Delete "VM Inventory DB"
   - Refresh the page

2. **Clear All Browser Cache:**
   - Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
   - Select "All time"
   - Clear cache and cookies

## Verify New Data is Live

Once deployed, check that the dashboard shows:
- **Total VMs:** 13,646 (was 2,064)
- **Total vCenters:** 61 (was 52)
- **Powered On:** 12,822
- **Powered Off:** 801

URL to test: https://v0-vcenter-monitor.vercel.app/

## Troubleshooting

If old data persists after redeployment:

1. **Check the deployment log:**
   - Vercel Dashboard > Deployments > Latest > Logs
   - Look for any build errors

2. **Verify file was updated:**
   ```bash
   ls -lh /vercel/share/v0-project/lib/vm-inventory.json
   # Should show 17M (new file) not 2.5M (old file)
   ```

3. **Force Vercel to rebuild:**
   - Click "Redeploy" in Vercel dashboard with fresh cache
   - Or use: `vercel --prod --force`

4. **Check browser cache is cleared:**
   - DevTools > Application > Storage > Clear site data
   - Then hard refresh (Ctrl+F5)

## Automated Updates with Jenkins

For ongoing updates, see `AUTOMATION_GUIDE.md` to set up:
- Scheduled PowerShell script to generate JSON
- Jenkins job to run the script hourly/daily
- Automatic upload to Vercel via Vercel API
