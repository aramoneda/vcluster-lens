# Jenkins & Vercel Integration Setup Guide

This guide explains how to set up the automated dashboard updates using Jenkins and Vercel.

## Overview

The updated Jenkins pipeline now:
1. Generates the VM inventory JSON
2. Validates the data
3. Commits and pushes to GitHub
4. **Automatically triggers a Vercel redeploy** to update the live dashboard

## Prerequisites

- Jenkins server with PowerShell support
- GitHub credentials configured in Jenkins (`github-vcluster-push`)
- Vercel API token
- Vercel Project ID and Team ID

## Step 1: Get Vercel API Token

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard)
2. Go to **Settings → Tokens**
3. Click **Create** to generate a new token
   - Name: `jenkins-vm-dashboard`
   - Scope: Full access or `deployments:write` if available
4. Copy the token (you won't see it again)

**Current Project Details:**
- **Project ID:** `prj_bYCYpBAjXW0h0K9ZA1nh3qk7yRmP`
- **Team ID:** `team_cupFjjpvUzFKcEQZ0THYxTLm`
- **Project URL:** https://v0-vcenter-dashboard.vercel.app

## Step 2: Add Vercel Token to Jenkins

1. In Jenkins, go to **Manage Jenkins → Manage Credentials**
2. Select the appropriate credentials store (usually "Global")
3. Click **Add Credentials** → **Secret text**
   - **Secret:** Paste your Vercel API token
   - **ID:** `vercel-api-token` (must match the pipeline)
   - **Description:** Vercel API Token for VM Dashboard
4. Click **Create**

## Step 3: Update Jenkins Pipeline

Replace your current Jenkinsfile with the updated `Jenkinsfile-updated` which includes:

### Key Changes:

**New Environment Variables:**
```groovy
VERCEL_PROJECT_ID = 'prj_bYCYpBAjXW0h0K9ZA1nh3qk7yRmP'
VERCEL_TEAM_ID = 'team_cupFjjpvUzFKcEQZ0THYxTLm'
VERCEL_API_URL = 'https://api.vercel.com'
```

**New Stage: 'Trigger Vercel Redeploy'**
- Runs after successful Git push
- Calls Vercel API to redeploy the project
- Rebuilds the Next.js app with new JSON data

**Optional: Next.js Revalidation**
- Alternative faster method using ISR (Incremental Static Regeneration)
- Only runs if `USE_NEXTJS_REVALIDATE=true` environment variable is set

## Step 4: Set Up Cron Schedule

In Jenkins job configuration:

1. Go to **Build Triggers**
2. Enable **Build periodically**
3. Set cron expression for every 6 hours:
   ```
   H */6 * * *
   ```
   This runs at hours 0, 6, 12, 18 (varies by 0-59 minute to balance load)

## Step 5: Verify Setup

Run a test pipeline manually:

1. Click **Build Now** in Jenkins
2. Watch the build logs for:
   - ✅ JSON generation
   - ✅ JSON validation
   - ✅ Git commit and push
   - ✅ **Vercel redeploy trigger** (new stage)
3. Check Vercel dashboard for deployment status
4. Verify dashboard is updated with new data

## Troubleshooting

### Vercel Redeploy Fails

**Error: "Authorization failed"**
- Verify Vercel token in Jenkins credentials
- Ensure token hasn't expired (Vercel tokens are permanent)
- Check token has correct permissions

**Error: "Project not found"**
- Verify Project ID and Team ID are correct
- Project ID: `prj_bYCYpBAjXW0h0K9ZA1nh3qk7yRmP`
- Team ID: `team_cupFjjpvUzFKcEQZ0THYxTLm`

**Error: "No changes detected"**
- Pipeline skips deployment if JSON hasn't changed
- This is expected behavior - no unnecessary rebuilds

### Dashboard Not Updating

1. **Check Git Push:**
   - Verify `vm-inventory.json` was committed to `public/` folder
   - Check GitHub Actions/Vercel Github App integration

2. **Check Vercel Deployment:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - View project deployments
   - Check if new deployment succeeded or failed

3. **Clear Browser Cache:**
   - Hard refresh dashboard (Ctrl+Shift+R or Cmd+Shift+R)
   - Check in private/incognito window

4. **Check Next.js Cache:**
   - Vercel may cache the old JSON data
   - Revalidation happens automatically on redeploy

## Alternative: Next.js API Revalidation (Faster Updates)

For faster updates without full rebuilds, you can set up a server action:

1. Add environment variable to Jenkins: `USE_NEXTJS_REVALIDATE=true`
2. Create API route in Next.js for revalidation:

```typescript
// app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Optional: Add security check
  const authHeader = request.headers.get('authorization');
  
  try {
    revalidateTag('vm-inventory');
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to revalidate' }, { status: 500 });
  }
}
```

## Monitoring

### Recommended Jenkins Plugins
- **Log Parser Plugin** - Color-code log output
- **Email Extension** - Send notifications on success/failure
- **Vercel Plugin** (if available) - Direct integration

### Notifications

Add to Jenkins pipeline to get notified:
```groovy
post {
    success {
        mail to: 'team@broadridge.com',
        subject: "VM Dashboard Updated",
        body: "Jenkins job completed. Dashboard refreshed with latest inventory."
    }
    failure {
        mail to: 'team@broadridge.com',
        subject: "VM Dashboard Update Failed",
        body: "Check Jenkins logs: ${BUILD_URL}"
    }
}
```

## References

- [Vercel API Documentation](https://vercel.com/docs/rest-api)
- [Vercel Redeploy Endpoint](https://vercel.com/docs/rest-api#endpoints/deployments/redeploy-a-deployment)
- [Next.js Incremental Static Regeneration](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration)
- [Jenkins Credentials Plugin](https://plugins.jenkins.io/credentials/)
