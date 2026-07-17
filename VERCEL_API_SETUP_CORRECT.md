# Vercel API Redeploy Setup - Correct Method

## The Fix

Your previous pipeline was failing because:
1. **Wrong URL format** - Using `?teamId=` query parameter instead of path parameter
2. **Correct format**: `https://api.vercel.com/v13/teams/{teamId}/projects/{projectId}/redeploy`

## Step 1: Get Your Vercel API Token

1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name it: `Jenkins Redeploy`
4. Select Scope: **Full Account** (or at least project redeploy permissions)
5. Copy the token (looks like: `xxx_xxxxxxxxxxxxxxxxxxxxx`)

## Step 2: Add to Jenkins Credentials

1. Go to Jenkins → **Manage Credentials**
2. Click **Global** → **Add Credentials**
3. Fill in:
   - **Kind**: Secret text
   - **Secret**: Paste your Vercel token
   - **ID**: `vercel-api-token` (IMPORTANT - must match pipeline)
4. Click **Create**

## Step 3: Use the Fixed Pipeline

Replace your current Jenkinsfile with `Jenkinsfile-vercel-api-fixed` which includes:
- ✅ Correct API URL format: `/v13/teams/{teamId}/projects/{projectId}/redeploy`
- ✅ Hardcoded Project ID: `prj_bYCYpBAjXW0h0K9ZA1nh3qk7yRmP`
- ✅ Hardcoded Team ID: `team_cupFjjpvUzFKcEQZ0THYxTLm`
- ✅ Better error logging to show exactly what URL is being called
- ✅ Error response parsing to help debug any issues

## Step 4: Test

Run your Jenkins job. You should see in the logs:
```
[Pipeline] Triggering Vercel redeploy...
[Pipeline] API URL: https://api.vercel.com/v13/teams/team_cupFjjpvUzFKcEQZ0THYxTLm/projects/prj_bYCYpBAjXW0h0K9ZA1nh3qk7yRmP/redeploy
[Pipeline] Sending POST request...
[Pipeline] ✓ Vercel redeploy triggered successfully!
[Pipeline] Response Status: 200
```

## Vercel Token Permissions

Make sure your token has:
- ✅ `read` - Read project info
- ✅ `write` - Deploy/redeploy permissions
- ✅ Full Account scope (recommended for simplicity)

## Troubleshooting

If you get 401/403 errors:
- Token might be expired or revoked
- Generate a new token at https://vercel.com/account/tokens

If you get 404 errors:
- Verify Project ID is correct: `prj_bYCYpBAjXW0h0K9ZA1nh3qk7yRmP`
- Verify Team ID is correct: `team_cupFjjpvUzFKcEQZ0THYxTLm`

If you get other errors:
- Check the full error response in Jenkins logs
- The pipeline now prints detailed error messages to help debug
