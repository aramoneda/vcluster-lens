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
      {/* Summary Stats - More Compact */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total VMs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total_vms}</p>
            </div>
            <Server className="w-8 h-8 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">vCenters</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total_vcenters}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-purple-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Powered On</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.powered_on}</p>
            </div>
            <Power className="w-8 h-8 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Powered Off</p>
              <p className="text-2xl font-bold text-gray-600 dark:text-gray-400 mt-1">{stats.powered_off}</p>
            </div>
            <Zap className="w-8 h-8 text-gray-400 opacity-20" />
          </div>
        </div>
      </div>

      {/* vCenter Summary - Compact Table */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">vCenter Summary ({vcenters.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
              <tr>
                <th className="text-left px-3 py-2 font-semibold text-gray-900 dark:text-white">vCenter</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-900 dark:text-white">Site</th>
                <th className="text-center px-3 py-2 font-semibold text-gray-900 dark:text-white">Total</th>
                <th className="text-center px-3 py-2 font-semibold text-green-600 dark:text-green-400">On</th>
                <th className="text-center px-3 py-2 font-semibold text-gray-600 dark:text-gray-400">Off</th>
              </tr>
            </thead>
            <tbody>
              {vcenters.map((vc) => (
                <tr key={vc.vcenter} className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800">
                  <td className="px-3 py-2 text-blue-600 dark:text-blue-400 font-medium">{vc.vcenter}</td>
                  <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{vc.site}</td>
                  <td className="px-3 py-2 text-center font-semibold text-gray-900 dark:text-white">{vc.total_vms}</td>
                  <td className="px-3 py-2 text-center font-semibold text-green-600 dark:text-green-400">{vc.powered_on}</td>
                  <td className="px-3 py-2 text-center font-semibold text-gray-600 dark:text-gray-400">{vc.powered_off}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
