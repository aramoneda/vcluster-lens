'use client';

import { useEffect, useState } from 'react';
import { getOverallStats, getVCenters, VCenterStats } from '@/lib/search';
import { Server, Zap, Power, AlertCircle } from 'lucide-react';

export function Summary() {
  const [stats, setStats] = useState<any | null>(null);
  const [vcenters, setVcenters] = useState<VCenterStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const s = await getOverallStats();
      const v = await getVCenters();
      setStats(s);
      setVcenters(v);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Stats - Compact */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div className="bg-white dark:bg-slate-900 rounded-lg p-3 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total VMs</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.total_vms}</p>
            </div>
            <Server className="w-6 h-6 text-blue-500 opacity-20 flex-shrink-0" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg p-3 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">vCenters</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.total_vcenters}</p>
            </div>
            <AlertCircle className="w-6 h-6 text-purple-500 opacity-20 flex-shrink-0" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg p-3 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Powered On</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">{stats.powered_on}</p>
            </div>
            <Power className="w-6 h-6 text-green-500 opacity-20 flex-shrink-0" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg p-3 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Powered Off</p>
              <p className="text-xl font-bold text-gray-600 dark:text-gray-400">{stats.powered_off}</p>
            </div>
            <Zap className="w-6 h-6 text-gray-400 opacity-20 flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* vCenter Summary - Compact Grid (10 per row) */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-3 shadow-sm">
        <h3 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">vCenters ({vcenters.length})</h3>
        <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 gap-2">
          {vcenters.map((vc) => (
            <div
              key={vc.vcenter}
              className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/50 rounded-lg p-2 border border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow h-20 flex flex-col justify-between group cursor-pointer"
              title={`${vc.vcenter} - Click to copy`}
              onClick={() => {
                navigator.clipboard.writeText(vc.vcenter);
              }}
            >
              <div className="min-h-0">
                <p className="text-xs font-semibold text-blue-900 dark:text-blue-300 break-words leading-tight group-hover:underline">
                  {vc.vcenter}
                </p>
              </div>
              <div className="space-y-0.5 pt-1 border-t border-blue-200 dark:border-blue-800/50">
                <p className="text-xs text-gray-700 dark:text-gray-400">
                  <span className="font-semibold">{vc.total_vms}</span> VMs
                </p>
                <div className="flex gap-1 text-xs">
                  <span className="text-green-600 dark:text-green-400 font-semibold">{vc.powered_on}</span>
                  <span className="text-gray-500 dark:text-gray-500">/</span>
                  <span className="text-gray-600 dark:text-gray-400">{vc.powered_off}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
