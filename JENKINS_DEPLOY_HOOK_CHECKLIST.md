# Jenkins Vercel Deploy Hook Setup Checklist

## Prerequisites
- Vercel Deploy Hook URL created in Vercel project
- Jenkins access with credential management permissions

## Step-by-Step Setup

### 1. Get Your Vercel Deploy Hook URL
```
✓ Go to: https://vercel.com/dashboard
✓ Select your project: v0-vcenter-dashboard
✓ Settings → Git → Deploy Hooks
✓ Create new Deploy Hook (select "main" branch)
✓ Copy the webhook URL (looks like: https://api.vercel.com/v1/integrations/deploy/prj_xxx/xxx)
```

### 2. Add Credential to Jenkins
```
✓ Go to: Jenkins → Manage Jenkins → Manage Credentials
✓ Click: Global (or your domain)
✓ Add Credentials
   - Kind: Secret text
   - Secret: [PASTE YOUR VERCEL DEPLOY HOOK URL HERE]
   - ID: vercel-deploy-hook
   - Description: Vercel Deploy Hook for vCluster Dashboard
✓ Click: Create
```

### 3. Update Your Jenkinsfile
```
Replace your current Jenkinsfile with: Jenkinsfile-final

Key changes:
- Improved error handling and retry logic (3 attempts)
- Better logging to debug credential issues
- Proper credential variable mapping: VERCEL_HOOK
- Helpful error message if credential is not found
```

### 4. Test the Pipeline
```
✓ Run your Jenkins job manually
✓ Check Build Console Output
✓ Look for: "[Deploy] SUCCESS: Vercel deployment triggered!"
✓ Check Vercel Dashboard to see deployment in progress
```

## Troubleshooting

### Error: "Vercel Deploy Hook credential is empty or not configured!"
**Solution:** 
1. Go to Jenkins → Manage Credentials
2. Verify 'vercel-deploy-hook' credential exists
3. Verify the Secret value is not empty (paste your Vercel hook URL)
4. Re-run the job

### Error: "Failed to trigger Vercel deployment after 3 attempts"
**Solution:**
1. Verify your Vercel Deploy Hook URL is correct
2. Check the URL is accessible from Jenkins server
3. Look at the HTTP Status in Jenkins logs
4. Try the URL manually with curl:
   ```bash
   curl -X POST https://api.vercel.com/v1/integrations/deploy/prj_xxx/xxx
   ```

### Dashboard Not Updating After Deployment
**Solution:**
1. Check Vercel Dashboard for deployment status (may still be building)
2. Clear browser cache
3. Check if Jenkins job actually completed successfully
4. Verify JSON file was pushed to GitHub (check git push output in logs)

## Verification

After running the pipeline:
- [ ] Jenkins job shows "SUCCESS"
- [ ] "[Deploy] SUCCESS: Vercel deployment triggered!" appears in logs
- [ ] Vercel shows new deployment in progress
- [ ] Dashboard reflects new data after ~2-3 minutes

## Cron Schedule (Optional)

To run every 6 hours:
```
H */6 * * *
```

Set this in Jenkins job configuration → Build Triggers → Poll SCM (or use Cron as needed)
