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
  );
}
