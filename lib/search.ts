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
  collection_time: string;
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

// Filter for ESXi 7.0+ (vCenter 7.0+)
function isESXi7Plus(vm: any): boolean {
  const vcenterVersion = vm.vcenter_version || '';
  const majorVersion = parseInt(vcenterVersion.split('.')[0], 10);
  return majorVersion >= 7;
}

// Load VM data from IndexedDB or public folder
async function getLoadedVMData(): Promise<any[]> {
  if (cachedVMData) return cachedVMData;
  
  try {
    const indexedDBData = await getVMData();
    if (indexedDBData && indexedDBData.length > 0) {
      cachedVMData = indexedDBData;
      return cachedVMData;
    }
    
    // Fallback to public JSON file
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
export async function getVCenters(esxi7Plus: boolean = false): Promise<VCenterStats[]> {
  const data = await getLoadedVMData();
  const filteredData = esxi7Plus ? data.filter(isESXi7Plus) : data;
  const vcenterMap: Record<string, VCenterStats> = {};
  
  filteredData.forEach((vm: any) => {
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
    
    vcenterMap[vm.vcenter].total_vms++;
    vcenterMap[vm.vcenter].vms.push(vm);
    
    if (vm.power_state === 'PoweredOn') {
      vcenterMap[vm.vcenter].powered_on++;
    } else if (vm.power_state === 'PoweredOff') {
      vcenterMap[vm.vcenter].powered_off++;
    }
  });
  
  return Object.values(vcenterMap);
}

// Search for single VM
export async function searchVM(vmName: string, esxi7Plus: boolean = false): Promise<VM | null> {
  const data = await getLoadedVMData();
  const vm = data.find((v) => 
    v.vm_name.toLowerCase() === vmName.toLowerCase() &&
    (!esxi7Plus || isESXi7Plus(v))
  );
  return vm || null;
}

// Search for VMs by vCenter
export async function searchByVCenter(vcentername: string, esxi7Plus: boolean = false): Promise<VCenterStats | null> {
  const data = await getLoadedVMData();
  const vcenters = await getVCenters();
  const vc = vcenters.find((v) => v.vcenter.toLowerCase() === vcentername.toLowerCase());
  
  if (vc) {
    if (esxi7Plus) {
      // Filter VMs to only ESXi 7.0+
      const filteredVMs = vc.vms.filter(isESXi7Plus);
      const powered_on = filteredVMs.filter((v) => v.power_state === 'PoweredOn').length;
      const powered_off = filteredVMs.filter((v) => v.power_state === 'PoweredOff').length;
      return {
        ...vc,
        vms: filteredVMs,
        total_vms: filteredVMs.length,
        powered_on,
        powered_off,
      };
    }
    return vc;
  }
  
  return null;
}

// Search for multiple VMs
export async function searchMultipleVMs(vmNames: string[], esxi7Plus: boolean = false): Promise<VM[]> {
  const data = await getLoadedVMData();
  return vmNames
    .map((name) => data.find((v) => v.vm_name.toLowerCase() === name.toLowerCase()))
    .filter((v) => v !== undefined && (!esxi7Plus || isESXi7Plus(v))) as VM[];
}

// Get stats across all vCenters
export async function getOverallStats(esxi7Plus: boolean = false) {
  const vmData = await getLoadedVMData();
  const vcenters = await getVCenters(esxi7Plus);
  const filteredVMs = esxi7Plus ? vmData.filter(isESXi7Plus) : vmData;
  return {
    total_vcenters: vcenters.length,
    total_vms: filteredVMs.length,
    powered_on: filteredVMs.filter((v: any) => v.power_state === 'PoweredOn').length,
    powered_off: filteredVMs.filter((v: any) => v.power_state === 'PoweredOff').length,
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
