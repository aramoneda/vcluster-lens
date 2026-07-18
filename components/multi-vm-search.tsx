'use client';

import { useState } from 'react';
import { searchMultipleVMs, VM } from '@/lib/search';
import { Search, Trash2, Download } from 'lucide-react';

export function MultiVMSearch() {
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<VM[]>([]);
  const [searched, setSearched] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'vcenter' | 'power'>('name');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const vmNames = searchText
      .split('\n')
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (vmNames.length > 0) {
      const vms = await searchMultipleVMs(vmNames);
      setResults(vms);
      setSearched(true);
    }
  };

  const handleClear = () => {
    setSearchText('');
    setResults([]);
    setSearched(false);
  };

  const handleExportCSV = () => {
    if (sortedResults.length === 0) return;

    const headers = ['VM Name', 'vCenter', 'Site', 'Power State', 'Hostname', 'Guest OS', 'IP Address', 'CPU', 'Memory (GB)', 'Provisioned Storage (GB)', 'Used Storage (GB)', 'Compatibility', 'Tools Status', 'Tools Version', 'Has Snapshot'];
    const rows = sortedResults.map((vm) => [
      vm.vm_name,
      vm.vcenter,
      vm.site,
      vm.power_state,
      vm.guest_hostname,
      vm.guest_os,
      vm.ip_address,
      vm.num_cpu,
      vm.memory_gb,
      vm.provisioned_gb.toFixed(2),
      vm.used_gb.toFixed(2),
      vm.vm_compatibility,
      vm.tools_status,
      vm.tools_version || 'N/A',
      vm.has_snapshot ? 'Yes' : 'No',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `vm-search-results-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    URL.revokeObjectURL(url);
  };

  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === 'name') return a.vm_name.localeCompare(b.vm_name);
    if (sortBy === 'vcenter') return a.vcenter.localeCompare(b.vcenter);
    if (sortBy === 'power') {
      if (a.power_state === b.power_state) return a.vm_name.localeCompare(b.vm_name);
      return a.power_state === 'PoweredOn' ? -1 : 1;
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-white">Search Multiple VMs</h2>
        <p className="text-sm text-slate-400 mb-4">Enter VM names (one per line)</p>
        <form onSubmit={handleSearch} className="space-y-4">
          <textarea
            placeholder={`cldvvssp002\nclpvvssp001\nyour-vm-name`}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full px-4 py-3 border border-slate-600 rounded-lg bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm h-32"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
            <button
              onClick={handleClear}
              className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
          </div>
        </form>
      </div>

      {searched && (
        <>
          {results.length === 0 ? (
            <div className="bg-orange-900/30 border border-orange-800 rounded-lg p-4 text-orange-200">
              No VMs found matching your search.
            </div>
          ) : (
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 shadow-lg space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-3">
                <h3 className="font-semibold text-slate-100">
                  Found {results.length} VM{results.length !== 1 ? 's' : ''}
                </h3>
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'vcenter' | 'power')}
                    className="px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white text-sm"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="vcenter">Sort by vCenter</option>
                    <option value="power">Sort by Power State</option>
                  </select>
                  <button
                    onClick={handleExportCSV}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-700 border-b border-slate-600 sticky top-0">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-white">VM Name</th>
                      <th className="text-left px-4 py-3 font-semibold text-white">vCenter</th>
                      <th className="text-left px-4 py-3 font-semibold text-white">Site</th>
                      <th className="text-left px-4 py-3 font-semibold text-white">Power State</th>
                      <th className="text-left px-4 py-3 font-semibold text-white">Hostname</th>
                      <th className="text-left px-4 py-3 font-semibold text-white">Guest OS</th>
                      <th className="text-left px-4 py-3 font-semibold text-white">IP Address</th>
                      <th className="text-left px-4 py-3 font-semibold text-white">CPU/Memory</th>
                      <th className="text-left px-4 py-3 font-semibold text-white">Storage</th>
                      <th className="text-left px-4 py-3 font-semibold text-white">Tools Status</th>
                      <th className="text-left px-4 py-3 font-semibold text-white">Tools Version</th>
                      <th className="text-left px-4 py-3 font-semibold text-white">Snapshot</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {sortedResults.map((vm) => (
                      <tr
                        key={vm.vm_name}
                        className="hover:bg-slate-700/50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-slate-100">{vm.vm_name}</td>
                        <td className="px-4 py-3 text-blue-300">{vm.vcenter}</td>
                        <td className="px-4 py-3 text-slate-300">{vm.site}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              vm.power_state === 'PoweredOn'
                                ? 'bg-emerald-900/40 text-emerald-300'
                                : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            {vm.power_state}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-300">{vm.guest_hostname}</td>
                        <td className="px-4 py-3 text-slate-300 text-xs max-w-xs truncate" title={vm.guest_os}>
                          {vm.guest_os}
                        </td>
                        <td className="px-4 py-3 text-slate-300 text-xs max-w-xs truncate font-mono" title={vm.ip_address}>
                          {vm.ip_address}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {vm.num_cpu} / {vm.memory_gb}GB
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          <div className="text-xs">
                            <p>P: {vm.provisioned_gb.toFixed(2)}GB</p>
                            <p>U: {vm.used_gb.toFixed(2)}GB</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-300">
                          {vm.tools_status}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-300">
                          {vm.tools_version || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-xs">
                          <span className={`px-2 py-1 rounded ${vm.has_snapshot ? 'bg-yellow-900/40 text-yellow-300' : 'bg-slate-700 text-slate-400'}`}>
                            {vm.has_snapshot ? 'Yes' : 'No'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
