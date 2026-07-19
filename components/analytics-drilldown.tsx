'use client';

import { useEffect, useState } from 'react';
import { getVCenters, VCenterStats } from '@/lib/search';
import { X } from 'lucide-react';

const getStatusColor = (utilization: number) => {
  if (utilization >= 80) return { bg: 'bg-green-900', border: 'border-green-700' };
  if (utilization >= 50) return { bg: 'bg-orange-900', border: 'border-orange-700' };
  return { bg: 'bg-red-900', border: 'border-red-700' };
};

export function AnalyticsDrilldown() {
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

  const calculateStorageMetrics = () => {
    const metrics: Record<string, any> = {};
    vcenters.forEach((vc) => {
      const used = vc.vms?.reduce((sum, vm: any) => sum + (vm.used_gb || 0), 0) || 0;
      const provisioned = vc.vms?.reduce((sum, vm: any) => sum + (vm.provisioned_gb || 0), 0) || 0;
      metrics[vc.vcenter] = { vcenter: vc.vcenter, used, provisioned };
    });
    return metrics;
  };

  const calculateMemoryMetrics = () => {
    const metrics: Record<string, any> = {};
    vcenters.forEach((vc) => {
      const allVms = vc.vms || [];
      const poweredOnVms = allVms.filter((vm: any) => vm.power_state === 'PoweredOn');
      const used = poweredOnVms.reduce((sum, vm: any) => sum + (vm.memory_gb || 0), 0);
      const allocated = allVms.reduce((sum, vm: any) => sum + (vm.memory_gb || 0), 0);
      metrics[vc.vcenter] = { vcenter: vc.vcenter, used, allocated };
    });
    return metrics;
  };

  const calculatePoweredOffMetrics = () => {
    const metrics: Record<string, any> = {};
    vcenters.forEach((vc) => {
      const poweredOffVms = vc.vms?.filter((vm: any) => vm.power_state === 'PoweredOff') || [];
      const storage = poweredOffVms.reduce((sum, vm: any) => sum + (vm.used_gb || 0), 0);
      const memory = poweredOffVms.reduce((sum, vm: any) => sum + (vm.memory_gb || 0), 0);
      metrics[vc.vcenter] = { vcenter: vc.vcenter, count: poweredOffVms.length, storage, memory };
    });
    return metrics;
  };

  const storageMetrics = calculateStorageMetrics();
  const memoryMetrics = calculateMemoryMetrics();
  const poweredOffMetrics = calculatePoweredOffMetrics();

  const exportModalToHTML = (type: string, metrics: Record<string, any>) => {
    let html = '';
    let title = '';
    let subtitle = '';

    if (type === 'storage') {
      title = 'Storage Utilization Report';
      subtitle = 'Provisioned vs Used Storage Analysis for All vCenters';
      html = `
        <h2>${title}</h2>
        <p>${subtitle}</p>
        <table border="1" cellpadding="10">
          <tr><th>vCenter</th><th>Utilization %</th><th>Provisioned (TB)</th><th>Used (TB)</th><th>Unused (TB)</th></tr>
          ${Object.entries(metrics).map(([_, data]: [string, any]) => {
            if (data.provisioned === 0) return '';
            const util = ((data.used / data.provisioned) * 100).toFixed(0);
            const wasted = (data.provisioned - data.used).toFixed(1);
            return `<tr><td>${data.vcenter}</td><td>${util}%</td><td>${data.provisioned.toFixed(1)}</td><td>${data.used.toFixed(1)}</td><td>${wasted}</td></tr>`;
          }).join('')}
        </table>
      `;
    } else if (type === 'memory') {
      title = 'Memory Allocation Report';
      subtitle = 'Allocated vs Used Memory Analysis for All vCenters';
      html = `
        <h2>${title}</h2>
        <p>${subtitle}</p>
        <table border="1" cellpadding="10">
          <tr><th>vCenter</th><th>Utilization %</th><th>Allocated (GB)</th><th>Used (GB)</th><th>Unused (GB)</th></tr>
          ${Object.entries(metrics).map(([_, data]: [string, any]) => {
            if (data.allocated === 0) return '';
            const util = ((data.used / data.allocated) * 100).toFixed(0);
            const unused = (data.allocated - data.used).toFixed(0);
            return `<tr><td>${data.vcenter}</td><td>${util}%</td><td>${data.allocated.toFixed(0)}</td><td>${data.used.toFixed(0)}</td><td>${unused}</td></tr>`;
          }).join('')}
        </table>
      `;
    } else if (type === 'powered-off') {
      title = 'Powered-Off VMs Report';
      subtitle = 'Storage & Cleanup Opportunities for All vCenters';
      html = `
        <h2>${title}</h2>
        <p>${subtitle}</p>
        <table border="1" cellpadding="10">
          <tr><th>vCenter</th><th>Powered-Off Count</th><th>Storage Consumed (TB)</th><th>Memory Allocated (GB)</th></tr>
          ${Object.entries(metrics).sort((a, b) => b[1].count - a[1].count).map(([_, data]: [string, any]) => {
            if (!data.count) return '';
            return `<tr><td>${data.vcenter}</td><td>${data.count}</td><td>${data.storage.toFixed(1)}</td><td>${data.memory.toFixed(0)}</td></tr>`;
          }).join('')}
        </table>
      `;
    }

    const fullHTML = `<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h2 { color: #333; }
    p { color: #666; margin-bottom: 20px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
    th { background-color: #f2f2f2; }
  </style>
</head>
<body>
  ${html}
  <p style="margin-top: 30px; font-size: 12px; color: #999;">Generated on ${new Date().toLocaleString()}</p>
</body>
</html>`;

    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${type}-report-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* 3 Interactive Drill-Down Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Storage Utilization Card */}
        <button
          onClick={() => setActiveModal('storage')}
          className="bg-gradient-to-br from-cyan-900 to-cyan-800 rounded-lg p-6 border border-cyan-700 hover:border-cyan-600 cursor-pointer transition-all hover:shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-semibold text-lg">Storage Utilization</h3>
            <div className="text-cyan-400 text-2xl">📊</div>
          </div>
          <p className="text-cyan-200 text-sm">View all vCenters provisioned vs used storage</p>
          <p className="text-cyan-100 text-xs mt-3">Click to drill down</p>
        </button>

        {/* Memory Allocation Card */}
        <button
          onClick={() => setActiveModal('memory')}
          className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-6 border border-purple-700 hover:border-purple-600 cursor-pointer transition-all hover:shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-semibold text-lg">Memory Allocation</h3>
            <div className="text-purple-400 text-2xl">💾</div>
          </div>
          <p className="text-purple-200 text-sm">View all vCenters allocated vs used memory</p>
          <p className="text-purple-100 text-xs mt-3">Click to drill down</p>
        </button>

        {/* Powered-Off VMs Card */}
        <button
          onClick={() => setActiveModal('powered-off')}
          className="bg-gradient-to-br from-orange-900 to-orange-800 rounded-lg p-6 border border-orange-700 hover:border-orange-600 cursor-pointer transition-all hover:shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-semibold text-lg">Powered-Off VMs</h3>
            <div className="text-orange-400 text-2xl">🔴</div>
          </div>
          <p className="text-orange-200 text-sm">View cleanup opportunities across vCenters</p>
          <p className="text-orange-100 text-xs mt-3">Click to drill down</p>
        </button>
      </div>

      {/* Storage Modal */}
      {activeModal === 'storage' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <div>
                <h2 className="text-white text-xl font-bold">Storage Utilization Report</h2>
                <p className="text-slate-400 text-sm mt-1">Provisioned vs Used Storage Analysis for All vCenters</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => exportModalToHTML('storage', storageMetrics)}
                  className="px-3 py-1 text-sm bg-blue-700 hover:bg-blue-600 text-white rounded transition-colors"
                >
                  Export
                </button>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1 p-6 space-y-4">
              {Object.entries(storageMetrics).map(([_, data]: [string, any]) => {
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
                </div>
                <p className="text-white font-mono text-right text-lg mb-3">
                  <span>{data.provisioned.toFixed(1)}</span>
                  <span className="text-slate-400"> / </span>
                  <span>{data.used.toFixed(1)} TB</span>
                </p>

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
                        <p className="text-slate-400">Provisioned</p>
                        <p className="text-white font-semibold">{data.provisioned.toFixed(1)} TB</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Used</p>
                        <p className="text-white font-semibold">{data.used.toFixed(1)} TB</p>
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
      )}

      {/* Memory Modal */}
      {activeModal === 'memory' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <div>
                <h2 className="text-white text-xl font-bold">Memory Allocation Report</h2>
                <p className="text-slate-400 text-sm mt-1">Allocated vs Used Memory Analysis for All vCenters</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => exportModalToHTML('memory', memoryMetrics)}
                  className="px-3 py-1 text-sm bg-blue-700 hover:bg-blue-600 text-white rounded transition-colors"
                >
                  Export
                </button>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1 p-6 space-y-4">
              {Object.entries(memoryMetrics).map(([_, data]: [string, any]) => {
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
                        <p className="text-slate-400">Allocated</p>
                        <p className="text-white font-semibold">{data.allocated.toFixed(0)} GB</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Used (Running)</p>
                        <p className="text-white font-semibold">{data.used.toFixed(0)} GB</p>
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
      )}

      {/* Powered-Off VMs Modal */}
      {activeModal === 'powered-off' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <div>
                <h2 className="text-white text-xl font-bold">Powered-Off VMs Report</h2>
                <p className="text-slate-400 text-sm mt-1">Storage & Cleanup Opportunities for All vCenters</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => exportModalToHTML('powered-off', poweredOffMetrics)}
                  className="px-3 py-1 text-sm bg-blue-700 hover:bg-blue-600 text-white rounded transition-colors"
                >
                  Export
                </button>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1 p-6 space-y-4">
              {Object.entries(poweredOffMetrics)
                .sort((a, b) => b[1].count - a[1].count)
                .map(([_, data]: [string, any]) => {
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

                  let bgColor = 'bg-green-900';
                  if (data.count > 100) bgColor = 'bg-red-900';
                  else if (data.count >= 70 && data.count <= 99) bgColor = 'bg-orange-900';
                  else if (data.count >= 50 && data.count <= 69) bgColor = 'bg-yellow-900';

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

                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-slate-400">Count</p>
                          <p className="text-white font-semibold text-lg">{data.count}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Storage</p>
                          <p className="text-white font-semibold text-lg">{data.storage.toFixed(1)} TB</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Memory</p>
                          <p className="text-white font-semibold text-lg">{data.memory.toFixed(0)} GB</p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 mt-3">These VMs are not running but consuming storage and memory. Consider cleanup or archival.</p>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
