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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total VMs</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.total_vms}</p>
            </div>
            <Server className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total vCenters</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.total_vcenters}</p>
            </div>
            <AlertCircle className="w-12 h-12 text-purple-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Powered On</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{stats.powered_on}</p>
            </div>
            <Power className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Powered Off</p>
              <p className="text-3xl font-bold text-gray-600 dark:text-gray-400 mt-2">{stats.powered_off}</p>
            </div>
            <Zap className="w-12 h-12 text-gray-400 opacity-20" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">vCenter Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vcenters.map((vc) => (
            <div key={vc.vcenter} className="border border-gray-200 dark:border-slate-700 rounded-lg p-4">
              <p className="font-semibold text-blue-600 dark:text-blue-400">{vc.vcenter}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{vc.site}</p>
              <div className="mt-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total VMs:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{vc.total_vms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">On:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">{vc.powered_on}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Off:</span>
                  <span className="font-semibold text-gray-600 dark:text-gray-400">{vc.powered_off}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
