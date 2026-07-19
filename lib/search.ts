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
}

// Cached data
let cachedVMData: any[] | null = null;
let cachedVCenters: VCenterStats[] | null = null;

// Load VM data from IndexedDB or JSON file
async function getLoadedVMData(): Promise<any[]> {
  if (cachedVMData) return cachedVMData;
  
  try {
    const indexedDBData = await getVMData();
    if (indexedDBData && indexedDBData.length > 0) {
      cachedVMData = indexedDBData;
      return cachedVMData;
    }
    
    // Load from public JSON file
    const response = await fetch('/vm-inventory.json');
    if (!response.ok) throw new Error('Failed to fetch vm-inventory.json');
    cachedVMData = await response.json();
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
      vcenterMap[vm.vcenter] = {
        vcenter: vm.vcenter,
        site: vm.site,
        vcenter_ip: vm.vcenter_ip,
        vcenter_version: vm.vcenter_version,
        total_vms: 0,
        powered_on: 0,
        powered_off: 0,
        vms: [],
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
  const vm = data.find((v) => v.vm_name.toLowerCase() === vmName.toLowerCase());
  return vm || null;
}

// Search for VMs by vCenter
export async function searchByVCenter(vcentername: string): Promise<VCenterStats | null> {
  const vcenters = await getVCenters();
  const vc = vcenters.find((v) => v.vcenter.toLowerCase() === vcentername.toLowerCase());
  
  // Return the vCenter even if it has no accessible VMs - let the UI display a "no VMs" message
  if (vc) {
    return vc;
  }
  
  return null;
}

// Search for multiple VMs
export async function searchMultipleVMs(vmNames: string[]): Promise<VM[]> {
  const data = await getLoadedVMData();
  return vmNames
    .map((name) => data.find((v) => v.vm_name.toLowerCase() === name.toLowerCase()))
    .filter((v) => v !== undefined) as VM[];
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

// Clear cached data
export function clearCache() {
  cachedVMData = null;
  cachedVCenters = null;
}

// Format VMware Tools status from VM data
export function formatToolsStatus(vm: VM): string {
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
