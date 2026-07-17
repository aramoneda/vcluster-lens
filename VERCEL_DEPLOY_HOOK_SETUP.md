# Vercel Deploy Hook Setup for Jenkins

## Overview

This guide explains how to use Vercel's Deploy Hook (webhook) to automatically trigger dashboard deployments when your Jenkins job runs every 6 hours.

## Setup Steps

### 1. Create Vercel Deploy Hook

1. Go to your Vercel project dashboard: https://vercel.com/dashboard
2. Select your project: `v0-vcenter-dashboard`
3. Navigate to **Settings** → **Git**
4. Look for **Deploy Hooks** section
5. Click **Create Hook**
6. Name it: `Jenkins Redeploy`
7. Select Branch: `main`
8. Click **Create**
9. Copy the webhook URL (looks like: `https://api.vercel.com/v1/integrations/deploy/prj_xxx/xxx`)

### 2. Add Credential to Jenkins

1. Go to Jenkins Dashboard
2. Navigate to **Manage Jenkins** → **Manage Credentials**
3. Select **System** → **Global credentials**
4. Click **Add Credentials**
5. Configure as follows:
   - **Kind:** Secret text
   - **Secret:** Paste your Deploy Hook URL (the full URL from step 1)
   - **ID:** `vercel-deploy-hook`
   - **Description:** Vercel Deploy Hook for vCluster Dashboard
6. Click **Create**

### 3. Update Jenkins Pipeline

The updated `Jenkinsfile` already includes the Deploy Hook integration. It will:

1. Generate VM inventory JSON
2. Validate the data
3. Commit and push to GitHub
4. Automatically trigger Vercel deployment via Deploy Hook

## How It Works

```
Jenkins Job (every 6 hours)
    ↓
Generate VM Inventory JSON
    ↓
Validate JSON
    ↓
Commit & Push to GitHub
    ↓
POST to Vercel Deploy Hook
    ↓
Vercel automatically rebuilds and deploys dashboard
    ↓
Dashboard updated with new VM data
```

## Verify It's Working

1. **Run Jenkins Job**: Manually trigger the job once to test
2. **Check Vercel Deployments**: Go to your Vercel project → Deployments tab
3. **Look for new deployment**: Should see a deployment with message "Triggered by Deploy Hook"
4. **Verify Dashboard**: Check https://v0-vcenter-dashboard.vercel.app for updated data

## Troubleshooting

### Deploy Hook not triggering?
- Verify the credential ID is `vercel-deploy-hook` in Jenkins
- Check the Deploy Hook URL is correct (starts with `https://api.vercel.com`)
- Look at Jenkins pipeline logs for HTTP status codes

### Deployment fails on Vercel?
- Check Vercel project logs: Settings → Logs
- Verify GitHub push succeeded (check git push logs in Jenkins)
- Ensure JSON is valid before push

### Pipeline continues on hook failure?
- The pipeline is configured to fail if the Deploy Hook request fails
- Check Jenkins logs for the exact error
- Verify network connectivity from Jenkins to api.vercel.com

## Benefits of Deploy Hook vs API

✅ Simple POST request (no auth token needed in webhook)
✅ Reliable webhook delivery
✅ Built-in Vercel feature (no API versioning issues)
✅ Easy to troubleshoot via Vercel dashboard
✅ Automatic retry handling

## Testing Manually

You can test the Deploy Hook directly:

```bash
curl -X POST "YOUR_DEPLOY_HOOK_URL"
```

This should immediately trigger a deployment on Vercel.

## Next Steps

1. Get the Deploy Hook URL from Vercel
2. Add it as a Jenkins credential with ID: `vercel-deploy-hook`
3. Set up Jenkins cron job: `H */6 * * *` (every 6 hours)
4. Run first test manually
5. Monitor deployments on Vercel dashboard
