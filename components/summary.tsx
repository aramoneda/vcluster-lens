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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 rounded-lg p-4 shadow-md border border-blue-700/50 hover:border-blue-600 transition-colors">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs text-blue-300">Total VMs</p>
            <p className="text-2xl font-bold text-blue-100">{stats.total_vms}</p>
          </div>
          <Server className="w-8 h-8 text-blue-400 opacity-40 flex-shrink-0" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-900/40 to-indigo-800/40 rounded-lg p-4 shadow-md border border-indigo-700/50 hover:border-indigo-600 transition-colors">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs text-indigo-300">vCenters</p>
            <p className="text-2xl font-bold text-indigo-100">{stats.total_vcenters}</p>
          </div>
          <AlertCircle className="w-8 h-8 text-indigo-400 opacity-40 flex-shrink-0" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/40 rounded-lg p-4 shadow-md border border-emerald-700/50 hover:border-emerald-600 transition-colors">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs text-emerald-300">Powered On</p>
            <p className="text-2xl font-bold text-emerald-100">{stats.powered_on}</p>
          </div>
          <Power className="w-8 h-8 text-emerald-400 opacity-40 flex-shrink-0" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-700/40 to-slate-600/40 rounded-lg p-4 shadow-md border border-slate-600/50 hover:border-slate-500 transition-colors">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs text-slate-300">Powered Off</p>
            <p className="text-2xl font-bold text-slate-100">{stats.powered_off}</p>
          </div>
          <Zap className="w-8 h-8 text-slate-400 opacity-40 flex-shrink-0" />
        </div>
      </div>
    </div>
  );
}
