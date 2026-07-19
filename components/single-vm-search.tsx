'use client';

import { useState } from 'react';
import { searchVM, VM, formatToolsStatus } from '@/lib/search';
import { Search, X } from 'lucide-react';

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

  const handleClear = () => {
    setSearchTerm('');
    setResult(null);
    setSearched(false);
    setNotFound(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-white">Search Single VM</h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Enter VM name (e.g., cldvvssp002)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pr-10 border border-slate-600 rounded-lg bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
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
            <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 text-red-200">
              VM &quot;{searchTerm}&quot; not found.
            </div>
          )}

          {result && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 shadow-lg space-y-4">
              <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-3">
                <p className="text-sm text-blue-200">
                  <span className="font-semibold">Compatibility:</span> {result.vm_compatibility}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-400">VM Name</p>
                  <p className="text-lg font-semibold text-slate-100">{result.vm_name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">vCenter</p>
                  <p className="text-lg font-semibold text-blue-300">{result.vcenter}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Power State</p>
                  <p
                    className={`text-lg font-semibold ${
                      result.power_state === 'PoweredOn'
                        ? 'text-emerald-300'
                        : 'text-slate-400'
                    }`}
                  >
                    {result.power_state}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Site</p>
                  <p className="text-lg font-semibold text-slate-100">{result.site}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Guest OS</p>
                  <p className="text-sm text-slate-200">{result.guest_os}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Hostname</p>
                  <p className="text-sm text-slate-200">{result.guest_hostname}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">IP Address</p>
                  <p className="text-sm text-slate-200">{result.ip_address}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">ESXi Host</p>
                  <p className="text-sm text-slate-200">{result.esxi_host}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Cluster</p>
                  <p className="text-sm text-slate-200">{result.cluster}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">CPU Cores</p>
                  <p className="text-lg font-semibold text-slate-100">{result.num_cpu}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Memory</p>
                  <p className="text-lg font-semibold text-slate-100">{result.memory_gb} GB</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Storage (Provisioned)</p>
                  <p className="text-sm text-slate-200">{result.provisioned_gb.toFixed(2)} GB</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Storage (Used)</p>
                  <p className="text-sm text-slate-200">{result.used_gb.toFixed(2)} GB</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">VMware Tools Status</p>
                  <p className="text-sm text-slate-200">{formatToolsStatus(result)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Has Snapshot</p>
                  <p className={`text-sm font-semibold ${result.has_snapshot && result.has_snapshot !== 'No' ? 'text-yellow-300' : 'text-emerald-300'}`}>
                    {result.has_snapshot && result.has_snapshot !== 'No' ? `Yes (${result.snapshot_count || 0})` : 'No'}
                  </p>
                </div>
              </div>

              {result.has_snapshot && result.has_snapshot !== 'No' && result.snapshot_details && result.snapshot_details.length > 0 && (
                <div className="mt-4 bg-yellow-900/20 border border-yellow-800/50 rounded-lg p-4 space-y-3">
                  <p className="text-sm font-semibold text-yellow-200">Snapshot Details ({result.snapshot_details.length})</p>
                  {result.snapshot_details.map((snapshot, idx) => (
                    <div key={idx} className="bg-yellow-900/10 rounded p-3 space-y-1">
                      {snapshot.name && (
                        <div>
                          <p className="text-xs text-yellow-300/70">Name</p>
                          <p className="text-sm text-yellow-100">{snapshot.name}</p>
                        </div>
                      )}
                      {snapshot.created && (
                        <div>
                          <p className="text-xs text-yellow-300/70">Created</p>
                          <p className="text-sm text-yellow-100">{snapshot.created}</p>
                        </div>
                      )}
                      {snapshot.size_gb && (
                        <div>
                          <p className="text-xs text-yellow-300/70">Size</p>
                          <p className="text-sm text-yellow-100">{snapshot.size_gb.toFixed(2)} GB</p>
                        </div>
                      )}
                      {snapshot.description && (
                        <div>
                          <p className="text-xs text-yellow-300/70">Description</p>
                          <p className="text-sm text-yellow-100">{snapshot.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
