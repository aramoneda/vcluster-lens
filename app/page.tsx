'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Already logged in, redirect to dashboard
      router.push('/dashboard');
    } else {
      // Not logged in, redirect to login
      router.push('/login');
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-white">Redirecting...</div>
    </main>
  );

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
