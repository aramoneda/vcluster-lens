'use client';

import { useState, useEffect } from 'react';
import { searchByVCenter, getVCenters, VCenterStats } from '@/lib/search';
import { ChevronDown, ChevronUp, Download } from 'lucide-react';

export function VCenterSearch() {
  const [vcenters, setVcenters] = useState<string[]>([]);
  const [selectedVCenter, setSelectedVCenter] = useState('');
  const [result, setResult] = useState<VCenterStats | null>(null);
  const [searched, setSearched] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [expandedVMs, setExpandedVMs] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVCenters = async () => {
      const vcList = await getVCenters();
      setVcenters(vcList.map((vc) => vc.vcenter));
      setLoading(false);
    };
    loadVCenters();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVCenter) return;
    
    setSearched(true);
    const vcenter = await searchByVCenter(selectedVCenter);
    if (vcenter) {
      setResult(vcenter);
      setNotFound(false);
    } else {
      setResult(null);
      setNotFound(true);
    }
  };

  const handleExportCSV = () => {
    if (!result) return;

    const headers = ['VM Name', 'Hostname', 'Guest OS', 'IP Address', 'Power State', 'CPU', 'Memory (GB)', 'Compatibility'];
    const rows = result.vms.map((vm) => [
      vm.vm_name,
      vm.guest_hostname,
      vm.guest_os,
      vm.ip_address,
      vm.power_state,
      vm.num_cpu,
      vm.memory_gb,
      vm.vm_compatibility,
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
    link.setAttribute('download', `${result.vcenter}-vms-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Search by vCenter</h2>
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent" />
          </div>
        ) : (
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                list="vcenters-list"
                placeholder="Enter or select a vCenter..."
                value={selectedVCenter}
                onChange={(e) => setSelectedVCenter(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <datalist id="vcenters-list">
                {vcenters.map((vc) => (
                  <option key={vc} value={vc} />
                ))}
              </datalist>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Search
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">You can type to search or select from the dropdown</p>
          </form>
        )}
      </div>

      {searched && (
        <>
          {notFound && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300">
              vCenter &quot;{searchTerm}&quot; not found.
            </div>
          )}

          {result && (
            <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">vCenter Name</p>
                  <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{result.vcenter}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Site</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{result.site}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">vCenter IP</p>
                  <p className="text-sm text-gray-900 dark:text-white">{result.vcenter_ip}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total VMs</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{result.total_vms}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Powered On</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">{result.powered_on}</p>
                </div>
                <div className="bg-gray-100 dark:bg-slate-800 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Powered Off</p>
                  <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">{result.powered_off}</p>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setExpandedVMs(!expandedVMs)}
                  className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
                >
                  {expandedVMs ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  {expandedVMs ? 'Hide' : 'Show'} VMs ({result.vms.length})
                </button>
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>

              {expandedVMs && (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-gray-900 dark:text-white">VM Name</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-900 dark:text-white">Site</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-900 dark:text-white">Power State</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-900 dark:text-white">Hostname</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-900 dark:text-white">Guest OS</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-900 dark:text-white">IP Address</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-900 dark:text-white">CPU/Memory</th>
                        <th className="text-left px-4 py-3 font-semibold text-gray-900 dark:text-white">Compatibility</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                      {result.vms.map((vm) => (
                        <tr key={vm.vm_name} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                          <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{vm.vm_name}</td>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{vm.site}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                vm.power_state === 'PoweredOn'
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                  : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {vm.power_state}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{vm.guest_hostname}</td>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300 text-xs max-w-xs truncate" title={vm.guest_os}>{vm.guest_os}</td>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300 text-xs max-w-xs truncate font-mono" title={vm.ip_address}>{vm.ip_address}</td>
                          <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                            {vm.num_cpu} / {vm.memory_gb}GB
                          </td>
                          <td className="px-4 py-3 text-xs">
                            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                              {vm.vm_compatibility}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
