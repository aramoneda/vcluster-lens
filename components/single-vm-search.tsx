'use client';

import { useState } from 'react';
import { searchVM, VM } from '@/lib/search';
import { Search } from 'lucide-react';

export function SingleVMSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState<VM | null>(null);
  const [searched, setSearched] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const vm = await searchVM(searchTerm);
    if (vm) {
      setResult(vm);
      setNotFound(false);
    } else {
      setResult(null);
      setNotFound(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Search Single VM</h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter VM name (e.g., cldvvssp002)"
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
              VM &quot;{searchTerm}&quot; not found.
            </div>
          )}

          {result && (
            <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <span className="font-semibold">Compatibility:</span> {result.vm_compatibility}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">VM Name</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{result.vm_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">vCenter</p>
                  <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{result.vcenter}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Power State</p>
                  <p
                    className={`text-lg font-semibold ${
                      result.power_state === 'PoweredOn'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {result.power_state}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Site</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{result.site}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Guest OS</p>
                  <p className="text-sm text-gray-900 dark:text-white">{result.guest_os}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Hostname</p>
                  <p className="text-sm text-gray-900 dark:text-white">{result.guest_hostname}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">IP Address</p>
                  <p className="text-sm text-gray-900 dark:text-white">{result.ip_address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">ESXi Host</p>
                  <p className="text-sm text-gray-900 dark:text-white">{result.esxi_host}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Cluster</p>
                  <p className="text-sm text-gray-900 dark:text-white">{result.cluster}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">CPU Cores</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{result.num_cpu}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Memory</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{result.memory_gb} GB</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Storage (Provisioned)</p>
                  <p className="text-sm text-gray-900 dark:text-white">{result.provisioned_gb.toFixed(2)} GB</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Storage (Used)</p>
                  <p className="text-sm text-gray-900 dark:text-white">{result.used_gb.toFixed(2)} GB</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tools Status</p>
                  <p className="text-sm text-gray-900 dark:text-white">{result.tools_status}</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
