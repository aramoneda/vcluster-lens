'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Summary } from '@/components/summary';
import { AnalyticsDrilldown } from '@/components/analytics-drilldown';
import { SingleVMSearch } from '@/components/single-vm-search';
import { VCenterSearch } from '@/components/vcenter-search';
import { MultiVMSearch } from '@/components/multi-vm-search';

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('auth_token');
    const email = localStorage.getItem('user_email');

    if (!token || !email) {
      // Not authenticated, redirect to login
      router.push('/login');
      return;
    }

    setUserEmail(email);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    router.push('/login');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 to-blue-900 border-b border-blue-800 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white">ICS SRE vCenter Dashboard</h1>
              <p className="text-blue-200 mt-2">VM Search & Resource Analytics</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-blue-100 text-sm">Logged in as:</p>
                <p className="text-white font-semibold">{userEmail}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Auth Info Banner */}
      <div className="bg-blue-900 border-b border-blue-800 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="flex-1">
            <p className="text-blue-100 text-sm">
              <span className="font-semibold">Authentication enabled:</span> This dashboard requires individual user login. Each session is secure and isolated.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <section className="mb-8">
          <Summary />
        </section>

        {/* Analytics Drill-Down */}
        <section className="mb-8">
          <AnalyticsDrilldown />
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
    </main>
  );
}
