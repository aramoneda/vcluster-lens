# VM Monitoring Dashboard - Automation Guide

## Overview

This guide explains how to automate the delivery of VM inventory JSON files to the dashboard, keeping it updated with the latest vCenter data.

## Architecture

```
Windows Utility Server (Jenkins Slave)
    ↓
PowerShell Script (collects VM inventory)
    ↓
Generates JSON file
    ↓
Jenkins Job (daily/weekly schedule)
    ↓
Upload JSON to Dashboard App
    ↓
Dashboard reads and displays data
```

## Phase 1: PowerShell Script (Already Have)

You already have a working PowerShell script that collects VM inventory from all vCenters. This script outputs a JSON file with VM details.

### Current JSON Format
```json
[
  {
    "collection_time": "2026-07-14T20:47:04.3314572-04:00",
    "site": "Broadridge Clifton Data Center",
    "vcenter": "clpvvvcsa001",
    "vcenter_version": "7.0.3",
    "vcenter_ip": "10.10.121.248",
    "vm_name": "cldvvssp002",
    "power_state": "PoweredOn",
    "guest_os": "Ubuntu Linux (64-bit)",
    "guest_hostname": "cldvvssp002",
    "ip_address": "10.101.147.21",
    ...
  }
]
```

## Phase 2: Manual JSON Upload (Current - For Testing)

1. **Generate the JSON file** using your PowerShell script
2. **Upload to dashboard** by importing the JSON file
3. Dashboard reads and displays the data

### How to Use:
- Copy your JSON file content
- The app stores it in browser memory
- Search and filter functionality is available immediately

## Phase 3: Automated Daily/Weekly Updates (Setup Instructions)

### Option A: Email-Based Delivery (Recommended for Initial Setup)

**Setup on Windows Utility Server:**

1. **Add PowerShell script to generate JSON:**
   - Modify your existing script to output to a fixed location, e.g., `C:\jenkins\inventory\vm_inventory_latest.json`
   - Add timestamp to filename: `vm_inventory_YYYY-MM-DD.json`

2. **Create Jenkins Job:**
   ```
   Name: VM-Inventory-Collection
   Type: Free-style job
   
   Build Triggers:
   - Check "Build periodically"
   - Cron: H 2 * * * (runs at 2 AM daily)
   
   Build Steps:
   - Windows Batch Command (or PowerShell):
     powershell -ExecutionPolicy Bypass -File C:\path\to\vm_inventory.ps1
   
   Post-build Actions:
   - Email Notification:
     Recipients: your-email@broadridge.com
     Attachments: **/*.json
     Subject: Daily VM Inventory Report
   ```

3. **Configure Email:**
   - Jenkins → Manage Jenkins → Configure System → Email Notification
   - Configure SMTP server for Broadridge

### Option B: GitHub Repository Integration (Recommended for Long-term)

**Setup:**

1. **Create private GitHub repository:**
   - Repo name: `vm-inventory-data`
   - Initialize with README

2. **Generate GitHub Personal Access Token:**
   - Go to Settings → Developer settings → Personal access tokens
   - Scopes: `repo` (full control of private repositories)
   - Copy token

3. **Modify PowerShell script** to commit to GitHub:

```powershell
# After generating JSON
$jsonPath = "C:\jenkins\inventory\vm_inventory_latest.json"
$repoPath = "C:\repos\vm-inventory-data"
$gitHubToken = $env:GITHUB_TOKEN

# Copy JSON to repo
Copy-Item $jsonPath -Destination "$repoPath\vm_inventory_latest.json"

# Commit and push
cd $repoPath
git add vm_inventory_latest.json
git commit -m "Update VM inventory - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git push origin main

# Alternative: Use REST API for direct commit
$headers = @{
    "Authorization" = "token $gitHubToken"
    "Accept" = "application/vnd.github.v3+json"
}

$content = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Content $jsonPath -Raw)))

$body = @{
    message = "Update VM inventory"
    content = $content
    branch = "main"
} | ConvertTo-Json

Invoke-RestMethod -Method Put `
  -Uri "https://api.github.com/repos/YOUR_USERNAME/vm-inventory-data/contents/vm_inventory_latest.json" `
  -Headers $headers `
  -Body $body
```

4. **Jenkins Job with GitHub Push:**

```
Build Steps:
- PowerShell:
  powershell -ExecutionPolicy Bypass -File C:\path\to\vm_inventory.ps1
  
Post-build Actions:
- Git Publisher:
  Push Only If Build Succeeds: ✓
  Branches: main
```

## Phase 4: Dashboard Enhancement (Future - File Upload API)

For a permanent solution, we can add an API endpoint to the dashboard that accepts JSON uploads.

**Create `/api/inventory/upload` endpoint** (to be implemented):
- Accept POST requests with JSON file
- Store in database or cloud storage
- Maintain 30-day rolling history
- Return confirmation

**Jenkins Job would then:**
```bash
$token = "YOUR_API_TOKEN"
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$json = Get-Content "C:\jenkins\inventory\vm_inventory_latest.json" -Raw

Invoke-RestMethod -Method Post `
  -Uri "https://your-dashboard-domain.com/api/inventory/upload" `
  -Headers $headers `
  -Body $json
```

## Current Implementation

The dashboard currently works with **in-memory data** from the provided JSON file. This means:

✅ **Supports:**
- Single VM search by name
- vCenter search with VM list
- Multi-VM search (newline-separated names)
- Real-time filtering and sorting
- Trend visualization (30-day simulated data)
- Power state distribution charts
- vCenter summary cards

⚠️ **Limitations:**
- Data resets on page refresh (stored in memory)
- No persistent history
- No automatic updates

## How to Use Daily

### Immediate (Testing Phase):
1. Run your PowerShell script to generate `vm_inventory_latest.json`
2. Copy the JSON content
3. Paste into dashboard search
4. Use search features to find VMs

### Short-term (Jenkins Automation):
1. Set up Jenkins job to run PowerShell script daily
2. Configure email to send JSON attachment
3. When you receive email, download attachment
4. Upload new JSON to dashboard
5. Dashboard automatically reloads with latest data

### Long-term (Full Automation):
Implement the API upload endpoint so Jenkins can push directly to dashboard without manual steps.

## Sample Jenkins Pipeline (Groovy)

```groovy
pipeline {
    agent any
    
    triggers {
        cron('H 2 * * *')  // Daily at 2 AM
    }
    
    stages {
        stage('Collect VM Inventory') {
            steps {
                script {
                    powershell '''
                        # Run your vCenter inventory collection
                        .\\path\\to\\vm_inventory.ps1
                        
                        # Verify JSON was created
                        if (-not (Test-Path "C:\\jenkins\\inventory\\vm_inventory_latest.json")) {
                            Write-Error "JSON file not found"
                            exit 1
                        }
                    '''
                }
            }
        }
        
        stage('Prepare Report') {
            steps {
                script {
                    def timestamp = new Date().format('yyyy-MM-dd')
                    sh 'cp C:\\jenkins\\inventory\\vm_inventory_latest.json C:\\jenkins\\reports\\vm_inventory_${timestamp}.json'
                }
            }
        }
        
        stage('Send Email') {
            steps {
                emailext(
                    subject: "Daily VM Inventory Report - ${BUILD_TIMESTAMP}",
                    body: 'Please find attached the latest VM inventory report.',
                    to: 'your-email@broadridge.com',
                    attachmentsPattern: 'C:\\jenkins\\reports\\vm_inventory_*.json'
                )
            }
        }
    }
    
    post {
        always {
            // Cleanup old reports (keep last 30 days)
            sh 'find C:\\jenkins\\reports -name "vm_inventory_*.json" -mtime +30 -delete'
        }
        
        failure {
            emailext(
                subject: "VM Inventory Collection FAILED",
                body: "Build failed. Check Jenkins logs.",
                to: 'your-email@broadridge.com'
            )
        }
    }
}
```

## Testing Automation

1. **Manual Test:**
   - Run Jenkins job manually
   - Verify JSON file is created
   - Verify email is sent

2. **Validate JSON:**
   ```powershell
   # Verify JSON is valid
   $json = Get-Content "vm_inventory_latest.json" -Raw
   $obj = $json | ConvertFrom-Json
   Write-Output "Found $($obj.Count) VMs"
   ```

3. **Monitor Scheduled Runs:**
   - Jenkins → Build History
   - Check job logs for errors
   - Monitor email delivery

## Troubleshooting

| Issue | Solution |
|-------|----------|
| PowerShell script fails | Verify vCenter credentials, check network connectivity, run script manually first |
| JSON file not created | Verify script outputs to correct path, check folder permissions |
| Email not sent | Verify SMTP configuration in Jenkins, check email recipient settings |
| JSON format error | Validate JSON with `ConvertFrom-Json` before sending |
| Jenkins job not running | Check cron syntax, verify Jenkins is running, check system time |

## Next Steps

1. **Immediate:** Set up Jenkins job for daily collection
2. **Short-term:** Configure email delivery (1-2 days)
3. **Long-term:** Implement API upload endpoint for full automation (1-2 weeks)
4. **Optional:** Add database backend for historical trend analysis

## Questions?

For technical details on the dashboard implementation, see:
- `/lib/search.ts` - Search logic
- `/components/*` - React components
- `/app/page.tsx` - Main dashboard page
