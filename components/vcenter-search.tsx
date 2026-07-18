'use client';

import { useState, useEffect } from 'react';
import { searchByVCenter, getVCenters, VCenterStats, formatToolsStatus } from '@/lib/search';
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

    const headers = ['VM Name', 'Hostname', 'Guest OS', 'IP Address', 'Power State', 'CPU', 'Memory (GB)', 'Provisioned Storage (GB)', 'Used Storage (GB)', 'Compatibility', 'VMware Tools Status', 'Snapshots'];
    const rows = result.vms.map((vm) => [
      vm.vm_name,
      vm.guest_hostname,
      vm.guest_os,
      vm.ip_address,
      vm.power_state,
      vm.num_cpu,
      vm.memory_gb,
      vm.provisioned_gb.toFixed(2),
      vm.used_gb.toFixed(2),
      vm.vm_compatibility,
      formatToolsStatus(vm),
      vm.snapshot_count || 0,
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
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-white">Search by vCenter</h2>
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
                className="flex-1 px-4 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <p className="text-xs text-slate-400">You can type to search or select from the dropdown</p>
          </form>
        )}
      </div>

      {searched && (
        <>
          {notFound && (
            <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 text-red-200">
              vCenter &quot;{selectedVCenter}&quot; not found.
            </div>
          )}

          {result && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 shadow-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-slate-400">vCenter Name</p>
                  <p className="text-lg font-semibold text-blue-300">{result.vcenter}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Site</p>
                  <p className="text-lg font-semibold text-slate-100">{result.site}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">vCenter IP</p>
                  <p className="text-sm text-slate-200">{result.vcenter_ip}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700">
                <div className="bg-blue-900/30 border border-blue-800/50 rounded-lg p-4">
                  <p className="text-sm text-blue-300">Total VMs</p>
                  <p className="text-3xl font-bold text-blue-200">{result.total_vms}</p>
                </div>
                <div className="bg-emerald-900/30 border border-emerald-800/50 rounded-lg p-4">
                  <p className="text-sm text-emerald-300">Powered On</p>
                  <p className="text-3xl font-bold text-emerald-200">{result.powered_on}</p>
                </div>
                <div className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4">
                  <p className="text-sm text-slate-300">Powered Off</p>
                  <p className="text-3xl font-bold text-slate-200">{result.powered_off}</p>
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
                    <thead className="bg-slate-700 border-b border-slate-600 sticky top-0">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-white">VM Name</th>
                        <th className="text-left px-4 py-3 font-semibold text-white">Site</th>
                        <th className="text-left px-4 py-3 font-semibold text-white">Power State</th>
                        <th className="text-left px-4 py-3 font-semibold text-white">Hostname</th>
                        <th className="text-left px-4 py-3 font-semibold text-white">Guest OS</th>
                        <th className="text-left px-4 py-3 font-semibold text-white">IP Address</th>
                        <th className="text-left px-4 py-3 font-semibold text-white">CPU/Memory</th>
                        <th className="text-left px-4 py-3 font-semibold text-white">Storage</th>
                        <th className="text-left px-4 py-3 font-semibold text-white">VMware Tools Status</th>
                        <th className="text-left px-4 py-3 font-semibold text-white">Snapshots</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {result.vms.map((vm) => (
                        <tr key={vm.vm_name} className="hover:bg-slate-700/50">
                          <td className="px-4 py-3 text-slate-100 font-medium">{vm.vm_name}</td>
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
                          <td className="px-4 py-3 text-slate-300 text-xs max-w-xs truncate" title={vm.guest_os}>{vm.guest_os}</td>
                          <td className="px-4 py-3 text-slate-300 text-xs max-w-xs truncate font-mono" title={vm.ip_address}>{vm.ip_address}</td>
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
                            {formatToolsStatus(vm)}
                          </td>
                          <td className="px-4 py-3 text-xs">
                            <span className={`px-2 py-1 rounded ${vm.has_snapshot && vm.has_snapshot !== 'No' ? 'bg-yellow-900/40 text-yellow-300' : 'bg-slate-700 text-slate-400'}`}>
                              {vm.snapshot_count || 0}
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
