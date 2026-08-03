'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock, HardDrive, Activity, Server } from 'lucide-react';

interface BackupInfo {
  backup_server?: string;
  backup_policy?: string;
  backup_status?: string;
  backup_last_time?: string;
  backup_type?: string;
  backup_duration?: string;
  backup_data_transferred?: string;
  backup_schedule?: string;
  backup_tags?: string[];
}

interface RecentEvent {
  timestamp?: string;
  event_type?: string;
  description?: string;
  severity?: 'info' | 'warning' | 'error' | 'success';
}

interface VMDetailsWithBackupsProps {
  vm: any;
  backupInfo?: BackupInfo;
  recentEvents?: RecentEvent[];
}

export function VMDetailsWithBackupsPreview({ vm, backupInfo = {}, recentEvents = [] }: VMDetailsWithBackupsProps) {
  const [activeTab, setActiveTab] = useState('details');

  const getBackupStatusColor = (status?: string) => {
    if (!status) return 'bg-slate-600';
    if (status.toLowerCase().includes('success') || status.toLowerCase().includes('completed')) return 'bg-emerald-600';
    if (status.toLowerCase().includes('failed') || status.toLowerCase().includes('error')) return 'bg-red-600';
    if (status.toLowerCase().includes('pending') || status.toLowerCase().includes('in progress')) return 'bg-blue-600';
    return 'bg-slate-600';
  };

  const getEventIcon = (severity?: string) => {
    if (severity === 'success') return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    if (severity === 'error') return <AlertCircle className="w-4 h-4 text-red-400" />;
    if (severity === 'warning') return <AlertCircle className="w-4 h-4 text-yellow-400" />;
    return <Activity className="w-4 h-4 text-blue-400" />;
  };

  return (
    <div className="space-y-6 w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">VM Details</TabsTrigger>
          <TabsTrigger value="backup">Backup Info</TabsTrigger>
          <TabsTrigger value="events">Recent Events</TabsTrigger>
        </TabsList>

        {/* VM DETAILS TAB */}
        <TabsContent value="details" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">{vm.vm_name}</CardTitle>
              <CardDescription>Core VM Information</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-xs text-slate-400 uppercase tracking-wide">Power State</p>
                <Badge variant="outline" className={vm.power_state === 'PoweredOn' ? 'bg-emerald-600 text-white' : 'bg-slate-600 text-white'}>
                  {vm.power_state}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-slate-400 uppercase tracking-wide">vCenter</p>
                <p className="text-sm font-medium text-slate-100">{vm.vcenter}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-slate-400 uppercase tracking-wide">Cluster</p>
                <p className="text-sm font-medium text-slate-100">{vm.cluster}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-slate-400 uppercase tracking-wide">Guest OS</p>
                <p className="text-sm font-medium text-slate-100">{vm.guest_os}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-slate-400 uppercase tracking-wide">Hostname</p>
                <p className="text-sm font-medium text-slate-100">{vm.guest_hostname}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-slate-400 uppercase tracking-wide">IP Address</p>
                <p className="text-sm font-medium text-slate-100">{vm.ip_address}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-slate-400 uppercase tracking-wide">CPU Cores</p>
                <p className="text-lg font-semibold text-slate-100">{vm.num_cpu}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-slate-400 uppercase tracking-wide">Memory</p>
                <p className="text-lg font-semibold text-slate-100">{vm.memory_gb} GB</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-slate-400 uppercase tracking-wide">ESXi Host</p>
                <p className="text-sm font-medium text-slate-100">{vm.esxi_host}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BACKUP INFO TAB */}
        <TabsContent value="backup" className="space-y-4">
          {Object.keys(backupInfo).length > 0 ? (
            <>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <HardDrive className="w-5 h-5" />
                    Backup Status
                  </CardTitle>
                  <CardDescription>Latest backup information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Backup Status Badge */}
                  <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Last Backup Status</p>
                      <p className="text-sm text-slate-200">{backupInfo.backup_server || 'N/A'}</p>
                    </div>
                    <Badge className={`${getBackupStatusColor(backupInfo.backup_status)} text-white`}>
                      {backupInfo.backup_status || 'Unknown'}
                    </Badge>
                  </div>

                  {/* Backup Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                      <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Backup Policy</p>
                      <p className="text-sm font-medium text-slate-200">{backupInfo.backup_policy || 'N/A'}</p>
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                      <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Backup Type</p>
                      <p className="text-sm font-medium text-slate-200">{backupInfo.backup_type || 'N/A'}</p>
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                      <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Last Backup Time</p>
                      <p className="text-sm font-medium text-slate-200 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {backupInfo.backup_last_time || 'N/A'}
                      </p>
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                      <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Backup Duration</p>
                      <p className="text-sm font-medium text-slate-200">{backupInfo.backup_duration || 'N/A'}</p>
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                      <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Data Transferred</p>
                      <p className="text-sm font-medium text-slate-200">{backupInfo.backup_data_transferred || 'N/A'}</p>
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                      <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Backup Schedule</p>
                      <p className="text-sm font-medium text-slate-200">{backupInfo.backup_schedule || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Backup Tags */}
                  {backupInfo.backup_tags && backupInfo.backup_tags.length > 0 && (
                    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                      <p className="text-xs text-slate-400 uppercase tracking-wide mb-3">Backup Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {backupInfo.backup_tags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-slate-700 text-slate-100">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <HardDrive className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">No backup information available</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* RECENT EVENTS TAB */}
        <TabsContent value="events" className="space-y-4">
          {recentEvents && recentEvents.length > 0 ? (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Last {recentEvents.length} events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentEvents.map((event, idx) => (
                    <div key={idx} className="flex gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                      <div className="flex-shrink-0 pt-1">
                        {getEventIcon(event.severity)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-slate-200 truncate">{event.event_type || 'Event'}</p>
                          {event.severity && (
                            <Badge variant="outline" className={
                              event.severity === 'success' ? 'bg-emerald-600/20 text-emerald-300' :
                              event.severity === 'error' ? 'bg-red-600/20 text-red-300' :
                              event.severity === 'warning' ? 'bg-yellow-600/20 text-yellow-300' :
                              'bg-blue-600/20 text-blue-300'
                            }>
                              {event.severity}
                            </Badge>
                          )}
                        </div>
                        {event.description && (
                          <p className="text-xs text-slate-400 mt-1">{event.description}</p>
                        )}
                        {event.timestamp && (
                          <p className="text-xs text-slate-500 mt-2">{event.timestamp}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Activity className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">No recent events available</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
