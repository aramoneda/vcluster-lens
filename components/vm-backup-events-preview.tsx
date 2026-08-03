'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HardDrive, Clock, CheckCircle, AlertCircle, XCircle, AlertTriangle, Activity } from 'lucide-react';

interface BackupData {
  backup_server?: string;
  backup_policy?: string;
  backup_status?: string;
  backup_type?: string;
  backup_start_time?: string;
  backup_end_time?: string;
  backup_duration?: string;
  backup_data_transferred?: string;
  backup_schedule?: string;
  backup_last_ibm_spectrum_protect?: string;
  backup_tags_text?: string;
}

interface RecentEvent {
  type: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  description: string;
  timestamp?: string;
}

interface VMWithBackupData {
  vm_name: string;
  power_state: string;
  guest_os: string;
  backup_data?: BackupData;
  recent_events?: RecentEvent[];
}

export function VMBackupEventsPreview() {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  // Sample data showing structure
  const sampleVM: VMWithBackupData = {
    vm_name: 'edppvltasa11',
    power_state: 'PoweredOn',
    guest_os: 'Windows Server 2019',
    backup_data: {
      backup_server: 'IBM Spectrum Protect',
      backup_policy: 'DAILY_FULL_BACKUP',
      backup_status: 'SUCCESS',
      backup_type: 'Full',
      backup_start_time: '2026-07-27T02:00:00Z',
      backup_end_time: '2026-07-27T05:30:00Z',
      backup_duration: '3 hours 30 minutes',
      backup_data_transferred: '850 GB',
      backup_schedule: 'Daily at 2:00 AM',
      backup_last_ibm_spectrum_protect: '2026-07-27',
      backup_tags_text: 'production, critical, compliance',
    },
    recent_events: [
      {
        type: 'Backup',
        severity: 'success',
        description: 'Full backup completed successfully',
        timestamp: '2026-07-27 05:30 AM',
      },
      {
        type: 'Backup',
        severity: 'success',
        description: 'Incremental backup completed',
        timestamp: '2026-07-26 05:30 AM',
      },
      {
        type: 'Power Event',
        severity: 'info',
        description: 'VM powered on',
        timestamp: '2026-07-26 08:00 AM',
      },
      {
        type: 'Snapshot',
        severity: 'warning',
        description: 'Snapshot older than 7 days detected',
        timestamp: '2026-07-25 12:30 PM',
      },
      {
        type: 'Backup',
        severity: 'error',
        description: 'Backup failed - insufficient space',
        timestamp: '2026-07-24 03:00 AM',
      },
    ],
  };

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getBackupStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'SUCCESS':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'FAILED':
      case 'ERROR':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'PENDING':
      case 'IN_PROGRESS':
        return <AlertCircle className="w-4 h-4 text-blue-400" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success':
        return 'bg-green-900/30 border-green-500/50 text-green-400';
      case 'error':
        return 'bg-red-900/30 border-red-500/50 text-red-400';
      case 'warning':
        return 'bg-yellow-900/30 border-yellow-500/50 text-yellow-400';
      case 'info':
        return 'bg-blue-900/30 border-blue-500/50 text-blue-400';
      default:
        return 'bg-slate-900/30 border-slate-500/50 text-slate-400';
    }
  };

  return (
    <div className="space-y-4 mt-6">
      {/* Backup Information Section */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('backup')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-800/50 transition"
        >
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-200">Backup Information</span>
            <div className="flex items-center gap-2 ml-2">
              {getBackupStatusIcon(sampleVM.backup_data?.backup_status || '')}
              <span className="text-xs px-2 py-1 bg-green-900/30 border border-green-500/30 text-green-400 rounded">
                {sampleVM.backup_data?.backup_status || 'N/A'}
              </span>
            </div>
          </div>
          {expandedSections['backup'] ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {expandedSections['backup'] && (
          <div className="border-t border-slate-700 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Backup Server</p>
                <p className="text-sm text-slate-200">{sampleVM.backup_data?.backup_server || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Backup Policy</p>
                <p className="text-sm text-slate-200">{sampleVM.backup_data?.backup_policy || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Backup Type</p>
                <p className="text-sm text-slate-200">{sampleVM.backup_data?.backup_type || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Backup Schedule</p>
                <p className="text-sm text-slate-200">{sampleVM.backup_data?.backup_schedule || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Last Backup Time</p>
                <p className="text-sm text-slate-200 flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  {sampleVM.backup_data?.backup_start_time ? new Date(sampleVM.backup_data.backup_start_time).toLocaleString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Backup Duration</p>
                <p className="text-sm text-slate-200">{sampleVM.backup_data?.backup_duration || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Data Transferred</p>
                <p className="text-sm text-slate-200">{sampleVM.backup_data?.backup_data_transferred || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Backup Tags</p>
                <p className="text-sm text-slate-200">{sampleVM.backup_data?.backup_tags_text || 'None'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Events Section */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('events')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-800/50 transition"
        >
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-200">Recent Events</span>
            <span className="text-xs px-2 py-1 bg-slate-800 text-slate-400 rounded ml-2">
              {sampleVM.recent_events?.length || 0} events
            </span>
          </div>
          {expandedSections['events'] ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {expandedSections['events'] && (
          <div className="border-t border-slate-700 p-4">
            <div className="space-y-3">
              {sampleVM.recent_events?.map((event, idx) => (
                <div
                  key={idx}
                  className={`border rounded-lg p-3 ${getSeverityColor(event.severity)}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1">
                      <div className="mt-1">
                        {event.severity === 'success' && <CheckCircle className="w-4 h-4" />}
                        {event.severity === 'error' && <XCircle className="w-4 h-4" />}
                        {event.severity === 'warning' && <AlertTriangle className="w-4 h-4" />}
                        {event.severity === 'info' && <AlertCircle className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{event.type}</p>
                        <p className="text-xs opacity-90">{event.description}</p>
                      </div>
                    </div>
                    <span className="text-xs opacity-75 whitespace-nowrap">{event.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
