'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

interface VM {
  vm_name: string;
  vcenter: string;
  power_state: string;
  guest_os: string;
  memory_gb: number;
  used_gb: number;
  vmtools?: string;
  tools_status?: string;
}

interface FilteredResult {
  vms: VM[];
  count: number;
}

export default function AnalyticsPreview() {
  const [data, setData] = useState<VM[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    powerState: [] as string[],
    guestOS: [] as string[],
    vCenter: [] as string[],
    toolsStatus: [] as string[],
    memoryMin: '',
    memoryMax: '',
  });

  const [expandedFilters, setExpandedFilters] = useState({
    powerState: true,
    guestOS: false,
    vCenter: false,
    toolsStatus: false,
    resources: false,
  });

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/vm-inventory.json');
        const jsonData = await response.json();
        // Filter out invalid records
        const validVMs = jsonData.filter((vm: any) => vm.vm_name && vm.vm_name.trim() !== '');
        setData(validVMs);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Calculate trending metrics from real data
  const calculateMetrics = () => {
    const vCenterCounts: Record<string, number> = {};
    let totalStorage = 0;
    let totalMemory = 0;
    let totalCPU = 0;
    const toolsVersions: Record<string, number> = {};

    data.forEach((vm: VM) => {
      vCenterCounts[vm.vcenter] = (vCenterCounts[vm.vcenter] || 0) + 1;
      totalStorage += vm.used_gb || 0;
      totalMemory += vm.memory_gb || 0;
      
      // Parse tools version
      const tools = vm.vmtools || vm.tools_status || '';
      if (tools.includes('10.0')) {
        toolsVersions['10.0.x'] = (toolsVersions['10.0.x'] || 0) + 1;
      } else if (tools.includes('11.') || tools.includes('version:11')) {
        toolsVersions['11.x.x'] = (toolsVersions['11.x.x'] || 0) + 1;
      } else if (tools.includes('12') || tools.includes('version:12')) {
        toolsVersions['12.x.x'] = (toolsVersions['12.x.x'] || 0) + 1;
      } else if (tools.includes('Unmanaged') || tools.includes('unmanaged')) {
        toolsVersions['Unmanaged'] = (toolsVersions['Unmanaged'] || 0) + 1;
      }
    });

    const topVCenters = Object.entries(vCenterCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([label, value]) => ({
        label,
        value,
        unit: 'VMs',
        bgColor: 'bg-blue-900/30',
        textColor: 'text-blue-300',
      }));

    const resources = [
      { label: 'Storage Used', value: (totalStorage / 1024).toFixed(1), unit: 'TB', bgColor: 'bg-purple-900/30', textColor: 'text-purple-300' },
      { label: 'Memory Allocated', value: (totalMemory).toFixed(0), unit: 'GB', bgColor: 'bg-purple-900/20', textColor: 'text-purple-200' },
      { label: 'Total VMs', value: data.length, unit: 'VMs', bgColor: 'bg-purple-900/20', textColor: 'text-purple-200' },
    ];

    const toolsItems = Object.entries(toolsVersions)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([label, value], idx) => {
        const colors = ['bg-red-900/30 text-red-300', 'bg-orange-900/30 text-orange-300', 'bg-yellow-900/30 text-yellow-300'];
        const [bgColor, textColor] = colors[idx].split(' ');
        return { label, value, unit: 'VMs', bgColor, textColor };
      });

    return [
      { title: 'vCenters with Most VMs', items: topVCenters },
      { title: 'Resource Consumption', items: resources },
      { title: 'VMware Tools Versions', items: toolsItems },
    ];
  };

  // Calculate filter options from real data
  const calculateFilterOptions = () => {
    const powerStateCounts: Record<string, number> = {};
    const osCount: Record<string, number> = {};
    const vCenterCounts: Record<string, number> = {};
    const toolsCounts: Record<string, number> = {};

    data.forEach((vm: VM) => {
      powerStateCounts[vm.power_state] = (powerStateCounts[vm.power_state] || 0) + 1;
      osCount[vm.guest_os] = (osCount[vm.guest_os] || 0) + 1;
      vCenterCounts[vm.vcenter] = (vCenterCounts[vm.vcenter] || 0) + 1;

      const tools = vm.vmtools || vm.tools_status || '';
      if (tools.includes('Running') && !tools.includes('Unmanaged')) {
        toolsCounts['running'] = (toolsCounts['running'] || 0) + 1;
      } else if (tools.includes('Outdated')) {
        toolsCounts['outdated'] = (toolsCounts['outdated'] || 0) + 1;
      } else if (tools.includes('Unmanaged')) {
        toolsCounts['unmanaged'] = (toolsCounts['unmanaged'] || 0) + 1;
      } else if (tools.includes('Not') || !tools) {
        toolsCounts['not-installed'] = (toolsCounts['not-installed'] || 0) + 1;
      }
    });

    return {
      powerState: Object.entries(powerStateCounts).map(([state, count]) => ({
        id: state.toLowerCase().replace(/\s+/g, '-'),
        label: state,
        count,
      })),
      guestOS: Object.entries(osCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([os, count]) => ({
          id: os.toLowerCase().replace(/\s+/g, '-'),
          label: os,
          count,
        })),
      vCenter: Object.entries(vCenterCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([vc, count]) => ({
          id: vc.toLowerCase().replace(/\./g, '-'),
          label: vc,
          count,
        })),
      toolsStatus: Object.entries(toolsCounts).map(([status, count]) => {
        const labels: Record<string, string> = {
          'running': 'Running (Current)',
          'outdated': 'Outdated',
          'not-installed': 'Not Installed',
          'unmanaged': 'Unmanaged',
        };
        return {
          id: status,
          label: labels[status] || status,
          count,
        };
      }),
    };
  };

  // Apply filters to data
  const getFilteredResults = (): FilteredResult => {
    let filtered = data;

    if (filters.powerState.length > 0) {
      filtered = filtered.filter(vm =>
        filters.powerState.some(ps =>
          vm.power_state.toLowerCase().includes(ps.toLowerCase())
        )
      );
    }

    if (filters.guestOS.length > 0) {
      filtered = filtered.filter(vm =>
        filters.guestOS.some(os => vm.guest_os.toLowerCase().includes(os.toLowerCase()))
      );
    }

    if (filters.vCenter.length > 0) {
      filtered = filtered.filter(vm =>
        filters.vCenter.some(vc => vm.vcenter.toLowerCase().includes(vc.toLowerCase()))
      );
    }

    if (filters.toolsStatus.length > 0) {
      filtered = filtered.filter(vm => {
        const tools = (vm.vmtools || vm.tools_status || '').toLowerCase();
        return filters.toolsStatus.some(status => {
          if (status === 'running') return tools.includes('running') && !tools.includes('unmanaged');
          if (status === 'unmanaged') return tools.includes('unmanaged');
          if (status === 'outdated') return tools.includes('outdated');
          return false;
        });
      });
    }

    if (filters.memoryMin) {
      filtered = filtered.filter(vm => vm.memory_gb >= parseFloat(filters.memoryMin));
    }

    if (filters.memoryMax) {
      filtered = filtered.filter(vm => vm.memory_gb <= parseFloat(filters.memoryMax));
    }

    return { vms: filtered, count: filtered.length };
  };

  const toggleFilter = (category: string, id: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: (prev[category as keyof typeof filters] as string[]).includes(id)
        ? ((prev[category as keyof typeof filters] as string[]).filter(f => f !== id))
        : [...(prev[category as keyof typeof filters] as string[]), id],
    }));
  };

  const toggleFilterSection = (section: string) => {
    setExpandedFilters(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof expandedFilters],
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      powerState: [],
      guestOS: [],
      vCenter: [],
      toolsStatus: [],
      memoryMin: '',
      memoryMax: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some(f => (Array.isArray(f) ? f.length > 0 : f !== ''));
  const filteredResults = getFilteredResults();
  const metrics = calculateMetrics();
  const filterOptions = calculateFilterOptions();

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-lg">Loading data...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 to-blue-900 border-b border-blue-800 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>
            <h1 className="text-4xl font-bold text-white">Analytics Preview</h1>
            <p className="text-blue-200 mt-2">Trending Metrics & Advanced Filtering - Testing with Real Data</p>
          </div>
        </div>
      </header>

      {/* Trending Metrics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-2 mb-8">
          <TrendingUp className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">Trending Metrics</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {metrics.map((metric, idx) => (
            <div key={idx} className="bg-slate-900 rounded-lg border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">{metric.title}</h3>
              <div className="space-y-3">
                {metric.items.map((item, itemIdx) => (
                  <div key={itemIdx} className={`${item.bgColor} rounded p-3`}>
                    <p className="text-sm text-slate-300">{item.label}</p>
                    <p className={`text-2xl font-bold ${item.textColor}`}>
                      {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                      <span className="text-sm ml-2">{item.unit}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Advanced Filtering */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-2 mb-8">
          <Filter className="w-6 h-6 text-green-400" />
          <h2 className="text-2xl font-bold text-white">Advanced Filtering</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 rounded-lg border border-slate-700 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Filters</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-blue-400 hover:text-blue-300 px-2 py-1 hover:bg-blue-900/20 rounded"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Power State */}
              <div className="mb-4 border-b border-slate-700 pb-4">
                <button
                  onClick={() => toggleFilterSection('powerState')}
                  className="flex items-center justify-between w-full text-white hover:text-blue-400 transition-colors"
                >
                  <span className="font-medium">Power State</span>
                  {expandedFilters.powerState ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedFilters.powerState && (
                  <div className="mt-3 space-y-2">
                    {filterOptions.powerState.map(option => (
                      <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.powerState.includes(option.id)}
                          onChange={() => toggleFilter('powerState', option.id)}
                          className="rounded"
                        />
                        <span className="text-sm text-slate-300">{option.label}</span>
                        <span className="text-xs text-slate-500 ml-auto">({option.count})</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Guest OS */}
              <div className="mb-4 border-b border-slate-700 pb-4">
                <button
                  onClick={() => toggleFilterSection('guestOS')}
                  className="flex items-center justify-between w-full text-white hover:text-blue-400 transition-colors"
                >
                  <span className="font-medium">Guest OS</span>
                  {expandedFilters.guestOS ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedFilters.guestOS && (
                  <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                    {filterOptions.guestOS.map(option => (
                      <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.guestOS.includes(option.id)}
                          onChange={() => toggleFilter('guestOS', option.id)}
                          className="rounded"
                        />
                        <span className="text-sm text-slate-300 truncate">{option.label}</span>
                        <span className="text-xs text-slate-500 ml-auto">({option.count})</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* vCenter */}
              <div className="mb-4 border-b border-slate-700 pb-4">
                <button
                  onClick={() => toggleFilterSection('vCenter')}
                  className="flex items-center justify-between w-full text-white hover:text-blue-400 transition-colors"
                >
                  <span className="font-medium">vCenter</span>
                  {expandedFilters.vCenter ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedFilters.vCenter && (
                  <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                    {filterOptions.vCenter.map(option => (
                      <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.vCenter.includes(option.id)}
                          onChange={() => toggleFilter('vCenter', option.id)}
                          className="rounded"
                        />
                        <span className="text-sm text-slate-300 truncate">{option.label}</span>
                        <span className="text-xs text-slate-500 ml-auto">({option.count})</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Tools Status */}
              <div className="mb-4 border-b border-slate-700 pb-4">
                <button
                  onClick={() => toggleFilterSection('toolsStatus')}
                  className="flex items-center justify-between w-full text-white hover:text-blue-400 transition-colors"
                >
                  <span className="font-medium">Tools Status</span>
                  {expandedFilters.toolsStatus ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedFilters.toolsStatus && (
                  <div className="mt-3 space-y-2">
                    {filterOptions.toolsStatus.map(option => (
                      <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.toolsStatus.includes(option.id)}
                          onChange={() => toggleFilter('toolsStatus', option.id)}
                          className="rounded"
                        />
                        <span className="text-sm text-slate-300">{option.label}</span>
                        <span className="text-xs text-slate-500 ml-auto">({option.count})</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Resources */}
              <div className="mb-4">
                <button
                  onClick={() => toggleFilterSection('resources')}
                  className="flex items-center justify-between w-full text-white hover:text-blue-400 transition-colors"
                >
                  <span className="font-medium">Memory (GB)</span>
                  {expandedFilters.resources ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedFilters.resources && (
                  <div className="mt-3 space-y-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.memoryMin}
                      onChange={(e) => setFilters(prev => ({ ...prev, memoryMin: e.target.value }))}
                      className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-sm text-white placeholder-slate-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.memoryMax}
                      onChange={(e) => setFilters(prev => ({ ...prev, memoryMax: e.target.value }))}
                      className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-sm text-white placeholder-slate-500"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="bg-slate-900 rounded-lg border border-slate-700 p-6">
              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="mb-4 pb-4 border-b border-slate-700">
                  <p className="text-sm text-slate-400 mb-2">Active Filters:</p>
                  <div className="flex flex-wrap gap-2">
                    {filters.powerState.map(f => (
                      <span key={f} className="bg-blue-900/40 text-blue-300 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {f}
                        <button onClick={() => toggleFilter('powerState', f)} className="hover:text-blue-200">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {filters.guestOS.map(f => (
                      <span key={f} className="bg-green-900/40 text-green-300 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {f}
                        <button onClick={() => toggleFilter('guestOS', f)} className="hover:text-green-200">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {filters.vCenter.map(f => (
                      <span key={f} className="bg-purple-900/40 text-purple-300 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {f}
                        <button onClick={() => toggleFilter('vCenter', f)} className="hover:text-purple-200">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {filters.toolsStatus.map(f => (
                      <span key={f} className="bg-orange-900/40 text-orange-300 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {f}
                        <button onClick={() => toggleFilter('toolsStatus', f)} className="hover:text-orange-200">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Results Summary */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Found <span className="text-blue-400">{filteredResults.count.toLocaleString()}</span> VMs
                </h3>
                <p className="text-sm text-slate-400">
                  {hasActiveFilters
                    ? `Results filtered from ${data.length.toLocaleString()} total VMs`
                    : `Showing all ${data.length.toLocaleString()} VMs in inventory`}
                </p>
              </div>

              {/* Results Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-600 bg-slate-800/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-slate-300 font-semibold">VM Name</th>
                      <th className="px-4 py-3 text-left text-slate-300 font-semibold">vCenter</th>
                      <th className="px-4 py-3 text-left text-slate-300 font-semibold">Power State</th>
                      <th className="px-4 py-3 text-left text-slate-300 font-semibold">Guest OS</th>
                      <th className="px-4 py-3 text-left text-slate-300 font-semibold">Memory (GB)</th>
                      <th className="px-4 py-3 text-left text-slate-300 font-semibold">Storage (GB)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {filteredResults.vms.slice(0, 20).map((vm, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-3 text-slate-300">{vm.vm_name}</td>
                        <td className="px-4 py-3 text-slate-400 text-xs">{vm.vcenter}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            vm.power_state === 'PoweredOn'
                              ? 'bg-green-900/40 text-green-300'
                              : 'bg-slate-700 text-slate-300'
                          }`}>
                            {vm.power_state}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs">{vm.guest_os}</td>
                        <td className="px-4 py-3 text-slate-300">{vm.memory_gb}</td>
                        <td className="px-4 py-3 text-slate-300">{vm.used_gb?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredResults.count > 20 && (
                <p className="mt-4 text-sm text-slate-400">
                  Showing first 20 results of {filteredResults.count.toLocaleString()} total
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-slate-500 text-sm">
            This is a preview. Test the filters and metrics before integration into main dashboard.
          </p>
        </div>
      </footer>
    </main>
  );
}
