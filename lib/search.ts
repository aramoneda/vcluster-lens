import vmData from './vm-inventory.json';

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

// Get all unique vCenters
export function getVCenters(): VCenterStats[] {
  const vcenters = new Map<string, VCenterStats>();
  
  vmData.forEach((vm: any) => {
    if (!vcenters.has(vm.vcenter)) {
      vcenters.set(vm.vcenter, {
        vcenter: vm.vcenter,
        site: vm.site,
        vcenter_ip: vm.vcenter_ip,
        vcenter_version: vm.vcenter_version,
        total_vms: 0,
        powered_on: 0,
        powered_off: 0,
        vms: [],
      });
    }
    
    const vcenterData = vcenters.get(vm.vcenter)!;
    vcenterData.total_vms++;
    if (vm.power_state === 'PoweredOn') {
      vcenterData.powered_on++;
    } else {
      vcenterData.powered_off++;
    }
    vcenterData.vms.push(vm as VM);
  });
  
  return Array.from(vcenters.values()).sort((a, b) => a.vcenter.localeCompare(b.vcenter));
}

// Search for single VM
export function searchVM(vmName: string): VM | null {
  const normalizedName = vmName.toLowerCase().trim();
  const vm = vmData.find((v: any) => v.vm_name.toLowerCase() === normalizedName);
  return vm || null;
}

// Search for VMs by vCenter
export function searchByVCenter(vcentername: string): VCenterStats | null {
  const normalized = vcentername.toLowerCase().trim();
  const vcenter = getVCenters().find(v => v.vcenter.toLowerCase() === normalized);
  return vcenter || null;
}

// Search for multiple VMs
export function searchMultipleVMs(vmNames: string[]): VM[] {
  const normalizedNames = vmNames.map(n => n.toLowerCase().trim()).filter(n => n);
  const results: VM[] = [];
  
  normalizedNames.forEach(name => {
    const vm = vmData.find((v: any) => v.vm_name.toLowerCase() === name);
    if (vm) {
      results.push(vm as VM);
    }
  });
  
  return results;
}

// Get stats across all vCenters
export function getOverallStats() {
  const vcenters = getVCenters();
  return {
    total_vcenters: vcenters.length,
    total_vms: vmData.length,
    powered_on: vmData.filter((v: any) => v.power_state === 'PoweredOn').length,
    powered_off: vmData.filter((v: any) => v.power_state === 'PoweredOff').length,
    vcenters,
  };
}

// Get trend data (simulate historical data)
export function getTrendData() {
  const vcenters = getVCenters();
  const now = new Date();
  const data = [];
  
  // Generate simulated historical data for the last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayData: any = { date: dateStr };
    vcenters.forEach(vc => {
      dayData[vc.vcenter] = vc.total_vms + Math.floor(Math.random() * 3 - 1); // Simulate slight variations
    });
    data.push(dayData);
  }
  
  return data;
}

// Get power state distribution data
export function getPowerStateDistribution() {
  const vcenters = getVCenters();
  return vcenters.map(vc => ({
    name: vc.vcenter,
    PoweredOn: vc.powered_on,
    PoweredOff: vc.powered_off,
  }));
}
