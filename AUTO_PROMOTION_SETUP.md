# Automatic Production Promotion Setup

## Overview

Your Jenkins pipeline now includes automatic promotion to production. When Jenkins pushes updated VM inventory to GitHub, Vercel automatically deploys it and this stage promotes it to production without manual intervention.

## Prerequisites

You need a **Vercel API Token** to enable auto-promotion.

### Step 1: Create Vercel API Token

1. Log into your **personal Vercel account** (aristotleramoneda - Hobby)
2. Go to **Account Settings → Tokens**
3. Click **"Create Token"**
4. Name: `Jenkins Auto-Promotion`
5. Scope: Select your **vcluster-lens** project (or full account access)
6. Copy the token (you'll only see it once)

### Step 2: Add Token to Jenkins

1. Go to **Jenkins → Manage Credentials → Global**
2. Click **"Add Credentials"**
3. Fill in:
   - **Kind**: Secret text
   - **Secret**: Paste your Vercel API token
   - **ID**: `vercel-api-token` (must be exact)
   - **Description**: Vercel API Token for Auto-Promotion
4. Click **"Create"**

### Step 3: Verify Your Pipeline Has Credentials

Your pipeline should already include:
```groovy
withCredentials([string(credentialsId: 'vercel-api-token', variable: 'VERCEL_TOKEN')])
```

If the credential ID is missing or wrong, the pipeline will skip promotion gracefully.

## How It Works

1. **Generate JSON** - VM inventory collector runs and generates JSON
2. **Validate** - JSON is validated for required fields
3. **Commit & Push** - Changes are pushed to GitHub main branch
4. **Auto-Deploy** - GitHub webhook triggers Vercel to build and deploy
5. **Auto-Promote** - Pipeline calls Vercel API to promote deployment to Production
6. **Production Live** - Your dashboard updates with new data

## Pipeline Stages

| Stage | Purpose | Status |
|-------|---------|--------|
| Prepare | Validate configuration | ✅ Always runs |
| Generate JSON | Collect VM inventory | ✅ Always runs |
| Validate JSON | Check data quality | ✅ Always runs |
| Prepare Git Safe Directory | Configure git | ✅ Always runs |
| Git Status | Check repo status | ✅ Always runs |
| Commit and Push | Update GitHub | ✅ Always runs |
| **Promote to Production** | **Auto-promote deployment** | ✅ **NEW** |

## Troubleshooting

### Promotion Stage Shows "WARNING"

**If you see:**
```
[Promote] WARNING: Vercel API token not configured in Jenkins.
```

**Solution:** Add the `vercel-api-token` credential to Jenkins as described above.

### Deployment Not Promoted

**Possible causes:**
1. Vercel API token is invalid or expired
2. Deployment state isn't READY yet (promotion waits)
3. Network connectivity issue (non-fatal, continues anyway)

**Check:**
- Vercel token is valid: Visit https://vercel.com/account/tokens
- Check Jenkins logs for error messages
- Manually check Vercel deployments tab to see deployment status

### Manual Fallback

If auto-promotion fails for any reason:
1. Go to Vercel Dashboard → vcluster-lens → Deployments
2. Find the latest deployment
3. Click **"Promote to Production"** button
4. Dashboard will update immediately

## Configuration Values

Your personal account uses:
- **Project ID**: `prj_zSI02IXLkv6aMx0EEpRp3eV8zyvrg`
- **Team ID**: `[YOUR-TEAM-ID]`
- **Repository**: `aramoneda/vcluster-lens`
- **Main Branch**: `main`
- **Domain**: `icsre-vcenter-dashboard.vercel.app`

## Cron Schedule

Set Jenkins to run this pipeline every 6 hours:
```
H */6 * * *
```

This will generate, validate, commit, and auto-promote VM inventory updates 4 times daily.

## Monitoring

After each run, check:
1. **Jenkins** - Build log for success/failure
2. **GitHub** - Commit history in aramoneda/vcluster-lens
3. **Vercel** - Deployments showing promotion status
4. **Dashboard** - VM data updated at https://icsre-vcenter-dashboard.vercel.app
