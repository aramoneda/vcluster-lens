'use client';

import { useState } from 'react';
import { searchByVCenter, getVCenters, VCenterStats } from '@/lib/search';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

export function VCenterSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState<VCenterStats | null>(null);
  const [searched, setSearched] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [expandedVMs, setExpandedVMs] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const vcenter = await searchByVCenter(searchTerm);
    if (vcenter) {
      setResult(vcenter);
      setNotFound(false);
    } else {
      setResult(null);
      setNotFound(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Search by vCenter</h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter vCenter name (e.g., clpvvvcsa001)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </form>
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

              <div className="pt-4">
                <button
                  onClick={() => setExpandedVMs(!expandedVMs)}
                  className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
                >
                  {expandedVMs ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  {expandedVMs ? 'Hide' : 'Show'} VMs ({result.vms.length})
                </button>

                {expandedVMs && (
                  <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
                    {result.vms.map((vm) => (
                      <div
                        key={vm.vm_name}
                        className="bg-gray-50 dark:bg-slate-800 rounded p-3 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{vm.vm_name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{vm.guest_hostname}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            vm.power_state === 'PoweredOn'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {vm.power_state}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
