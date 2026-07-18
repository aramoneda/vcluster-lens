import { Summary } from '@/components/summary';
import { SingleVMSearch } from '@/components/single-vm-search';
import { VCenterSearch } from '@/components/vcenter-search';
import { MultiVMSearch } from '@/components/multi-vm-search';

export const metadata = {
  title: 'vCenter Dashboard',
  description: 'Search and discover virtual machines across your vCenter infrastructure',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 to-blue-900 border-b border-blue-800 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>
            <h1 className="text-4xl font-bold text-white">vCenter Dashboard</h1>
            <p className="text-blue-200 mt-2">Virtual Machine Search & Discovery</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <section className="mb-8">
          <Summary />
        </section>

        {/* Search Sections */}
        <section className="space-y-12">
          <div id="single-vm">
            <SingleVMSearch />
          </div>

          <div id="vcenter-search" className="pt-8 border-t border-slate-700">
            <VCenterSearch />
          </div>

          <div id="multi-vm" className="pt-8 border-t border-slate-700">
            <MultiVMSearch />
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-slate-400 text-sm">
            vCenter Dashboard • Last Updated: {new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}
          </p>
        </div>
      </footer>
    </main>
  );
}
