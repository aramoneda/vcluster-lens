'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronRight, Download, BarChart3, Search } from 'lucide-react';

interface VM {
  name: string;
  vmware_name: string;
  power_state: string;
  hostname: string;
  ip_addresses: string[];
  vcpu: number;
  memory_gb: number;
  storage_provisioned_gb: number;
  storage_used_gb: number;
  esxi_host: string;
  cluster: string;
  vcenter: string;
  os: string;
  vmware_tools_status: string;
  snapshots_count: number;
  compatibility: string;
}

interface Analytics {
  totalVMs: number;
  totalVCenters: number;
  poweredOn: number;
  poweredOff: number;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  data?: VM[] | Analytics;
}

export default function VCenterChatboard() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Welcome to the vCenter Chatboard! Search VMs across all vCenters. Try asking:\n• "Show powered off VMs"\n• "Find web-server VMs"\n• "Show analytics"\n• "Find VMs in production cluster"',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [vmData, setVmData] = useState<VM[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch VM data on mount
    fetchVMData();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchVMData = async () => {
    try {
      const response = await fetch(
        'https://raw.githubusercontent.com/aramoneda/v-center-dashboard-v2/main/public/vm-inventory.json'
      );
      const data = await response.json();
      setVmData(data);
    } catch (error) {
      console.error('Failed to fetch VM data:', error);
    }
  };

  const getAnalytics = (): Analytics => {
    if (!vmData || vmData.length === 0) {
      return { totalVMs: 0, totalVCenters: 0, poweredOn: 0, poweredOff: 0 };
    }

    const vcenters = new Set(vmData.map((vm) => vm.vcenter));
    const poweredOn = vmData.filter((vm) => vm.power_state === 'PoweredOn').length;
    const poweredOff = vmData.filter((vm) => vm.power_state === 'PoweredOff').length;

    return {
      totalVMs: vmData.length,
      totalVCenters: vcenters.size,
      poweredOn,
      poweredOff,
    };
  };

  const searchVMs = (query: string): VM[] => {
    if (!vmData || vmData.length === 0) return [];

    const lowerQuery = query.toLowerCase();

    // Analytics query
    if (query.toLowerCase().includes('analytics') || query.toLowerCase().includes('summary')) {
      return [];
    }

    // Powered state queries
    if (query.toLowerCase().includes('powered off')) {
      return vmData.filter((vm) => vm.power_state === 'PoweredOff');
    }
    if (query.toLowerCase().includes('powered on') || query.toLowerCase().includes('running')) {
      return vmData.filter((vm) => vm.power_state === 'PoweredOn');
    }

    // Cluster queries
    const clusterMatch = query.match(/cluster[:\s]+(\w+)/i);
    if (clusterMatch) {
      return vmData.filter((vm) => vm.cluster.toLowerCase().includes(clusterMatch[1].toLowerCase()));
    }

    // Hostname/pattern queries
    const patternMatch = query.match(/(?:find|search|show)\s+(?:vms?\s+)?(?:named\s+)?([^\s]+)/i);
    if (patternMatch) {
      const pattern = patternMatch[1]
        .replace(/\*/g, '.*')
        .replace(/\?/g, '.');

      try {
        const regex = new RegExp(pattern, 'i');
        return vmData.filter((vm) =>
          regex.test(vm.hostname) || regex.test(vm.vmware_name) || regex.test(vm.name)
        );
      } catch {
        // Fallback to simple search
        return vmData.filter(
          (vm) =>
            vm.hostname.toLowerCase().includes(lowerQuery) ||
            vm.vmware_name.toLowerCase().includes(lowerQuery) ||
            vm.name.toLowerCase().includes(lowerQuery)
        );
      }
    }

    // Default search
    return vmData.filter(
      (vm) =>
        vm.hostname.toLowerCase().includes(lowerQuery) ||
        vm.vmware_name.toLowerCase().includes(lowerQuery) ||
        vm.name.toLowerCase().includes(lowerQuery)
    );
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    setLoading(true);
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    const query = input;
    setInput('');

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 500));

    let assistantContent = '';
    let resultData: VM[] | Analytics | undefined;

    // Handle different query types
    if (query.toLowerCase().includes('analytics') || query.toLowerCase().includes('summary')) {
      const analytics = getAnalytics();
      resultData = analytics;
      assistantContent = `📊 **vCenter Analytics**\n\n• **Total VMs:** ${analytics.totalVMs}\n• **Total vCenters:** ${analytics.totalVCenters}\n• **Powered On:** ${analytics.poweredOn} (${((analytics.poweredOn / analytics.totalVMs) * 100).toFixed(1)}%)\n• **Powered Off:** ${analytics.poweredOff} (${((analytics.poweredOff / analytics.totalVMs) * 100).toFixed(1)}%)`;
    } else {
      const results = searchVMs(query);
      if (results.length > 0) {
        resultData = results;
        assistantContent = `Found ${results.length} VM${results.length !== 1 ? 's' : ''}`;
      } else {
        assistantContent = 'No VMs found matching your search. Try:\n• "Show powered off VMs"\n• "Show analytics"\n• Use wildcards like "web-*"';
      }
    }

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: assistantContent,
      data: resultData,
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setLoading(false);
  };

  const exportResults = (data: VM[] | Analytics | undefined, format: 'csv' | 'json') => {
    if (!data) return;

    let content = '';
    let filename = '';

    if (Array.isArray(data)) {
      if (format === 'csv') {
        const headers = [
          'Name',
          'Hostname',
          'Power State',
          'CPU',
          'Memory (GB)',
          'Storage Provisioned (GB)',
          'vCenter',
          'Cluster',
        ];
        content = headers.join(',') + '\n';
        content += data
          .map((vm) =>
            [vm.vmware_name, vm.hostname, vm.power_state, vm.vcpu, vm.memory_gb, vm.storage_provisioned_gb, vm.vcenter, vm.cluster].join(',')
          )
          .join('\n');
        filename = 'vm-search-results.csv';
      } else {
        content = JSON.stringify(data, null, 2);
        filename = 'vm-search-results.json';
      }
    } else {
      // Analytics
      if (format === 'csv') {
        content = 'Metric,Value\nTotal VMs,' + data.totalVMs + '\nTotal vCenters,' + data.totalVCenters + '\nPowered On,' + data.poweredOn + '\nPowered Off,' + data.poweredOff;
        filename = 'vcenter-analytics.csv';
      } else {
        content = JSON.stringify(data, null, 2);
        filename = 'vcenter-analytics.json';
      }
    }

    const blob = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  const analytics = getAnalytics();

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 px-6 py-4 shadow-lg">
        <h1 className="text-2xl font-bold">vCenter Chatboard</h1>
        <p className="text-sm text-blue-200">Search VMs across all vCenters • Private access</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 gap-4 p-6 bg-slate-900">
        <div className="bg-slate-800 rounded-lg p-4 border border-blue-900/30">
          <div className="text-sm text-slate-400 mb-1">Total VMs</div>
          <div className="text-3xl font-bold text-blue-400">{analytics.totalVMs}</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-blue-900/30">
          <div className="text-sm text-slate-400 mb-1">vCenters</div>
          <div className="text-3xl font-bold text-blue-400">{analytics.totalVCenters}</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-green-900/30">
          <div className="text-sm text-slate-400 mb-1">Powered On</div>
          <div className="text-3xl font-bold text-green-400">{analytics.poweredOn}</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-red-900/30">
          <div className="text-sm text-slate-400 mb-1">Powered Off</div>
          <div className="text-3xl font-bold text-red-400">{analytics.poweredOff}</div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-2xl rounded-lg p-4 ${
                message.type === 'user'
                  ? 'bg-blue-900 text-white rounded-br-none'
                  : 'bg-slate-800 text-slate-100 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap mb-2">{message.content}</p>

              {/* Display VM Results */}
              {message.data && Array.isArray(message.data) && message.data.length > 0 && (
                <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                  {message.data.slice(0, 5).map((vm, idx) => (
                    <div key={idx} className="bg-slate-700/50 rounded p-2 text-sm">
                      <div className="font-semibold text-blue-300">{vm.vmware_name}</div>
                      <div className="grid grid-cols-2 gap-1 text-xs mt-1">
                        <div>
                          State: <span className={vm.power_state === 'PoweredOn' ? 'text-green-400' : 'text-red-400'}>{vm.power_state}</span>
                        </div>
                        <div>CPU: {vm.vcpu}</div>
                        <div>Memory: {vm.memory_gb} GB</div>
                        <div>Storage: {vm.storage_provisioned_gb} GB</div>
                      </div>
                    </div>
                  ))}
                  {message.data.length > 5 && (
                    <div className="text-xs text-slate-400">... and {message.data.length - 5} more VMs</div>
                  )}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => exportResults(message.data, 'csv')}
                      className="text-xs bg-blue-900 hover:bg-blue-800 px-3 py-1 rounded flex items-center gap-1"
                    >
                      <Download size={12} /> CSV
                    </button>
                    <button
                      onClick={() => exportResults(message.data, 'json')}
                      className="text-xs bg-blue-900 hover:bg-blue-800 px-3 py-1 rounded flex items-center gap-1"
                    >
                      <Download size={12} /> JSON
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-slate-900 border-t border-slate-800 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Search VMs, analytics, or ask questions..."
            className="flex-1 bg-slate-800 rounded-lg px-4 py-2 text-white placeholder-slate-500 border border-slate-700 focus:border-blue-500 focus:outline-none"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-blue-900 hover:bg-blue-800 disabled:bg-slate-700 rounded-lg px-4 py-2 flex items-center gap-2"
          >
            {loading ? 'Loading...' : <ChevronRight size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}
