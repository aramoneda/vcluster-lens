// Jenkins Pipeline Configuration for VM Inventory Collection
// 
// Save this as: Jenkinsfile in your repository
// Or create a new Jenkins job and paste this as the pipeline script
//

pipeline {
    agent {
        // Use Windows agent since PowerShell script runs on Windows utility server
        label 'windows'
    }
    
    triggers {
        // Run daily at 2:00 AM
        cron('H 2 * * *')
        
        // Optionally allow manual triggers
        // Define: Build whenever a SNAPSHOT dependency is built
    }
    
    options {
        // Keep last 30 builds
        buildDiscarder(logRotator(numToKeepStr: '30'))
        
        // Add timestamps to console output
        timestamps()
        
        // Timeout after 1 hour
        timeout(time: 1, unit: 'HOURS')
    }
    
    environment {
        // Path to PowerShell script
        PS_SCRIPT = 'C:\\path\\to\\vm_inventory.ps1'
        
        // Output directory
        OUTPUT_DIR = 'C:\\jenkins\\inventory'
        
        // Report directory
        REPORT_DIR = 'C:\\jenkins\\reports'
        
        // Email configuration
        RECIPIENT = 'your-email@broadridge.com'
    }
    
    stages {
        stage('Prepare') {
            steps {
                echo '=== Preparing Environment ==='
                script {
                    // Create necessary directories
                    powershell '''
                        if (-not (Test-Path $env:OUTPUT_DIR)) {
                            New-Item -ItemType Directory -Path $env:OUTPUT_DIR -Force | Out-Null
                            Write-Output "Created output directory: $env:OUTPUT_DIR"
                        }
                        
                        if (-not (Test-Path $env:REPORT_DIR)) {
                            New-Item -ItemType Directory -Path $env:REPORT_DIR -Force | Out-Null
                            Write-Output "Created report directory: $env:REPORT_DIR"
                        }
                        
                        Write-Output "Environment prepared at: $(Get-Date)"
                    '''
                }
            }
        }
        
        stage('Collect VM Inventory') {
            steps {
                echo '=== Collecting VM Inventory ==='
                script {
                    powershell '''
                        Write-Output "Starting VM inventory collection..."
                        Write-Output "Script location: $env:PS_SCRIPT"
                        Write-Output "Output directory: $env:OUTPUT_DIR"
                        
                        # Execute the PowerShell script
                        # Make sure the script is signed or execution policy allows it
                        & $env:PS_SCRIPT
                        
                        if ($LASTEXITCODE -ne 0) {
                            Write-Error "PowerShell script failed with exit code: $LASTEXITCODE"
                            exit 1
                        }
                        
                        Write-Output "VM inventory collection completed"
                    '''
                }
            }
        }
        
        stage('Validate JSON') {
            steps {
                echo '=== Validating JSON Output ==='
                script {
                    powershell '''
                        $jsonFile = "$env:OUTPUT_DIR\\vm_inventory_latest.json"
                        
                        if (-not (Test-Path $jsonFile)) {
                            Write-Error "JSON file not found at: $jsonFile"
                            exit 1
                        }
                        
                        Write-Output "JSON file size: $(Get-Item $jsonFile).Length bytes"
                        
                        try {
                            $json = Get-Content $jsonFile -Raw
                            $data = $json | ConvertFrom-Json
                            
                            Write-Output "✓ JSON is valid"
                            Write-Output "  Total VMs: $($data.Count)"
                            
                            # Validate required fields
                            $firstVm = $data[0]
                            $requiredFields = @('vm_name', 'vcenter', 'power_state', 'site')
                            
                            $missingFields = @()
                            foreach ($field in $requiredFields) {
                                if (-not ($field -in $firstVm.PSObject.Properties.Name)) {
                                    $missingFields += $field
                                }
                            }
                            
                            if ($missingFields.Count -gt 0) {
                                Write-Error "Missing required fields: $($missingFields -join ', ')"
                                exit 1
                            }
                            
                            Write-Output "✓ Required fields validated"
                            
                            # Show sample data
                            Write-Output ""
                            Write-Output "Sample VM:"
                            Write-Output "  Name: $($firstVm.vm_name)"
                            Write-Output "  vCenter: $($firstVm.vcenter)"
                            Write-Output "  Power: $($firstVm.power_state)"
                            Write-Output "  Site: $($firstVm.site)"
                        }
                        catch {
                            Write-Error "JSON validation failed: $_"
                            exit 1
                        }
                    '''
                }
            }
        }
        
        stage('Archive Report') {
            steps {
                echo '=== Archiving Report ==='
                script {
                    powershell '''
                        $timestamp = Get-Date -Format 'yyyy-MM-dd'
                        $sourceFile = "$env:OUTPUT_DIR\\vm_inventory_latest.json"
                        $archiveFile = "$env:REPORT_DIR\\vm_inventory_$timestamp.json"
                        
                        Copy-Item $sourceFile -Destination $archiveFile -Force
                        Write-Output "Archived to: $archiveFile"
                        
                        # Show last 5 archives
                        Write-Output ""
                        Write-Output "Recent archived reports:"
                        Get-Item "$env:REPORT_DIR\\vm_inventory_*.json" | 
                            Sort-Object LastWriteTime -Descending | 
                            Select-Object -First 5 | 
                            ForEach-Object { Write-Output "  - $($_.Name)" }
                    '''
                }
            }
        }
        
        stage('Clean Old Reports') {
            steps {
                echo '=== Cleaning Old Reports ==='
                script {
                    powershell '''
                        $cutoffDate = (Get-Date).AddDays(-30)
                        $oldFiles = Get-Item "$env:REPORT_DIR\\vm_inventory_*.json" | 
                            Where-Object { $_.LastWriteTime -lt $cutoffDate }
                        
                        if ($oldFiles.Count -gt 0) {
                            Write-Output "Removing $($oldFiles.Count) old reports (older than 30 days)"
                            $oldFiles | Remove-Item -Force
                        }
                        else {
                            Write-Output "No old reports to clean"
                        }
                    '''
                }
            }
        }
        
        stage('Send Report') {
            steps {
                echo '=== Sending Report Email ==='
                
                // Use Jenkins Email Plugin
                emailext(
                    subject: "VM Inventory Report - ${BUILD_TIMESTAMP}",
                    body: '''
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <style>
                                body { font-family: Arial, sans-serif; }
                                .container { max-width: 600px; margin: 0 auto; }
                                .header { background-color: #0066cc; color: white; padding: 20px; border-radius: 5px; }
                                .content { padding: 20px; background-color: #f5f5f5; border-radius: 5px; margin-top: 20px; }
                                .footer { font-size: 12px; color: #666; margin-top: 20px; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    <h1>Daily VM Inventory Report</h1>
                                </div>
                                <div class="content">
                                    <p>Your VM inventory has been collected and is ready for review.</p>
                                    <p><strong>Report Date:</strong> ${BUILD_TIMESTAMP}</p>
                                    <p><strong>Status:</strong> SUCCESS</p>
                                    <p>The JSON inventory file is attached to this email.</p>
                                    <hr>
                                    <p><strong>How to use:</strong></p>
                                    <ol>
                                        <li>Download the attached JSON file</li>
                                        <li>Go to the VM Monitoring Dashboard</li>
                                        <li>Click "Update Inventory" at the top</li>
                                        <li>Drag and drop the JSON file</li>
                                        <li>Dashboard will update automatically</li>
                                    </ol>
                                </div>
                                <div class="footer">
                                    <p>This is an automated report. Please do not reply to this email.</p>
                                </div>
                            </div>
                        </body>
                        </html>
                    ''',
                    to: '${RECIPIENT}',
                    mimeType: 'text/html',
                    attachmentsPattern: 'C:\\\\jenkins\\\\inventory\\\\vm_inventory_latest.json',
                    recipientProviders: [developers(), requestor()]
                )
            }
        }
    }
    
    post {
        success {
            echo '✓ Pipeline completed successfully'
            script {
                powershell '''
                    Write-Output ""
                    Write-Output "=========================================="
                    Write-Output "SUCCESS: VM inventory collection completed"
                    Write-Output "=========================================="
                    Write-Output "Report sent to: $env:RECIPIENT"
                    Write-Output "Archive location: $env:REPORT_DIR"
                    Write-Output "Completion time: $(Get-Date)"
                '''
            }
        }
        
        failure {
            echo '✗ Pipeline failed'
            
            // Send failure notification
            emailext(
                subject: "VM Inventory Collection FAILED - ${BUILD_TIMESTAMP}",
                body: '''
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; }
                            .error { background-color: #ff6666; color: white; padding: 20px; border-radius: 5px; }
                        </style>
                    </head>
                    <body>
                        <div class="error">
                            <h1>❌ VM Inventory Collection Failed</h1>
                            <p>The scheduled VM inventory collection job has failed.</p>
                            <p><strong>Build Number:</strong> ${BUILD_NUMBER}</p>
                            <p><strong>Build URL:</strong> ${BUILD_URL}</p>
                            <p>Please check the Jenkins logs for details.</p>
                        </div>
                    </body>
                    </html>
                ''',
                to: '${RECIPIENT}',
                mimeType: 'text/html'
            )
            
            script {
                powershell '''
                    Write-Error ""
                    Write-Error "=========================================="
                    Write-Error "FAILURE: VM inventory collection failed"
                    Write-Error "=========================================="
                    Write-Error "Check Jenkins logs for details"
                    Write-Error "Build URL: ${BUILD_URL}"
                '''
            }
        }
        
        always {
            echo '=== Pipeline Cleanup ==='
            
            // Archive logs
            archiveArtifacts(
                artifacts: 'C:\\jenkins\\inventory\\**/*.json',
                allowEmptyArchive: true
            )
            
            // Clean workspace if needed
            script {
                powershell '''
                    Write-Output "Pipeline execution completed at: $(Get-Date)"
                '''
            }
        }
    }
}

/*
=== SETUP INSTRUCTIONS ===

1. Save this file as "Jenkinsfile" in your repository root

2. In Jenkins, create a new job:
   - Type: Pipeline
   - Enable: "Pipeline script from SCM"
   - Repository: Your repo
   - Script path: Jenkinsfile

3. Configure:
   - Update 'PS_SCRIPT' path to your actual PowerShell script
   - Update 'RECIPIENT' email address
   - Adjust cron schedule if needed:
     * H 2 * * *    = Daily at 2 AM
     * H */6 * * *  = Every 6 hours
     * H 2 * * 1-5  = Weekdays only

4. Ensure Jenkins has:
   - Email plugin installed
   - Windows slave node labeled 'windows'
   - PowerShell execution policy allows script execution

5. Test by triggering manually first

=== TROUBLESHOOTING ===

If email not sending:
- Jenkins > Manage Jenkins > Configure System > Email Notification
- Configure SMTP server and sender email

If script not running:
- Check PowerShell execution policy
- Verify script path exists
- Run script manually from Windows server first

If JSON validation fails:
- Verify PowerShell script outputs valid JSON
- Check ConvertFrom-Json validation passes
*/
