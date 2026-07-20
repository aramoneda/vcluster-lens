import { getVMData } from './indexed-db';

export interface VM {
  vm_name: string;
  vcenter: string;
  site: string;
  power_state: string;
  guest_os: string;
  guest_hostname: string;
  ip_address: string;
  esxi_host: string;
  cluster: string;
  num_cpu: number;
  memory_gb: number;
  provisioned_gb: number;
  used_gb: number;
  tools_status: string;
  vmtools?: string;
  tools_version?: string;
  tools_version_status?: string;
  tools_running_status?: string;
  collection_time: string;
  vm_compatibility: string;
  has_snapshot?: boolean | string;
  snapshot_count?: number;
  snapshot_details?: Array<{
    name?: string;
    created?: string;
    size_gb?: number;
    description?: string;
  }>;
}

export interface VCenterStats {
  vcenter: string;
  site: string;
  vcenter_ip?: string;
  vcenter_version?: string;
  total_vms: number;
  powered_on: number;
  powered_off: number;
  vms: VM[];
  isAccessible: boolean;
  errorMessage?: string;
}

// Extract error message from notes field
function extractErrorMessage(notes: string): string {
  if (!notes) return '';
  
  // Notes format: "timestamp\tConnect-VIServer\t\tError message\nAdditional info..."
  // Extract the main error message (third tab-separated field) and first line
  const lines = notes.split('\n');
  if (lines.length > 0) {
    const firstLine = lines[0];
    const parts = firstLine.split('\t');
    // Get the error message (usually 4th field, index 3)
    if (parts.length >= 4) {
      const errorPart = parts.slice(3).join('\t').trim();
      return errorPart;
    }
  }
  return notes.split('\n')[0]; // Fallback to first line
}

// Cached data with 8-hour TTL (28,800,000 ms)
const CACHE_TTL = 8 * 60 * 60 * 1000;
let cachedVMData: any[] | null = null;
let cachedVCenters: VCenterStats[] | null = null;
let cacheTimestamp: number | null = null;

// Check if cache is still valid
function isCacheValid(): boolean {
  if (!cacheTimestamp) return false;
  return Date.now() - cacheTimestamp < CACHE_TTL;
}

// Clear cache
export function clearCache(): void {
  cachedVMData = null;
  cachedVCenters = null;
  cacheTimestamp = null;
}

// Get cache timestamp
export function getCacheTimestamp(): number | null {
  return cacheTimestamp;
}

// Load VM data from IndexedDB or JSON file
async function getLoadedVMData(): Promise<any[]> {
  // Check if cache exists and is still valid (within 8-hour TTL)
  if (cachedVMData && isCacheValid()) return cachedVMData;
  
  // If cache expired, clear it
  if (cachedVMData && !isCacheValid()) {
    clearCache();
  }
  
  try {
    const indexedDBData = await getVMData();
    if (indexedDBData && indexedDBData.length > 0) {
      cachedVMData = indexedDBData;
      cacheTimestamp = Date.now();
      return cachedVMData;
    }
    
    // Load from public JSON file
    const response = await fetch('/vm-inventory.json');
    if (!response.ok) throw new Error('Failed to fetch vm-inventory.json');
    cachedVMData = await response.json();
    cacheTimestamp = Date.now();
  } catch (error) {
    console.error('[v0] Error loading VM data:', error);
    cachedVMData = [];
  }
  
  return cachedVMData;
}

// Get all unique vCenters
export async function getVCenters(): Promise<VCenterStats[]> {
  const data = await getLoadedVMData();
  const vcenterMap: Record<string, VCenterStats> = {};
  
  data.forEach((vm: any) => {
    if (!vcenterMap[vm.vcenter]) {
      const isAccessible = vm.exists !== 'No';
      vcenterMap[vm.vcenter] = {
        vcenter: vm.vcenter,
        site: vm.site,
        vcenter_ip: vm.vcenter_ip,
        vcenter_version: vm.vcenter_version,
        total_vms: 0,
        powered_on: 0,
        powered_off: 0,
        vms: [],
        isAccessible,
        errorMessage: !isAccessible ? extractErrorMessage(vm.notes) : undefined,
      };
    }
    
    // Only count valid VMs (non-empty vm_name) in the statistics
    if (vm.vm_name && vm.vm_name.trim() !== '') {
      vcenterMap[vm.vcenter].total_vms++;
      vcenterMap[vm.vcenter].vms.push(vm);
      
      if (vm.power_state === 'PoweredOn') {
        vcenterMap[vm.vcenter].powered_on++;
      } else if (vm.power_state === 'PoweredOff') {
        vcenterMap[vm.vcenter].powered_off++;
      }
    }
  });
  
  return Object.values(vcenterMap);
}

// Search for single VM
export async function searchVM(vmName: string): Promise<VM | null> {
  const data = await getLoadedVMData();
  const searchLower = vmName.toLowerCase();
  
  // First try exact match (FQDN)
  let vm = data.find((v) => v.vm_name.toLowerCase() === searchLower);
  if (vm) return vm;
  
  // If no exact match, try hostname-only match (part before first dot)
  vm = data.find((v) => {
    const hostname = v.vm_name.split('.')[0].toLowerCase();
    return hostname === searchLower;
  });
  
  return vm || null;
}

// Search for VMs by vCenter
export async function searchByVCenter(vcentername: string): Promise<VCenterStats | null> {
  const vcenters = await getVCenters();
  const searchLower = vcentername.toLowerCase();
  
  // Try exact match first
  let vc = vcenters.find((v) => v.vcenter.toLowerCase() === searchLower);
  
  // If no exact match, try matching by short name (first part before dot)
  if (!vc) {
    vc = vcenters.find((v) => {
      const shortName = v.vcenter.split('.')[0].toLowerCase();
      return shortName === searchLower;
    });
  }
  
  // Return the vCenter even if it has no accessible VMs - let the UI display a "no VMs" message
  if (vc) {
    return vc;
  }
  
  return null;
}

// Search for multiple VMs
export async function searchMultipleVMs(vmNames: string[]): Promise<VM[]> {
  const data = await getLoadedVMData();
  const results: VM[] = [];
  const seen = new Set<string>();

  for (const name of vmNames) {
    if (!name.trim()) continue;

    if (hasWildcards(name)) {
      // Wildcard pattern matching (works on FQDN or hostname)
      const regex = wildcardToRegex(name);
      data.forEach((vm) => {
        const hostname = vm.vm_name.split('.')[0];
        // Match against both FQDN and hostname
        if ((regex.test(vm.vm_name) || regex.test(hostname)) && !seen.has(vm.vm_name)) {
          results.push(vm);
          seen.add(vm.vm_name);
        }
      });
    } else {
      // Try exact match first (FQDN)
      let vm = data.find((v) => v.vm_name.toLowerCase() === name.toLowerCase());
      
      // If no exact match, try hostname-only match
      if (!vm) {
        const searchLower = name.toLowerCase();
        vm = data.find((v) => {
          const hostname = v.vm_name.split('.')[0].toLowerCase();
          return hostname === searchLower;
        });
      }
      
      if (vm && !seen.has(vm.vm_name)) {
        results.push(vm);
        seen.add(vm.vm_name);
      }
    }
  }

  return results;
}

// Convert wildcard pattern to regex (supports * and ?)
function wildcardToRegex(pattern: string): RegExp {
  // Escape special regex characters except * and ?
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*')    // * matches zero or more characters
    .replace(/\?/g, '.');    // ? matches exactly one character
  return new RegExp(`^${escaped}$`, 'i'); // case-insensitive
}

// Check if pattern contains wildcards
function hasWildcards(pattern: string): boolean {
  return pattern.includes('*') || pattern.includes('?');
}

// Get stats across all vCenters
export async function getOverallStats() {
  const vmData = await getLoadedVMData();
  const vcenters = await getVCenters();
  return {
    total_vcenters: vcenters.length,
    total_vms: vmData.length,
    powered_on: vmData.filter((v: any) => v.power_state === 'PoweredOn').length,
    powered_off: vmData.filter((v: any) => v.power_state === 'PoweredOff').length,
    vcenters,
  };
}

// Get trend data (simulate historical data)
export async function getTrendData() {
  const vcenters = await getVCenters();
  const now = new Date();
  const data = [];
  
  // Generate simulated historical data for the last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayData: any = { date: dateStr };
    vcenters.forEach(vc => {
      dayData[vc.vcenter] = vc.total_vms + Math.floor(Math.random() * 3 - 1);
    });
    data.push(dayData);
  }
  
  return data;
}

// Get power state distribution data
export async function getPowerStateDistribution() {
  const vcenters = await getVCenters();
  return vcenters.map(vc => ({
    name: vc.vcenter,
    PoweredOn: vc.powered_on,
    PoweredOff: vc.powered_off,
  }));
}

// Format VMware Tools status from VM data or status string
export function formatToolsStatus(input: VM | string): string {
  // Handle string input (tools_status directly)
  if (typeof input === 'string') {
    const statusMap: Record<string, string> = {
      toolsOk: 'Running',
      toolsRunning: 'Running',
      toolsNotRunning: 'Not Running',
      toolsNotInstalled: 'Not Installed',
      toolsOld: 'Outdated',
    };
    return statusMap[input] || input || 'Unknown';
  }
  
  // Handle VM object input
  const vm = input as VM;
  
  // If we have the pre-formatted vmtools field, use it directly
  if (vm.vmtools) {
    return vm.vmtools;
  }
  
  // If we have the new format with individual fields
  if (vm.tools_running_status) {
    const parts = [vm.tools_running_status];
    if (vm.tools_version) {
      parts.push(`version:${vm.tools_version}`);
    }
    if (vm.tools_version_status) {
      parts.push(`(${vm.tools_version_status})`);
    }
    return parts.join(', ');
  }
  
  // Fallback to legacy format
  const statusMap: Record<string, string> = {
    toolsOk: 'Running',
    toolsRunning: 'Running',
    toolsNotRunning: 'Not Running',
    toolsNotInstalled: 'Not Installed',
    toolsOld: 'Outdated',
  };
  
  return statusMap[vm.tools_status] || vm.tools_status || 'Unknown';
}
