# Vercel API 404 Fix

## Problem
The Jenkins pipeline was returning a **404 Not Found** error when trying to trigger the Vercel redeploy.

### Error Details
```
Failed to trigger Vercel redeploy: The remote server returned an error: (404) Not Found.
{"error":{"code":"not_found","message":"Not Found"}}
```

## Root Cause
The API endpoint format was incorrect. The original endpoint was:
```
https://api.vercel.com/v13/projects/{projectId}/redeploy?teamId={teamId}
```

This endpoint doesn't exist in the Vercel API when using a team.

## Solution
Use the correct Vercel API endpoint format that includes the team ID in the path:
```
https://api.vercel.com/v13/teams/{teamId}/projects/{projectId}/redeploy
```

## Changes Made

### Updated Jenkinsfile-corrected

1. **Fixed endpoint URL** - Changed from:
   ```powershell
   $url = "$env:VERCEL_API_URL/v13/projects/$env:VERCEL_PROJECT_ID/redeploy?teamId=$env:VERCEL_TEAM_ID"
   ```
   To:
   ```powershell
   $url = "$env:VERCEL_API_URL/v13/teams/$env:VERCEL_TEAM_ID/projects/$env:VERCEL_PROJECT_ID/redeploy"
   ```

2. **Added environment variables** - Hardcoded the correct Vercel credentials:
   - VERCEL_PROJECT_ID = `prj_bYCYpBAjXW0h0K9ZA1nh3qk7yRmP`
   - VERCEL_TEAM_ID = `team_cupFjjpvUzFKcEQZ0THYxTLm`
   - VERCEL_API_URL = `https://api.vercel.com`

3. **Enhanced error logging** - Added detailed debugging output:
   - Log the URL being called
   - Log response status code and body
   - Log error type and response details

## Deployment Steps

1. Replace your Jenkinsfile with `Jenkinsfile-corrected`
2. Verify the VERCEL_TOKEN credential is set in Jenkins
3. Run the pipeline again

## Verification

The pipeline will now:
1. Generate the JSON from PowerShell inventory collector
2. Validate the JSON structure
3. Commit and push to GitHub
4. **Trigger Vercel redeploy automatically**
5. Dashboard updates within 1-2 minutes

## If Issues Persist

**Check:**
1. VERCEL_TOKEN is valid and has "Deployments Read/Write" scope
2. Team ID and Project ID are correct
3. The token belongs to the correct Vercel team
4. Network connectivity from Jenkins to api.vercel.com

**Debug:**
Run this curl command locally to test:
```bash
curl -X POST \
  https://api.vercel.com/v13/teams/team_cupFjjpvUzFKcEQZ0THYxTLm/projects/prj_bYCYpBAjXW0h0K9ZA1nh3qk7yRmP/redeploy \
  -H "Authorization: Bearer YOUR_VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"skipBuildCache": false}'
```

Expected response: `202 Accepted` (not 200)
