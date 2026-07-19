'use client';

import { useEffect, useState } from 'react';
import { getVCenters, VCenterStats, getCacheTimestamp, clearCache } from '@/lib/search';
import { TrendingUp, HardDrive, Power, RefreshCw } from 'lucide-react';

export function TrendingMetrics() {
  const [vcenters, setVcenters] = useState<VCenterStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = async () => {
    const data = await getVCenters();
    setVcenters(data);
    const timestamp = getCacheTimestamp();
    if (timestamp) {
      setLastUpdated(new Date(timestamp));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // Auto-refresh every 8 hours (28,800,000 ms)
    const interval = setInterval(async () => {
      clearCache();
      await loadData();
    }, 8 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    clearCache();
    await loadData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  // Calculate metrics
  const topMemoryVcenters = vcenters
    .map(vc => ({
      vcenter: vc.vcenter,
      memory: vc.vms.reduce((sum, vm) => sum + (vm.memory_gb || 0), 0),
    }))
    .sort((a, b) => b.memory - a.memory)
    .slice(0, 3);

  const topStorageVcenters = vcenters
    .map(vc => ({
      vcenter: vc.vcenter,
      storage: vc.vms.reduce((sum, vm) => sum + (vm.provisioned_gb || 0), 0),
    }))
    .sort((a, b) => b.storage - a.storage)
    .slice(0, 3);

  const topPoweredOffVcenters = vcenters
    .map(vc => ({
      vcenter: vc.vcenter,
      poweredOff: vc.vms.filter(vm => vm.power_state === 'PoweredOff').length,
    }))
    .sort((a, b) => b.poweredOff - a.poweredOff)
    .slice(0, 3);

  const maxMemory = Math.max(...topMemoryVcenters.map(v => v.memory), 1);
  const maxStorage = Math.max(...topStorageVcenters.map(v => v.storage), 1);
  const maxPoweredOff = Math.max(...topPoweredOffVcenters.map(v => v.poweredOff), 1);

  const formatGB = (gb: number) => {
    if (gb >= 1024) return (gb / 1024).toFixed(1) + ' TB';
    return gb.toFixed(0) + ' GB';
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs text-slate-400">
          {lastUpdated && (
            <span>Last updated: {lastUpdated.toLocaleString()}</span>
          )}
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-3 py-1 text-xs bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-slate-200 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          title="Refresh data (normally updates every 8 hours)"
        >
          <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      {/* Most Memory Used */}
      <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 rounded-lg p-4 shadow-md border border-purple-700/50">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-semibold text-purple-200">Most Memory Used</h3>
        </div>
        <div className="space-y-3">
          {topMemoryVcenters.map((item, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-purple-300 truncate flex-1" title={item.vcenter}>
                  {item.vcenter.substring(0, 20)}...
                </span>
                <span className="text-purple-100 font-semibold ml-2">{formatGB(item.memory)}</span>
              </div>
              <div className="bg-purple-950/40 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-purple-400 h-full rounded-full transition-all"
                  style={{ width: `${(item.memory / maxMemory) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Most Storage Used */}
      <div className="bg-gradient-to-br from-cyan-900/40 to-cyan-800/40 rounded-lg p-4 shadow-md border border-cyan-700/50">
        <div className="flex items-center gap-2 mb-4">
          <HardDrive className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-semibold text-cyan-200">Most Storage Used</h3>
        </div>
        <div className="space-y-3">
          {topStorageVcenters.map((item, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-cyan-300 truncate flex-1" title={item.vcenter}>
                  {item.vcenter.substring(0, 20)}...
                </span>
                <span className="text-cyan-100 font-semibold ml-2">{formatGB(item.storage)}</span>
              </div>
              <div className="bg-cyan-950/40 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-full rounded-full transition-all"
                  style={{ width: `${(item.storage / maxStorage) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Most Powered Off VMs */}
      <div className="bg-gradient-to-br from-orange-900/40 to-orange-800/40 rounded-lg p-4 shadow-md border border-orange-700/50">
        <div className="flex items-center gap-2 mb-4">
          <Power className="w-5 h-5 text-orange-400" />
          <h3 className="text-sm font-semibold text-orange-200">Most Powered Off VMs</h3>
        </div>
        <div className="space-y-3">
          {topPoweredOffVcenters.map((item, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-orange-300 truncate flex-1" title={item.vcenter}>
                  {item.vcenter.substring(0, 20)}...
                </span>
                <span className="text-orange-100 font-semibold ml-2">{item.poweredOff} VMs</span>
              </div>
              <div className="bg-orange-950/40 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-500 to-orange-400 h-full rounded-full transition-all"
                  style={{ width: `${(item.poweredOff / maxPoweredOff) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
