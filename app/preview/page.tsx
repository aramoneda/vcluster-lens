'use client';

import { useState } from 'react';
import { TrendingUp, Filter, X, ChevronDown } from 'lucide-react';

export default function AnalyticsPreview() {
  const [filters, setFilters] = useState({
    powerState: [],
    guestOS: [],
    vCenter: [],
    toolsStatus: [],
    memoryMin: '',
    memoryMax: '',
    storageMin: '',
    storageMax: '',
  });

  const [expandedFilters, setExpandedFilters] = useState({
    powerState: true,
    guestOS: false,
    vCenter: false,
    toolsStatus: true,
    resources: true,
  });

  const trendingMetrics = [
    {
      title: 'vCenters with Most VMs',
      items: [
        { label: 'edpvvvcsa003.broadridge.net', value: 3247, unit: 'VMs', bgColor: 'bg-blue-900/30', textColor: 'text-blue-300' },
        { label: 'hbpvvvcsa001.broadridge.net', value: 2156, unit: 'VMs', bgColor: 'bg-blue-900/20', textColor: 'text-blue-200' },
        { label: 'rdipvcenter01.qedfs.com', value: 1845, unit: 'VMs', bgColor: 'bg-blue-900/20', textColor: 'text-blue-200' },
      ],
    },
    {
      title: 'Highest Resource Consumption',
      items: [
        { label: 'Storage Used', value: 145.2, unit: 'TB', bgColor: 'bg-purple-900/30', textColor: 'text-purple-300' },
        { label: 'Memory Allocated', value: 2456, unit: 'GB', bgColor: 'bg-purple-900/20', textColor: 'text-purple-200' },
        { label: 'CPU Cores', value: 8432, unit: 'cores', bgColor: 'bg-purple-900/20', textColor: 'text-purple-200' },
      ],
    },
    {
      title: 'Oldest VMware Tools',
      items: [
        { label: 'Version 10.0.x', value: 428, unit: 'VMs', bgColor: 'bg-red-900/30', textColor: 'text-red-300' },
        { label: 'Version 11.x.x', value: 1245, unit: 'VMs', bgColor: 'bg-orange-900/30', textColor: 'text-orange-300' },
        { label: 'Unmanaged Tools', value: 3847, unit: 'VMs', bgColor: 'bg-yellow-900/30', textColor: 'text-yellow-300' },
      ],
    },
  ];

  const filterOptions = {
    powerState: [
      { id: 'on', label: 'Powered On', count: 12835 },
      { id: 'off', label: 'Powered Off', count: 868 },
    ],
    guestOS: [
      { id: 'linux', label: 'Linux', count: 8432 },
      { id: 'windows', label: 'Windows Server', count: 5203 },
      { id: 'ubuntu', label: 'Ubuntu', count: 1456 },
      { id: 'centos', label: 'CentOS', count: 1203 },
    ],
    vCenter: [
      { id: 'edp', label: 'edpvvvcsa003.broadridge.net', count: 3247 },
      { id: 'hbp', label: 'hbpvvvcsa001.broadridge.net', count: 2156 },
      { id: 'rdip', label: 'rdipvcenter01.qedfs.com', count: 1845 },
    ],
    toolsStatus: [
      { id: 'running', label: 'Running (Current)', count: 9238 },
      { id: 'outdated', label: 'Outdated', count: 1245 },
      { id: 'not-installed', label: 'Not Installed', count: 428 },
      { id: 'unmanaged', label: 'Unmanaged', count: 3847 },
    ],
  };

  const toggleFilter = (category: string, id: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category as keyof typeof filters].includes(id)
        ? (prev[category as keyof typeof filters] as string[]).filter(f => f !== id)
        : [...(prev[category as keyof typeof filters] as string[]), id],
    }));
  };

  const toggleFilterSection = (section: string) => {
    setExpandedFilters(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof expandedFilters],
    }));
  };

  return (
    <main className="min-h-screen bg-slate-950">
      <header className="bg-gradient-to-r from-slate-900 to-blue-900 border-b border-blue-800 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>
            <h1 className="text-4xl font-bold text-white">Analytics Preview</h1>
            <p className="text-blue-200 mt-2">Trending Metrics & Advanced Filtering</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trending Metrics Section */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Trending Metrics</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingMetrics.map((metric, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">{metric.title}</h3>
                <div className="space-y-3">
                  {metric.items.map((item, itemIdx) => (
                    <div key={itemIdx} className={`${item.bgColor} rounded-lg p-3 border border-slate-700`}>
                      <div className="flex justify-between items-start">
                        <p className="text-sm text-slate-300">{item.label}</p>
                        <span className={`${item.textColor} font-bold text-lg`}>{item.value}</span>
                      </div>
                      <p className={`${item.textColor} text-xs mt-1`}>{item.unit}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Advanced Filtering Section */}
        <section className="border-t border-slate-700 pt-12">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Advanced Filtering</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filter Panel */}
            <div className="lg:col-span-1 bg-slate-900 border border-slate-700 rounded-lg p-6 h-fit">
              <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
              <div className="space-y-4">
                
                {/* Power State Filter */}
                <div>
                  <button
                    onClick={() => toggleFilterSection('powerState')}
                    className="flex items-center justify-between w-full p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <span className="font-medium text-white">Power State</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedFilters.powerState ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedFilters.powerState && (
                    <div className="mt-2 space-y-2">
                      {filterOptions.powerState.map(option => (
                        <label key={option.id} className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.powerState.includes(option.id)}
                            onChange={() => toggleFilter('powerState', option.id)}
                            className="w-4 h-4 rounded"
                          />
                          <span className="text-sm text-slate-300">{option.label}</span>
                          <span className="text-xs text-slate-500 ml-auto">({option.count})</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Guest OS Filter */}
                <div>
                  <button
                    onClick={() => toggleFilterSection('guestOS')}
                    className="flex items-center justify-between w-full p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <span className="font-medium text-white">Guest OS</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedFilters.guestOS ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedFilters.guestOS && (
                    <div className="mt-2 space-y-2">
                      {filterOptions.guestOS.map(option => (
                        <label key={option.id} className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.guestOS.includes(option.id)}
                            onChange={() => toggleFilter('guestOS', option.id)}
                            className="w-4 h-4 rounded"
                          />
                          <span className="text-sm text-slate-300">{option.label}</span>
                          <span className="text-xs text-slate-500 ml-auto">({option.count})</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* vCenter Filter */}
                <div>
                  <button
                    onClick={() => toggleFilterSection('vCenter')}
                    className="flex items-center justify-between w-full p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <span className="font-medium text-white">vCenter</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedFilters.vCenter ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedFilters.vCenter && (
                    <div className="mt-2 space-y-2">
                      {filterOptions.vCenter.map(option => (
                        <label key={option.id} className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.vCenter.includes(option.id)}
                            onChange={() => toggleFilter('vCenter', option.id)}
                            className="w-4 h-4 rounded"
                          />
                          <span className="text-sm text-slate-300">{option.label}</span>
                          <span className="text-xs text-slate-500 ml-auto">({option.count})</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tools Status Filter */}
                <div>
                  <button
                    onClick={() => toggleFilterSection('toolsStatus')}
                    className="flex items-center justify-between w-full p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <span className="font-medium text-white">Tools Status</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedFilters.toolsStatus ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedFilters.toolsStatus && (
                    <div className="mt-2 space-y-2">
                      {filterOptions.toolsStatus.map(option => (
                        <label key={option.id} className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.toolsStatus.includes(option.id)}
                            onChange={() => toggleFilter('toolsStatus', option.id)}
                            className="w-4 h-4 rounded"
                          />
                          <span className="text-sm text-slate-300">{option.label}</span>
                          <span className="text-xs text-slate-500 ml-auto">({option.count})</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Resource Range Filters */}
                <div>
                  <button
                    onClick={() => toggleFilterSection('resources')}
                    className="flex items-center justify-between w-full p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <span className="font-medium text-white">Resources</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedFilters.resources ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedFilters.resources && (
                    <div className="mt-2 space-y-3">
                      <div>
                        <label className="text-xs text-slate-400">Memory (GB)</label>
                        <div className="flex gap-2 mt-1">
                          <input
                            type="number"
                            placeholder="Min"
                            value={filters.memoryMin}
                            onChange={(e) => setFilters({ ...filters, memoryMin: e.target.value })}
                            className="flex-1 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-sm text-white placeholder-slate-500"
                          />
                          <input
                            type="number"
                            placeholder="Max"
                            value={filters.memoryMax}
                            onChange={(e) => setFilters({ ...filters, memoryMax: e.target.value })}
                            className="flex-1 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-sm text-white placeholder-slate-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-slate-400">Storage (GB)</label>
                        <div className="flex gap-2 mt-1">
                          <input
                            type="number"
                            placeholder="Min"
                            value={filters.storageMin}
                            onChange={(e) => setFilters({ ...filters, storageMin: e.target.value })}
                            className="flex-1 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-sm text-white placeholder-slate-500"
                          />
                          <input
                            type="number"
                            placeholder="Max"
                            value={filters.storageMax}
                            onChange={(e) => setFilters({ ...filters, storageMax: e.target.value })}
                            className="flex-1 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-sm text-white placeholder-slate-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t border-slate-700">
                  <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
                    Apply
                  </button>
                  <button className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium">
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Results Preview */}
            <div className="lg:col-span-3">
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-white">Results</h4>
                  <span className="text-sm text-slate-400">Found 8,752 VMs</span>
                </div>

                {/* Active Filters Display */}
                {(filters.powerState.length > 0 || filters.guestOS.length > 0 || filters.vCenter.length > 0 || filters.toolsStatus.length > 0) && (
                  <div className="mb-4 pb-4 border-b border-slate-700">
                    <div className="flex flex-wrap gap-2">
                      {filters.powerState.map(f => (
                        <div key={f} className="inline-flex items-center gap-1 bg-blue-900/30 text-blue-200 px-3 py-1 rounded-full text-sm">
                          Power: {f}
                          <button onClick={() => toggleFilter('powerState', f)} className="ml-1 hover:text-blue-100">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {filters.guestOS.map(f => (
                        <div key={f} className="inline-flex items-center gap-1 bg-purple-900/30 text-purple-200 px-3 py-1 rounded-full text-sm">
                          OS: {f}
                          <button onClick={() => toggleFilter('guestOS', f)} className="ml-1 hover:text-purple-100">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {filters.vCenter.map(f => (
                        <div key={f} className="inline-flex items-center gap-1 bg-green-900/30 text-green-200 px-3 py-1 rounded-full text-sm">
                          vCenter: {f}
                          <button onClick={() => toggleFilter('vCenter', f)} className="ml-1 hover:text-green-100">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {filters.toolsStatus.map(f => (
                        <div key={f} className="inline-flex items-center gap-1 bg-orange-900/30 text-orange-200 px-3 py-1 rounded-full text-sm">
                          Tools: {f}
                          <button onClick={() => toggleFilter('toolsStatus', f)} className="ml-1 hover:text-orange-100">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sample Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">VM Name</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Power State</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Guest OS</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Memory (GB)</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Storage (GB)</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Tools Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'prod-app-01', power: 'On', os: 'Ubuntu 20.04', mem: '16', storage: '256', tools: 'Running' },
                        { name: 'prod-app-02', power: 'On', os: 'Ubuntu 20.04', mem: '16', storage: '256', tools: 'Running' },
                        { name: 'dev-app-01', power: 'Off', os: 'CentOS 7', mem: '8', storage: '128', tools: 'Outdated' },
                        { name: 'test-db-01', power: 'On', os: 'Windows Server 2019', mem: '32', storage: '512', tools: 'Running' },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b border-slate-800 hover:bg-slate-800 transition-colors">
                          <td className="py-3 px-4 text-white">{row.name}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${row.power === 'On' ? 'bg-green-900/40 text-green-200' : 'bg-slate-700 text-slate-300'}`}>
                              {row.power}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-300">{row.os}</td>
                          <td className="py-3 px-4 text-slate-300">{row.mem}</td>
                          <td className="py-3 px-4 text-slate-300">{row.storage}</td>
                          <td className="py-3 px-4 text-slate-300">{row.tools}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-12 bg-blue-900/10 border border-blue-800 rounded-lg p-6 text-center">
          <p className="text-slate-300">This is a preview of proposed features. Click the filters to see how active selections would appear.</p>
        </div>
      </div>
    </main>
  );
}
