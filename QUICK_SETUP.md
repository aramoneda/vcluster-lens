# Quick Jenkins Setup - 3 Steps to Automate Dashboard Updates

## Step 1: Get Vercel API Token (2 minutes)

1. Go to https://vercel.com/account/tokens
2. Create new token named `jenkins-vm-dashboard`
3. Copy the token

## Step 2: Add Token to Jenkins (1 minute)

1. Jenkins → **Manage Jenkins** → **Credentials** → **Global**
2. Click **+ Add Credentials**
3. Type: **Secret text**
4. Secret: *paste Vercel token*
5. ID: `vercel-api-token`
6. **Create**

## Step 3: Update Jenkinsfile (1 minute)

Replace your current Jenkinsfile with the provided `Jenkinsfile-updated`.

The key new stage added:
```
stage('Trigger Vercel Redeploy')
```

This automatically deploys dashboard after JSON is updated.

## Step 4: Set Cron Schedule (1 minute)

In Jenkins job → **Configure** → **Build Triggers**:

Enable **Build periodically** with: `H */6 * * *`

This runs every 6 hours.

## Done! 

Your pipeline will now:
1. ✅ Generate VM inventory JSON (PowerShell)
2. ✅ Validate data
3. ✅ Push to GitHub
4. ✅ **AUTO-DEPLOY to live dashboard**

## Test It

1. Click **Build Now** in Jenkins
2. Watch logs for "Vercel redeploy triggered"
3. Check dashboard updates with new data

## Credentials to Set Up

| Credential ID | Type | Value |
|---|---|---|
| `github-vcluster-push` | Username/Password | Your GitHub credentials (already set) |
| `vercel-api-token` | Secret Text | Vercel API token (NEW - add this) |

## Vercel Project Info

- **URL:** https://v0-vcenter-dashboard.vercel.app
- **Project ID:** `prj_bYCYpBAjXW0h0K9ZA1nh3qk7yRmP`
- **Team ID:** `team_cupFjjpvUzFKcEQZ0THYxTLm`

## What Changed

Your old pipeline stopped at:
- ❌ Git push (dashboard didn't auto-update)

New pipeline adds:
- ✅ Vercel API call to redeploy
- ✅ Dashboard automatically updates
- ✅ Logs show deployment status

## Troubleshooting Quick Fixes

| Problem | Solution |
|---|---|
| "Authorization failed" | Check Vercel token in Jenkins credentials |
| "Project not found" | Verify Project ID and Team ID match |
| Dashboard still not updated | Hard refresh browser (Ctrl+Shift+R) |
| No redeploy stage appears | You're using old Jenkinsfile - replace with `Jenkinsfile-updated` |

That's it! Your dashboard will auto-update every 6 hours.
