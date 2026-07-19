'use client';

import { useEffect, useState } from 'react';
import { getVCenters, VCenterStats } from '@/lib/search';
import { X } from 'lucide-react';

const getStatusColor = (utilization: number) => {
  if (utilization >= 80) return { bg: 'bg-green-900', border: 'border-green-700' };
  if (utilization >= 50) return { bg: 'bg-orange-900', border: 'border-orange-700' };
  return { bg: 'bg-red-900', border: 'border-red-700' };
};

const getNoDataColor = () => {
  return { bg: 'bg-slate-700', border: 'border-slate-600' };
};

export default function AnalyticsPreview() {
  const [vcenters, setVcenters] = useState<VCenterStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<'storage' | 'memory' | 'powered-off' | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const vcenterData = await getVCenters();
      setVcenters(vcenterData);
      setLoading(false);
    };
    loadData();
  }, []);

  // Calculate storage metrics
  const calculateStorageMetrics = () => {
    const metrics: Record<string, { provisioned: number; used: number; vcenter: string }> = {};
    
    vcenters.forEach(vc => {
      const vcVMs = vc.vms || [];
      const provisioned = vcVMs.reduce((sum, vm) => sum + (vm.provisioned_gb || 0), 0);
      const used = vcVMs.reduce((sum, vm) => sum + (vm.used_gb || 0), 0);
      
      metrics[vc.vcenter] = {
        provisioned: provisioned / 1024,
        used: used / 1024,
        vcenter: vc.vcenter
      };
    });
    
    return metrics;
  };

  // Calculate memory metrics
  const calculateMemoryMetrics = () => {
    const metrics: Record<string, { allocated: number; used: number; vcenter: string }> = {};
    
    vcenters.forEach(vc => {
      const vcVMs = vc.vms || [];
      const allocated = vcVMs.reduce((sum, vm) => sum + (vm.memory_gb || 0), 0);
      const used = vcVMs
        .filter(vm => vm.power_state === 'PoweredOn')
        .reduce((sum, vm) => sum + (vm.memory_gb || 0), 0);
      
      metrics[vc.vcenter] = {
        allocated,
        used,
        vcenter: vc.vcenter
      };
    });
    
    return metrics;
  };

  // Calculate powered-off metrics
  const calculatePoweredOffMetrics = () => {
    const metrics: Record<string, { count: number; storage: number; vcenter: string }> = {};
    
    vcenters.forEach(vc => {
      const vcVMs = vc.vms || [];
      const poweredOff = vcVMs.filter(vm => vm.power_state === 'PoweredOff');
      const count = poweredOff.length;
      const storage = poweredOff.reduce((sum, vm) => sum + (vm.provisioned_gb || 0), 0);
      
      metrics[vc.vcenter] = {
        count,
        storage: storage / 1024,
        vcenter: vc.vcenter
      };
    });
    
    return metrics;
  };

  const storageMetrics = calculateStorageMetrics();
  const memoryMetrics = calculateMemoryMetrics();
  const poweredOffMetrics = calculatePoweredOffMetrics();

  if (loading) {
    return <div className="p-8 text-center text-slate-300">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Infrastructure Analytics</h1>
          <p className="text-slate-400 mt-2">Click any card to view detailed analysis</p>
        </div>

        {/* Top 4 Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-400 text-sm">Total VMs</p>
            <p className="text-3xl font-bold text-white mt-2">{vcenters.reduce((sum, vc) => sum + (vc.vms?.length || 0), 0).toLocaleString()}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-400 text-sm">vCenters</p>
            <p className="text-3xl font-bold text-white mt-2">{vcenters.length}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-400 text-sm">Powered On</p>
            <p className="text-3xl font-bold text-green-400 mt-2">{vcenters.reduce((sum, vc) => sum + (vc.vms?.filter((v: any) => v.power_state === 'PoweredOn').length || 0), 0).toLocaleString()}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <p className="text-slate-400 text-sm">Powered Off</p>
            <p className="text-3xl font-bold text-slate-300 mt-2">{vcenters.reduce((sum, vc) => sum + (vc.vms?.filter((v: any) => v.power_state === 'PoweredOff').length || 0), 0).toLocaleString()}</p>
          </div>
        </div>

        {/* 3 Drill-Down Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => setActiveModal('storage')}
            className="bg-gradient-to-br from-cyan-900 to-slate-800 rounded-lg p-6 border border-cyan-700 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20 transition-all text-left group"
          >
            <p className="text-cyan-300 font-semibold">Storage Utilization</p>
            <p className="text-slate-300 text-sm mt-2">Provisioned vs Used Storage</p>
            <p className="text-white text-xl font-bold mt-4 group-hover:translate-x-1 transition-transform">View Analysis →</p>
          </button>

          <button
            onClick={() => setActiveModal('memory')}
            className="bg-gradient-to-br from-purple-900 to-slate-800 rounded-lg p-6 border border-purple-700 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20 transition-all text-left group"
          >
            <p className="text-purple-300 font-semibold">Memory Allocation</p>
            <p className="text-slate-300 text-sm mt-2">Allocated vs Used Memory</p>
            <p className="text-white text-xl font-bold mt-4 group-hover:translate-x-1 transition-transform">View Analysis →</p>
          </button>

          <button
            onClick={() => setActiveModal('powered-off')}
            className="bg-gradient-to-br from-orange-900 to-slate-800 rounded-lg p-6 border border-orange-700 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/20 transition-all text-left group"
          >
            <p className="text-orange-300 font-semibold">Powered-Off VMs</p>
            <p className="text-slate-300 text-sm mt-2">Storage & Cleanup Opportunities</p>
            <p className="text-white text-xl font-bold mt-4 group-hover:translate-x-1 transition-transform">View Analysis →</p>
          </button>
        </div>

        {/* Note */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-slate-300 text-sm">
          <p>This is a preview of the minimal dashboard design. Click any card above to see the modal with detailed vCenter analysis.</p>
        </div>
      </div>

      {/* Storage Modal */}
      {activeModal === 'storage' && (
        <StorageModal onClose={() => setActiveModal(null)} metrics={storageMetrics} />
      )}

      {/* Memory Modal */}
      {activeModal === 'memory' && (
        <MemoryModal onClose={() => setActiveModal(null)} metrics={memoryMetrics} />
      )}

      {/* Powered-Off Modal */}
      {activeModal === 'powered-off' && (
        <PoweredOffModal onClose={() => setActiveModal(null)} metrics={poweredOffMetrics} />
      )}
    </div>
  );
}

function StorageModal({ onClose, metrics }: { onClose: () => void; metrics: Record<string, any> }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-lg shadow-lg max-w-4xl max-h-96 overflow-y-auto border border-slate-700">
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Storage Utilization Report</h2>
            <p className="text-slate-400 text-sm mt-1">Provisioned vs Used Storage Analysis for All vCenters</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {Object.entries(metrics).map(([_, data]: [string, any]) => {
            // Check if vCenter has data
            const hasData = data.provisioned > 0;
            
            if (!hasData) {
              return (
                <div key={data.vcenter} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-semibold truncate">{data.vcenter}</p>
                      <p className="text-sm mt-1 text-slate-400">No data available</p>
                    </div>
                  </div>
                </div>
              );
            }

            const utilization = (data.used / data.provisioned) * 100;
            const status = getStatusColor(utilization);
            const wasted = data.provisioned - data.used;

            return (
              <div key={data.vcenter} className={`${status.bg} rounded-lg p-4 border ${status.border}`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-white font-semibold truncate">{data.vcenter}</p>
                    <p className="text-sm mt-1 text-slate-300">{utilization.toFixed(0)}% Utilized</p>
                  </div>
                  <p className="text-slate-300 text-right">
                    <span className="font-mono">{data.used.toFixed(1)}</span>
                    <span className="text-slate-400"> / </span>
                    <span className="font-mono">{data.provisioned.toFixed(1)} TB</span>
                  </p>
                </div>

                <div className="flex gap-2 h-6 rounded overflow-hidden mb-2">
                  <div
                    className="bg-cyan-500"
                    style={{ width: `${utilization}%` }}
                    title={`Used: ${data.used.toFixed(1)} TB`}
                  ></div>
                  <div
                    className="bg-slate-600"
                    style={{ width: `${100 - utilization}%` }}
                    title={`Unused: ${wasted.toFixed(1)} TB`}
                  ></div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-slate-400">Used</p>
                    <p className="text-white font-semibold">{data.used.toFixed(1)} TB</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Provisioned</p>
                    <p className="text-white font-semibold">{data.provisioned.toFixed(1)} TB</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Unused</p>
                    <p className="text-slate-300 font-semibold">{wasted.toFixed(1)} TB</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MemoryModal({ onClose, metrics }: { onClose: () => void; metrics: Record<string, any> }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-lg shadow-lg max-w-4xl max-h-96 overflow-y-auto border border-slate-700">
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Memory Allocation Report</h2>
            <p className="text-slate-400 text-sm mt-1">Allocated vs Used Memory Analysis for All vCenters</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {Object.entries(metrics).map(([_, data]: [string, any]) => {
            // Check if vCenter has data
            const hasData = data.allocated > 0;
            
            if (!hasData) {
              return (
                <div key={data.vcenter} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-semibold truncate">{data.vcenter}</p>
                      <p className="text-sm mt-1 text-slate-400">No data available</p>
                    </div>
                  </div>
                </div>
              );
            }

            const utilization = (data.used / data.allocated) * 100;
            const status = getStatusColor(utilization);
            const unused = data.allocated - data.used;

            return (
              <div key={data.vcenter} className={`${status.bg} rounded-lg p-4 border ${status.border}`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-white font-semibold truncate">{data.vcenter}</p>
                    <p className="text-sm mt-1 text-slate-300">{utilization.toFixed(0)}% Allocated to Running VMs</p>
                  </div>
                  <p className="text-slate-300 text-right">
                    <span className="font-mono">{data.used.toFixed(0)}</span>
                    <span className="text-slate-400"> / </span>
                    <span className="font-mono">{data.allocated.toFixed(0)} GB</span>
                  </p>
                </div>

                <div className="flex gap-2 h-6 rounded overflow-hidden mb-2">
                  <div
                    className="bg-purple-500"
                    style={{ width: `${utilization}%` }}
                    title={`Used by Running VMs: ${data.used.toFixed(0)} GB`}
                  ></div>
                  <div
                    className="bg-slate-600"
                    style={{ width: `${100 - utilization}%` }}
                    title={`Unused: ${unused.toFixed(0)} GB`}
                  ></div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-slate-400">Used (Running)</p>
                    <p className="text-white font-semibold">{data.used.toFixed(0)} GB</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Allocated</p>
                    <p className="text-white font-semibold">{data.allocated.toFixed(0)} GB</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Unused</p>
                    <p className="text-slate-300 font-semibold">{unused.toFixed(0)} GB</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PoweredOffModal({ onClose, metrics }: { onClose: () => void; metrics: Record<string, any> }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-lg shadow-lg max-w-4xl max-h-96 overflow-y-auto border border-slate-700">
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Powered-Off VMs Report</h2>
            <p className="text-slate-400 text-sm mt-1">Storage & Cleanup Opportunities for All vCenters</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {Object.entries(metrics)
            .sort((a, b) => b[1].count - a[1].count)
            .map(([_, data]: [string, any]) => {
              // Check if vCenter has data
              if (!data.count) {
                return (
                  <div key={data.vcenter} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white font-semibold truncate">{data.vcenter}</p>
                        <p className="text-sm mt-1 text-slate-400">No data available</p>
                      </div>
                    </div>
                  </div>
                );
              }

              // Determine color based on storage consumption
              let bgColor = 'bg-green-900';
              if (data.storage > 100) bgColor = 'bg-red-900';
              else if (data.storage > 50) bgColor = 'bg-orange-900';

              return (
                <div key={data.vcenter} className={`${bgColor} rounded-lg p-4 border border-slate-600`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-white font-semibold truncate">{data.vcenter}</p>
                      <p className="text-sm mt-1 text-slate-300">{data.count} Powered-Off VMs</p>
                    </div>
                    <p className="text-slate-300 text-right">
                      <span className="text-2xl font-bold text-slate-100">{data.storage.toFixed(1)}</span>
                      <span className="text-slate-400 block text-sm">TB Storage</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400">Count</p>
                      <p className="text-white font-semibold text-lg">{data.count}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Storage Consumed</p>
                      <p className="text-white font-semibold text-lg">{data.storage.toFixed(1)} TB</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mt-3">These VMs are not running but consuming storage. Consider cleanup or archival.</p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
