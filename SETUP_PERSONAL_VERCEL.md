# Setup vCluster-Lens on Personal Vercel Account (Hobby)

## Overview
This guide mirrors your entire dashboard setup from the Broadridge Enterprise account to your personal Hobby account (`aristotleramoneda`).

## Prerequisites
- You must be logged into your personal Vercel account (aristotleramoneda - Hobby)
- GitHub repo: `aramoneda/vcluster-lens` (already connected to Enterprise, will auto-sync)
- Your personal account has Owner permissions

## Step-by-Step Setup

### Step 1: Create New Project in Personal Vercel

1. Go to: https://vercel.com/dashboard
2. Make sure you're logged into your **Hobby account** (not Broadridge Enterprise)
3. Click **"Add New" → "Project"**
4. Select **"aramoneda/vcluster-lens"** from GitHub
5. Click **"Import"**

### Step 2: Configure Framework & Build

**Framework Settings:**
- Framework Preset: **Next.js**
- Root Directory: **.//** (use default)

**Build Command:** (should auto-detect)
```
npm run build
```

**Output Directory:** (should auto-detect)
```
.next
```

**Install Command:** (should auto-detect)
```
npm install
```

### Step 3: Environment Variables

Your project doesn't require special env vars for the basic dashboard (JSON is served from public folder).

If needed later, add from Settings → Environment Variables:
- None required for current setup

### Step 4: Deploy

Click **"Deploy"** and wait for build to complete (should take 2-3 minutes).

**Expected Result:**
- Deployment shows "Ready" (green checkmark)
- You get a live URL like: `https://vcluster-lens-hobby-[random].vercel.app`

### Step 5: Verify Dashboard Works

1. Open your new Vercel URL
2. Test features:
   - Single VM search
   - Multi-VM search
   - vCenter search
   - CSV export
3. Verify data loads (should show current VM inventory)

## Jenkins Integration (Optional)

If you want Jenkins to auto-deploy when pushing JSON updates:

### Option A: Use GitHub Auto-Deploy (Recommended)
- Already configured! Just push to `main` branch
- Vercel auto-deploys on every push
- No additional setup needed

### Option B: Add Deploy Hook (Alternative)

1. In Vercel project: Settings → Git → Deploy Hooks
2. Click **"Create Hook"**
   - Name: `Jenkins Redeploy`
   - Branch: `main`
3. Copy the generated webhook URL
4. In Jenkins: Add as credential `vercel-deploy-hook`
5. Use webhook in pipeline (optional)

## Vercel Project Settings Reference

Once deployed, your project settings should match:

```
Project Name: vcluster-lens
Framework: Next.js
Git Repository: aramoneda/vcluster-lens
Git Branch: main
Region: Default (Washington, D.C.)
Environment: Production
```

## Custom Domain (Optional)

If you want a custom domain instead of Vercel's auto-generated URL:

1. Settings → Domains
2. Add your custom domain
3. Follow Vercel's DNS instructions

## Troubleshooting

### Deployment Failed
- Check build logs in Vercel dashboard
- Ensure Node.js dependencies are correct
- Verify package.json exists in root

### Data Not Loading
- Check that `public/vm-inventory.json` exists in GitHub
- Verify file is properly committed and pushed
- Check browser console for 404 errors

### GitHub Auto-Deploy Not Triggering
- Verify GitHub app permissions in Vercel → Settings → Integrations
- Check that repo is connected to project
- Ensure you're pushing to `main` branch

## Next Steps

After successful deployment on personal account:

1. **Test the dashboard** - Verify all features work
2. **Update Jenkins** - If using webhook, add new Deploy Hook URL
3. **Monitor deployments** - Check Vercel dashboard for auto-deploys on git push
4. **Share dashboard URL** - Use new personal account URL with team

## Support

For issues:
- Check Vercel dashboard → Deployments → Build logs
- Review GitHub Actions if auto-deploy isn't triggering
- Verify project settings match framework requirements

---

**Dashboard Features Available:**
- Single VM search with detailed specs
- Multi-VM search with table results
- vCenter search and VM listing
- CSV export functionality
- Storage information display (Provisioned/Used GB)
- VM compatibility information
- Dark mode support
