'use client';

import { useState, useEffect } from 'react';
import { getVCenters, VCenterStats } from '@/lib/search';
import { X, TrendingUp, HardDrive, Power } from 'lucide-react';

interface StorageMetric {
  vcenter: string;
  provisioned: number;
  used: number;
  utilization: number;
  wasted: number;
}

export default function ModalPreview() {
  const [vcenters, setVcenters] = useState<VCenterStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [storageMetrics, setStorageMetrics] = useState<StorageMetric[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await getVCenters();
      setVcenters(data);
      
      // Calculate storage metrics for all vCenters
      const metrics = data.map(vc => {
        const totalProvisioned = vc.vms.reduce((sum, vm) => sum + (vm.provisioned_gb || 0), 0);
        const totalUsed = vc.vms.reduce((sum, vm) => sum + (vm.used_gb || 0), 0);
        const utilization = totalProvisioned > 0 ? (totalUsed / totalProvisioned) * 100 : 0;
        
        return {
          vcenter: vc.vcenter,
          provisioned: totalProvisioned,
          used: totalUsed,
          utilization: Math.round(utilization),
          wasted: totalProvisioned - totalUsed,
        };
      }).sort((a, b) => b.provisioned - a.provisioned);
      
      setStorageMetrics(metrics);
      setLoading(false);
    };
    
    loadData();
  }, []);

  const getUtilizationColor = (utilization: number) => {
    if (utilization < 50) return 'bg-red-900/20 border-red-800/50';
    if (utilization < 80) return 'bg-yellow-900/20 border-yellow-800/50';
    return 'bg-green-900/20 border-green-800/50';
  };

  const getUtilizationTextColor = (utilization: number) => {
    if (utilization < 50) return 'text-red-200';
    if (utilization < 80) return 'text-yellow-200';
    return 'text-green-200';
  };

  const formatStorage = (gb: number) => {
    if (gb > 1024) return `${(gb / 1024).toFixed(1)} TB`;
    return `${gb.toFixed(0)} GB`;
  };

  if (loading) {
    return <div className="p-8 text-slate-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">vCenter Dashboard</h1>
        <p className="text-slate-400 mb-8">Virtual Machine Search & Discovery</p>

        {/* Main Dashboard Stats */}
        <div className="grid grid-cols-4 gap-4 mb-12">
          <div className="border border-slate-700 rounded-lg p-6 bg-slate-900/50">
            <div className="text-slate-400 text-sm mb-2">Total VMs</div>
            <div className="text-3xl font-bold">13726</div>
          </div>
          <div className="border border-slate-700 rounded-lg p-6 bg-slate-900/50">
            <div className="text-slate-400 text-sm mb-2">vCenters</div>
            <div className="text-3xl font-bold">61</div>
          </div>
          <div className="border border-slate-700 rounded-lg p-6 bg-slate-900/50">
            <div className="text-slate-400 text-sm mb-2">Powered On</div>
            <div className="text-3xl font-bold text-green-400">12835</div>
          </div>
          <div className="border border-slate-700 rounded-lg p-6 bg-slate-900/50">
            <div className="text-slate-400 text-sm mb-2">Powered Off</div>
            <div className="text-3xl font-bold text-gray-400">868</div>
          </div>
        </div>

        {/* Trending Metrics (Placeholder) */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Trending Metrics</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 border border-purple-700/50 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 mb-4">Most Memory Used</h3>
                  <div className="space-y-2">
                    <div className="text-xs text-slate-400">edmpvlvc6a02.bsg.ad... <span className="text-purple-300 float-right">245 GB</span></div>
                    <div className="text-xs text-slate-400">clmpvlvc6a01.bsg.ad... <span className="text-purple-300 float-right">198 GB</span></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/30 border border-cyan-700/50 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 mb-4">Most Storage Used</h3>
                  <div className="space-y-2">
                    <div className="text-xs text-slate-400">edmpvlvc6a02.bsg.ad... <span className="text-cyan-300 float-right">45.3 TB</span></div>
                    <div className="text-xs text-slate-400">edpvvvcsa003.broadr... <span className="text-cyan-300 float-right">32.1 TB</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/30 border border-orange-700/50 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 mb-4">Most Powered Off VMs</h3>
                  <div className="space-y-2">
                    <div className="text-xs text-slate-400">edmpvlvc6a02.bsg.ad... <span className="text-orange-300 float-right">156 VMs</span></div>
                    <div className="text-xs text-slate-400">edpvvvcsa003.broadr... <span className="text-orange-300 float-right">142 VMs</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Storage Report Button */}
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
          >
            <HardDrive className="w-4 h-4" />
            View Storage Utilization Report
          </button>
        </div>

        {/* Search sections placeholder */}
        <div className="mt-12 text-slate-400">
          <p className="text-sm">Click "View Storage Utilization Report" button above to see the modal...</p>
        </div>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          {/* Modal Panel */}
          <div className="bg-slate-900 border border-slate-700 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="border-b border-slate-700 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Storage Utilization Report</h2>
                <p className="text-slate-400 text-sm mt-1">Provisioned vs Used Storage Analysis for All vCenters</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1 p-6">
              <div className="space-y-3">
                {storageMetrics.map((metric) => (
                  <div
                    key={metric.vcenter}
                    className={`border rounded-lg p-4 ${getUtilizationColor(metric.utilization)}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-slate-100">{metric.vcenter}</h3>
                        <p className={`text-sm font-bold ${getUtilizationTextColor(metric.utilization)}`}>
                          {metric.utilization}% Utilized
                          {metric.utilization < 50 && ' - HIGH WASTE'}
                          {metric.utilization >= 50 && metric.utilization < 80 && ' - MODERATE'}
                          {metric.utilization >= 80 && ' - GOOD'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-300">
                          <span className="font-semibold">{formatStorage(metric.used)}</span>
                          <span className="text-slate-500"> / {formatStorage(metric.provisioned)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Storage Bar */}
                    <div className="w-full bg-slate-800/50 rounded-full h-3 overflow-hidden border border-slate-700">
                      <div className="flex h-full">
                        <div
                          style={{ width: `${metric.utilization}%` }}
                          className={`${
                            metric.utilization < 50
                              ? 'bg-red-500'
                              : metric.utilization < 80
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                        />
                        <div className="flex-1 bg-slate-600/30" />
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                      <div>
                        <p className="text-slate-400">Used Storage</p>
                        <p className="font-semibold text-slate-200">{formatStorage(metric.used)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Provisioned</p>
                        <p className="font-semibold text-slate-200">{formatStorage(metric.provisioned)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Wasted/Available</p>
                        <p className="font-semibold text-red-300">{formatStorage(metric.wasted)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-700 p-4 bg-slate-900/50 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
