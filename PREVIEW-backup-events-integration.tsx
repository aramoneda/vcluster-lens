'use client';

import { ChevronDown, ChevronUp, Clock, Database, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { useState } from 'react';

/**
 * PREVIEW: How backup data and recent events would be displayed
 * This shows the new sections that would be added below VM search results
 */

export function BackupEventsPreview() {
  const [expandedBackup, setExpandedBackup] = useState(true);
  const [expandedEvents, setExpandedEvents] = useState(true);

  const vmResult = {
    vm_name: 'edpvtasa11',
    power_state: 'poweredOn',
    hostname: 'edpvtasa11.broadridge.net',
    vcenter: 'clpvvcsa003.broadridge.net',
    cluster: 'ciqls04-c01',
    num_cpu: 4,
    memory_gb: 8,
    provisioned_gb: 500,
    used_gb: 250,
    guest_os: 'Windows Server 2022',
    tools_status: 'ok'
  };

  // NEW: Backup data from updated JSON
  const backupData = {
    backup_server: 'IBM-Spectrum-Protect-01',
    backup_policy: 'Daily-Full-Weekly-Inc',
    backup_type: 'Full',
    backup_schedule: 'Daily at 23:00 UTC',
    backup_last_ibm_spectrum_protect: '2024-07-27T22:45:00Z',
    backup_status: 'Success',
    backup_duration: '2 hours 15 minutes',
    backup_data_transferred: '125.5 GB',
    backup_tags: ['prod', 'critical', 'finance']
  };

  // NEW: Recent events from updated JSON
  const recentEvents = [
    {
      type: 'backup_completed',
      timestamp: '2024-07-27T22:45:00Z',
      severity: 'success',
      message: 'Full backup completed successfully'
    },
    {
      type: 'vm_snapshot',
      timestamp: '2024-07-26T15:30:00Z',
      severity: 'info',
      message: 'VM snapshot created for maintenance'
    },
    {
      type: 'backup_warning',
      timestamp: '2024-07-25T23:15:00Z',
      severity: 'warning',
      message: 'Backup took longer than expected (2h 15m vs 1h 30m avg)'
    },
    {
      type: 'power_event',
      timestamp: '2024-07-24T12:00:00Z',
      severity: 'info',
      message: 'VM powered on'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'error':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'info':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'info':
        return <Info className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full space-y-4 bg-slate-950 rounded-lg p-6">
      {/* EXISTING: VM Details Summary */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Search Result: {vmResult.vm_name}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-slate-400">Power State:</span>
            <span className="text-white ml-2 font-medium">On</span>
          </div>
          <div>
            <span className="text-slate-400">vCenter:</span>
            <span className="text-white ml-2 font-medium">{vmResult.vcenter}</span>
          </div>
          <div>
            <span className="text-slate-400">CPU/Memory:</span>
            <span className="text-white ml-2 font-medium">{vmResult.num_cpu} vCPU / {vmResult.memory_gb}GB</span>
          </div>
          <div>
            <span className="text-slate-400">Storage:</span>
            <span className="text-white ml-2 font-medium">{vmResult.used_gb}GB / {vmResult.provisioned_gb}GB</span>
          </div>
        </div>
      </div>

      {/* NEW: Backup Information Section */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
        <button
          onClick={() => setExpandedBackup(!expandedBackup)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Backup Information</h3>
            {backupData.backup_status === 'Success' && (
              <span className="ml-2 px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded border border-emerald-500/30">
                ✓ Success
              </span>
            )}
          </div>
          {expandedBackup ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {expandedBackup && (
          <div className="px-4 py-3 border-t border-slate-700 space-y-3 text-sm">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <span className="text-slate-400">Backup Server</span>
                <p className="text-white font-medium mt-1">{backupData.backup_server}</p>
              </div>
              <div>
                <span className="text-slate-400">Backup Policy</span>
                <p className="text-white font-medium mt-1">{backupData.backup_policy}</p>
              </div>
              <div>
                <span className="text-slate-400">Backup Type</span>
                <p className="text-white font-medium mt-1">{backupData.backup_type}</p>
              </div>
              <div>
                <span className="text-slate-400">Schedule</span>
                <p className="text-white font-medium mt-1">{backupData.backup_schedule}</p>
              </div>
              <div>
                <span className="text-slate-400">Last Backup</span>
                <p className="text-white font-medium mt-1">{formatDate(backupData.backup_last_ibm_spectrum_protect)}</p>
              </div>
              <div>
                <span className="text-slate-400">Duration</span>
                <p className="text-white font-medium mt-1">{backupData.backup_duration}</p>
              </div>
              <div className="md:col-span-2">
                <span className="text-slate-400">Data Transferred</span>
                <p className="text-white font-medium mt-1">{backupData.backup_data_transferred}</p>
              </div>
            </div>

            {/* Backup Tags */}
            <div>
              <span className="text-slate-400">Tags</span>
              <div className="flex gap-2 mt-2 flex-wrap">
                {backupData.backup_tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded border border-blue-500/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* NEW: Recent Events Section */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
        <button
          onClick={() => setExpandedEvents(!expandedEvents)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Recent Events</h3>
            <span className="ml-2 px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
              {recentEvents.length} events
            </span>
          </div>
          {expandedEvents ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {expandedEvents && (
          <div className="px-4 py-3 border-t border-slate-700 space-y-3">
            {recentEvents.map((event, idx) => (
              <div
                key={idx}
                className={`p-3 rounded border flex gap-3 items-start ${getSeverityColor(event.severity)}`}
              >
                <div className="mt-0.5">{getSeverityIcon(event.severity)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium line-clamp-1">{event.message}</p>
                  <p className="text-xs opacity-75 mt-1">{formatDate(event.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Integration Notes */}
      <div className="mt-8 pt-4 border-t border-slate-700 text-xs text-slate-400">
        <p className="font-semibold text-slate-300 mb-2">Integration Approach:</p>
        <ul className="space-y-1 ml-2 list-disc">
          <li>These sections appear below each VM search result</li>
          <li>Sections are collapsible to keep UI clean and performant</li>
          <li>Backup data comes from new JSON fields in updated vm-inventory.json</li>
          <li>Recent events populated from recent_events array in VM record</li>
          <li>Severity badges color-coded (green=success, red=error, yellow=warning, blue=info)</li>
          <li>Design matches existing dashboard theme: dark slate with accent colors</li>
        </ul>
      </div>
    </div>
  );
}
