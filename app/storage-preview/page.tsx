'use client';

import { useEffect, useState } from 'react';
import { HardDrive, AlertCircle } from 'lucide-react';

interface StorageMetric {
  vcenter: string;
  provisioned: number;
  used: number;
  utilization: number;
  wasted: number;
}

export default function StoragePreviewPage() {
  const [metrics, setMetrics] = useState<StorageMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/vm-inventory.json');
        const data = await response.json();

        // Group by vCenter and calculate storage
        const vcenterMap: Record<string, any> = {};
        
        data.forEach((vm: any) => {
          if (!vcenterMap[vm.vcenter]) {
            vcenterMap[vm.vcenter] = {
              provisioned: 0,
              used: 0,
            };
          }
          
          const provisioned = parseFloat(vm.provisioned_gb) || 0;
          const used = parseFloat(vm.used_gb) || 0;
          
          vcenterMap[vm.vcenter].provisioned += provisioned;
          vcenterMap[vm.vcenter].used += used;
        });

        // Convert to array and calculate metrics
        const metrics = Object.entries(vcenterMap)
          .map(([vcenter, storage]) => ({
            vcenter,
            provisioned: storage.provisioned,
            used: storage.used,
            utilization: (storage.used / storage.provisioned) * 100,
            wasted: storage.provisioned - storage.used,
          }))
          .sort((a, b) => b.provisioned - a.provisioned)
          .slice(0, 3);

        setMetrics(metrics);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatGB = (gb: number) => {
    if (gb > 1024) {
      return `${(gb / 1024).toFixed(2)} TB`;
    }
    return `${gb.toFixed(2)} GB`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
        <div className="text-white text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Storage Utilization Preview</h1>
          <p className="text-slate-400">Provisioned vs Actually Used Storage - Identify Underutilized Storage</p>
        </div>

        <div className="bg-gradient-to-br from-cyan-900/40 to-cyan-800/40 rounded-lg p-6 shadow-md border border-cyan-700/50">
          <div className="flex items-center gap-2 mb-6">
            <HardDrive className="w-6 h-6 text-cyan-400" />
            <h2 className="text-lg font-semibold text-cyan-200">Most Storage Used (with Utilization Ratio)</h2>
          </div>

          <div className="space-y-6">
            {metrics.map((metric, idx) => (
              <div key={idx} className="bg-slate-800/50 rounded-lg p-4 border border-cyan-700/30">
                {/* vCenter Name */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-cyan-300 font-semibold truncate flex-1" title={metric.vcenter}>
                    {metric.vcenter.substring(0, 30)}...
                  </span>
                  <span className="text-cyan-100 text-sm ml-2">#{idx + 1}</span>
                </div>

                {/* Storage Summary */}
                <div className="grid grid-cols-3 gap-4 mb-4 text-xs">
                  <div className="bg-cyan-950/50 rounded p-2">
                    <div className="text-cyan-400 font-semibold">Provisioned</div>
                    <div className="text-cyan-100 text-lg font-bold">{formatGB(metric.provisioned)}</div>
                  </div>
                  <div className="bg-green-950/50 rounded p-2">
                    <div className="text-green-400 font-semibold">Used</div>
                    <div className="text-green-100 text-lg font-bold">{formatGB(metric.used)}</div>
                  </div>
                  <div className={`rounded p-2 ${metric.utilization > 80 ? 'bg-orange-950/50' : metric.utilization > 50 ? 'bg-yellow-950/50' : 'bg-red-950/50'}`}>
                    <div className={`${metric.utilization > 80 ? 'text-orange-400' : metric.utilization > 50 ? 'text-yellow-400' : 'text-red-400'} font-semibold`}>
                      Utilization
                    </div>
                    <div className={`text-lg font-bold ${metric.utilization > 80 ? 'text-orange-100' : metric.utilization > 50 ? 'text-yellow-100' : 'text-red-100'}`}>
                      {metric.utilization.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Visual Bar - Stacked */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">Storage Allocation</span>
                    <span className="text-xs text-slate-300">Wasted: {formatGB(metric.wasted)}</span>
                  </div>
                  <div className="flex h-6 bg-slate-700 rounded-lg overflow-hidden border border-cyan-700/30">
                    {/* Used portion */}
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all"
                      style={{ width: `${metric.utilization}%` }}
                      title={`Used: ${formatGB(metric.used)}`}
                    />
                    {/* Wasted portion */}
                    <div
                      className="bg-gradient-to-r from-red-600 to-red-500 transition-all"
                      style={{ width: `${100 - metric.utilization}%` }}
                      title={`Wasted: ${formatGB(metric.wasted)}`}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-cyan-500 rounded-full" /> Used
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-600 rounded-full" /> Wasted
                    </span>
                  </div>
                </div>

                {/* Alert if underutilized */}
                {metric.utilization < 50 && (
                  <div className="bg-red-900/30 border border-red-700/50 rounded p-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span className="text-xs text-red-200">
                      Only {metric.utilization.toFixed(1)}% utilization - {formatGB(metric.wasted)} wasted storage is a candidate for cleanup or reallocation
                    </span>
                  </div>
                )}

                {metric.utilization >= 50 && metric.utilization < 80 && (
                  <div className="bg-yellow-900/30 border border-yellow-700/50 rounded p-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                    <span className="text-xs text-yellow-200">
                      Moderate utilization at {metric.utilization.toFixed(1)}% - Consider monitoring or reallocation
                    </span>
                  </div>
                )}

                {metric.utilization >= 80 && (
                  <div className="bg-green-900/30 border border-green-700/50 rounded p-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-xs text-green-200">
                      Good utilization at {metric.utilization.toFixed(1)}% - Minimal wasted storage
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
          <h3 className="text-slate-300 font-semibold mb-2">Benefits of This View:</h3>
          <ul className="text-slate-400 text-sm space-y-1">
            <li>✓ Identify vCenters with wasted storage capacity</li>
            <li>✓ Compare provisioned vs actual usage for each vCenter</li>
            <li>✓ Color-coded alerts for underutilized storage (red &lt; 50%, yellow 50-80%, green &gt; 80%)</li>
            <li>✓ Prioritize storage optimization and cleanup efforts</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
