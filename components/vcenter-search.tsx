'use client';

import { useState, useEffect } from 'react';
import { searchByVCenter, getVCenters, VCenterStats, formatToolsStatus } from '@/lib/search';
import { ChevronDown, ChevronUp, Download, X } from 'lucide-react';

export function VCenterSearch() {
  const [vcenters, setVcenters] = useState<VCenterStats[]>([]);
  const [selectedVCenter, setSelectedVCenter] = useState('');
  const [result, setResult] = useState<VCenterStats | null>(null);
  const [searched, setSearched] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [expandedVMs, setExpandedVMs] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filteredVMs, setFilteredVMs] = useState<any[]>([]);
  const [guestOSOptions, setGuestOSOptions] = useState<{ [key: string]: string[] }>({});
  const [vcenterError, setVcenterError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    powerState: [] as string[],
    guestOS: [] as string[],
    toolsStatus: [] as string[],
    memory: [] as number[],
    cpuCount: [] as number[],
  });

  const getOSCategory = (osName: string): string => {
    const osLower = osName.toLowerCase();
    if (osLower.includes('windows')) return 'Windows';
    if (osLower.includes('ubuntu')) return 'Ubuntu';
    if (osLower.includes('centos')) return 'CentOS';
    if (osLower.includes('debian')) return 'Debian';
    if (osLower.includes('red hat') || osLower.includes('rhel')) return 'Red Hat';
    if (osLower.includes('oracle')) return 'Oracle Linux';
    if (osLower.includes('rocky')) return 'Rocky Linux';
    if (osLower.includes('alma')) return 'AlmaLinux';
    if (osLower.includes('suse')) return 'SUSE';
    if (osLower.includes('fedora')) return 'Fedora';
    if (osLower.includes('amazon')) return 'Amazon Linux';
    if (osLower.includes('photon')) return 'VMware Photon';
    if (osLower.includes('freebsd')) return 'FreeBSD';
    if (osLower.includes('linux')) return 'Linux';
    return 'Other';
  };

  const extractGuestOSForVCenter = (vcenter: VCenterStats) => {
    const osMap: { [key: string]: Set<string> } = {};
    
    vcenter.vms?.forEach((vm: any) => {
      if (vm.guest_os && vm.guest_os.trim()) {
        const category = getOSCategory(vm.guest_os);
        if (!osMap[category]) osMap[category] = new Set();
        osMap[category].add(vm.guest_os);
      }
    });
    
    const grouped: { [key: string]: string[] } = {};
    Object.keys(osMap).sort().forEach(category => {
      grouped[category] = Array.from(osMap[category]).sort();
    });
    
    return grouped;
  };

  const checkVCenterAccessibility = (vcenter: VCenterStats): string | null => {
    if (!vcenter.vms || vcenter.vms.length === 0) {
      return 'No VM data available for this vCenter.';
    }
    
    const hasError = vcenter.vms.some((vm: any) => vm.notes && vm.notes.includes('Could not resolve') || vm.notes?.includes('Cannot complete login') || vm.notes?.includes('Permission'));
    
    if (hasError) {
      const errorNotes = vcenter.vms.find((vm: any) => vm.notes && (vm.notes.includes('Could not resolve') || vm.notes.includes('Cannot complete login') || vm.notes.includes('Permission')))?.notes;
      if (errorNotes) {
        const lines = errorNotes.split('\n');
        return lines[lines.length - 2] || 'Unable to access this vCenter. Please check connectivity and credentials.';
      }
    }
    
    return null;
  };

  useEffect(() => {
    const loadVCenters = async () => {
      const vcList = await getVCenters();
      setVcenters(vcList);
      setLoading(false);
    };
    loadVCenters();
  }, []);

  useEffect(() => {
    if (selectedVCenter && vcenters.length > 0) {
      const vcenterData = vcenters.find(vc => vc.vcenter === selectedVCenter);
      if (vcenterData) {
        const error = checkVCenterAccessibility(vcenterData);
        setVcenterError(error);
        
        if (!error) {
          const osOptions = extractGuestOSForVCenter(vcenterData);
          setGuestOSOptions(osOptions);
        } else {
          setGuestOSOptions({});
        }
      }
    } else {
      setVcenterError(null);
      setGuestOSOptions({});
    }
  }, [selectedVCenter, vcenters]);

  const applyFilters = (vms: any[]) => {
    return vms.filter(vm => {
      if (filters.powerState.length > 0 && !filters.powerState.includes(vm.power_state)) {
        return false;
      }
      if (filters.guestOS.length > 0 && !filters.guestOS.some(os => vm.guest_os?.toLowerCase().includes(os.toLowerCase()))) {
        return false;
      }
      if (filters.toolsStatus.length > 0) {
        const toolsStatus = vm.tools_status?.toLowerCase() || 'unmanaged';
        if (!filters.toolsStatus.includes(toolsStatus)) return false;
      }
      if (filters.memory.length > 0 && !filters.memory.includes(vm.memory_gb)) {
        return false;
      }
      if (filters.cpuCount.length > 0 && !filters.cpuCount.includes(vm.num_cpu)) {
        return false;
      }
      return true;
    });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVCenter) return;
    
    setSearched(true);
    const vcenter = await searchByVCenter(selectedVCenter);
    if (vcenter) {
      const filtered = applyFilters(vcenter.vms);
      setResult(vcenter);
      setFilteredVMs(filtered);
      setNotFound(false);
    } else {
      setResult(null);
      setNotFound(true);
    }
  };

  const handleExportCSV = () => {
    if (!result) return;

    const headers = ['VM Name', 'Hostname', 'Guest OS', 'IP Address', 'Power State', 'CPU', 'Memory (GB)', 'Provisioned Storage (GB)', 'Used Storage (GB)', 'Compatibility', 'VMware Tools Status', 'Has Snapshots'];
    const rows = filteredVMs.map((vm) => [
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
      vm.has_snapshot && vm.has_snapshot !== 'No' ? 'Yes' : 'No',
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
              <div className="flex-1 relative">
                <input
                  type="text"
                  list="vcenters-list"
                  placeholder="Enter or select a vCenter..."
                  value={selectedVCenter}
                  onChange={(e) => setSelectedVCenter(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                />
                {selectedVCenter && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedVCenter('');
                      setResult(null);
                      setSearched(false);
                      setNotFound(false);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-600 rounded transition-colors"
                    title="Clear selection"
                  >
                    <X className="h-4 w-4 text-slate-400 hover:text-slate-200" />
                  </button>
                )}
              </div>
              <datalist id="vcenters-list">
                {vcenters.map((vc) => (
                  <option key={vc.vcenter} value={vc.vcenter} />
                ))}
              </datalist>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Search
              </button>
            </div>
            <p className="text-xs text-slate-400">You can type to search, select from the dropdown, or click the X to clear the selection</p>

            {selectedVCenter && !searched && (
              <div className="mt-6 pt-6 border-t border-slate-700">
                {vcenterError ? (
                  <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-4">
                    <h3 className="text-sm font-semibold text-red-300 mb-2">vCenter Accessibility Issue</h3>
                    <p className="text-xs text-red-200">{vcenterError}</p>
                    <p className="text-xs text-red-300 mt-2">Advanced filtering is unavailable for this vCenter until connectivity and access issues are resolved.</p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-sm font-semibold text-slate-200 mb-4">Advanced Filtering (Optional)</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column */}
                  <div className="space-y-5">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-3 uppercase tracking-wide">Power State</label>
                      <div className="space-y-2.5">
                        {['PoweredOn', 'PoweredOff', 'Suspended'].map(state => (
                          <label key={state} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                            <input
                              type="checkbox"
                              checked={filters.powerState.includes(state)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFilters(prev => ({ ...prev, powerState: [...prev.powerState, state] }));
                                } else {
                                  setFilters(prev => ({ ...prev, powerState: prev.powerState.filter(s => s !== state) }));
                                }
                              }}
                              className="rounded border-slate-600 bg-slate-700 cursor-pointer w-4 h-4"
                            />
                            <span className="text-sm text-slate-300">{state}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-3 uppercase tracking-wide">Tools Status</label>
                      <div className="space-y-2.5">
                        {['running', 'outdated', 'unmanaged'].map(status => (
                          <label key={status} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                            <input
                              type="checkbox"
                              checked={filters.toolsStatus.includes(status)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFilters(prev => ({ ...prev, toolsStatus: [...prev.toolsStatus, status] }));
                                } else {
                                  setFilters(prev => ({ ...prev, toolsStatus: prev.toolsStatus.filter(s => s !== status) }));
                                }
                              }}
                              className="rounded border-slate-600 bg-slate-700 cursor-pointer w-4 h-4"
                            />
                            <span className="text-sm text-slate-300 capitalize">{status}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Middle Column */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-3 uppercase tracking-wide">Guest OS</label>
                    <div className="space-y-3">
                      {Object.entries(guestOSOptions).map(([category, osVersions]) => (
                        <div key={category}>
                          <div className="text-xs font-semibold text-slate-400 mb-1.5 pl-1">{category}</div>
                          <div className="space-y-1.5 pl-2 border-l border-slate-600">
                            {osVersions.slice(0, 3).map(os => (
                              <label key={os} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity text-xs">
                                <input
                                  type="checkbox"
                                  checked={filters.guestOS.includes(os)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setFilters(prev => ({ ...prev, guestOS: [...prev.guestOS, os] }));
                                    } else {
                                      setFilters(prev => ({ ...prev, guestOS: prev.guestOS.filter(s => s !== os) }));
                                    }
                                  }}
                                  className="rounded border-slate-600 bg-slate-700 cursor-pointer w-3 h-3"
                                />
                                <span className="text-slate-300 truncate" title={os}>{os.replace(/\(64-bit\)|\(32-bit\)/g, '').trim()}</span>
                              </label>
                            ))}
                            {osVersions.length > 3 && (
                              <span className="text-xs text-slate-500 italic">+{osVersions.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      ))}
                      {Object.keys(guestOSOptions).length === 0 && (
                        <span className="text-xs text-slate-400">Loading OS options...</span>
                      )}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-5">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-3 uppercase tracking-wide">Memory (GB)</label>
                      <div className="grid grid-cols-4 gap-2">
                        {[4, 8, 16, 32, 64, 128, 256, 512].map(size => (
                          <label key={size} className="flex items-center justify-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.memory.includes(size)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFilters(prev => ({ ...prev, memory: [...prev.memory, size].sort((a, b) => a - b) }));
                                } else {
                                  setFilters(prev => ({ ...prev, memory: prev.memory.filter(m => m !== size) }));
                                }
                              }}
                              className="sr-only peer"
                            />
                            <span className="text-xs text-slate-300 px-2.5 py-1.5 bg-slate-700 border border-slate-600 rounded hover:bg-slate-600 peer-checked:bg-blue-600 peer-checked:border-blue-500 peer-checked:text-white transition-colors cursor-pointer">
                              {size}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-3 uppercase tracking-wide">CPU Count</label>
                      <div className="grid grid-cols-4 gap-2">
                        {[1, 2, 4, 8, 16, 32, 64, 128].map(cpu => (
                          <label key={cpu} className="flex items-center justify-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters.cpuCount.includes(cpu)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFilters(prev => ({ ...prev, cpuCount: [...prev.cpuCount, cpu].sort((a, b) => a - b) }));
                                } else {
                                  setFilters(prev => ({ ...prev, cpuCount: prev.cpuCount.filter(c => c !== cpu) }));
                                }
                              }}
                              className="sr-only peer"
                            />
                            <span className="text-xs text-slate-300 px-2.5 py-1.5 bg-slate-700 border border-slate-600 rounded hover:bg-slate-600 peer-checked:bg-blue-600 peer-checked:border-blue-500 peer-checked:text-white transition-colors cursor-pointer">
                              {cpu}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                  >
                    Search with Filters
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFilters({
                        powerState: [],
                        guestOS: [],
                        toolsStatus: [],
                        memory: [],
                        cpuCount: [],
                      });
                    }}
                    className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg transition-colors font-medium"
                  >
                    Clear Filters
                  </button>
                </div>
                  </>
                )}
              </div>
            )}
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

              {!result.isAccessible ? (
                <div className="mt-4 bg-red-900/20 border border-red-800/50 rounded-lg p-4">
                  <p className="text-red-200 font-semibold">Unable to connect to vCenter</p>
                  {result.errorMessage && (
                    <p className="text-red-300/80 text-sm mt-2 font-mono break-words">{result.errorMessage}</p>
                  )}
                </div>
              ) : result.vms.length === 0 ? (
                <div className="mt-4 bg-yellow-900/20 border border-yellow-800/50 rounded-lg p-4">
                  <p className="text-yellow-200 font-semibold">No VMs found for this vCenter</p>
                  <p className="text-yellow-300/70 text-sm mt-1">This vCenter is accessible but has no VMs or they are currently unavailable.</p>
                </div>
              ) : (
                <>
                  <div className="pt-4 flex items-center justify-between">
                    <button
                      onClick={() => setExpandedVMs(!expandedVMs)}
                      className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
                    >
                      {expandedVMs ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      {expandedVMs ? 'Hide' : 'Show'} VMs ({filteredVMs.length}/{result.vms.length})
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
                        <th className="text-left px-4 py-3 font-semibold text-white">Compatibility</th>
                        <th className="text-left px-4 py-3 font-semibold text-white">VMware Tools Status</th>
                        <th className="text-left px-4 py-3 font-semibold text-white">Has Snapshots?</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {filteredVMs.map((vm) => (
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
                          <td className="px-4 py-3 text-xs text-slate-300">{vm.vm_compatibility || '-'}</td>
                          <td className="px-4 py-3 text-xs text-slate-300">
                            {formatToolsStatus(vm)}
                          </td>
                          <td className="px-4 py-3 text-xs">
                            {vm.has_snapshot && vm.has_snapshot !== 'No' && vm.snapshot_details && vm.snapshot_details.length > 0 ? (
                              <div className="space-y-1">
                                {vm.snapshot_details.map((snap, idx) => (
                                  <div key={idx} className="bg-yellow-900/30 rounded p-1.5">
                                    <p className="text-yellow-200 font-medium truncate">{snap.name || `Snapshot ${idx + 1}`}</p>
                                    {snap.created && <p className="text-yellow-300/70 text-xs">{snap.created}</p>}
                                    {snap.size_gb && <p className="text-yellow-300/70 text-xs">{snap.size_gb.toFixed(2)} GB</p>}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className={`px-2 py-1 rounded inline-block ${vm.has_snapshot && vm.has_snapshot !== 'No' ? 'bg-yellow-900/40 text-yellow-300' : 'bg-slate-700 text-slate-400'}`}>
                                {vm.has_snapshot && vm.has_snapshot !== 'No' ? 'Yes' : 'No'}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
