# GitHub Auto-Deploy Guide

## How It Works

Your Vercel project is already configured to automatically deploy whenever you push changes to GitHub. This is the simplest and most reliable approach.

## Pipeline Flow

1. **Jenkins Job (runs every 6 hours via cron)**
   - Generates new VM inventory JSON
   - Validates the JSON
   - Commits changes to GitHub
   - Pushes to `main` branch

2. **GitHub Webhook (automatic)**
   - Detects push to `main` branch
   - Notifies Vercel

3. **Vercel Auto-Deploy (automatic)**
   - Receives webhook notification
   - Triggers new deployment
   - Builds and deploys your dashboard

## No Manual Triggers Needed

You don't need to:
- Call Vercel API endpoints
- Create Deploy Hooks
- Configure API tokens
- Trigger deployments manually

Just push to GitHub, and Vercel handles the rest automatically.

## Verify It's Working

1. Go to your Vercel project dashboard
2. Check the **Deployments** tab
3. You should see a new deployment whenever Jenkins pushes updates

## If Deployment is Blocked

Check the Deployment Details for these common issues:

- **Git Email Mismatch**: Ensure the Jenkins git config email matches your GitHub account email
- **Branch Mismatch**: Make sure you're pushing to the `main` branch (or your configured production branch)
- **GitHub Integration**: Verify Vercel's GitHub app is installed and has proper permissions

## Using the Simplified Pipeline

Replace your current Jenkinsfile with `Jenkinsfile-simplified` which:
- Generates and validates VM inventory JSON
- Commits and pushes to GitHub
- Lets Vercel handle auto-deployment
- Removes unnecessary API complexity

No additional credentials or configuration needed beyond your existing GitHub setup!
