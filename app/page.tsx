import { Summary } from '@/components/summary';
import { SingleVMSearch } from '@/components/single-vm-search';
import { VCenterSearch } from '@/components/vcenter-search';
import { MultiVMSearch } from '@/components/multi-vm-search';
import { Trends } from '@/components/trends';
import { JSONUpload } from '@/components/json-upload';

export const metadata = {
  title: 'VM Monitoring Dashboard',
  description: 'Search and monitor virtual machines across multiple vCenters',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">VM Monitoring Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Search and manage virtual machines across your vCenter infrastructure</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Section */}
        <section className="mb-12">
          <JSONUpload />
        </section>

        {/* Summary Section */}
        <section className="mb-12 pt-8 border-t border-gray-200 dark:border-slate-800">
          <Summary />
        </section>

        {/* Search Sections */}
        <section className="space-y-12">
          <div id="single-vm">
            <SingleVMSearch />
          </div>

          <div id="vcenter-search" className="pt-8 border-t border-gray-200 dark:border-slate-800">
            <VCenterSearch />
          </div>

          <div id="multi-vm" className="pt-8 border-t border-gray-200 dark:border-slate-800">
            <MultiVMSearch />
          </div>
        </section>

        {/* Trends Section */}
        <section className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-800">
          <Trends />
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            VM Inventory Dashboard • Last Updated: {new Date().toLocaleString()}
          </p>
        </div>
      </footer>
    </main>
  );
}
