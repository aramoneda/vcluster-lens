'use client';

import { useState, useEffect, ReactNode } from 'react';

interface PasswordProtectionProps {
  children: ReactNode;
}

const DASHBOARD_PASSWORD = process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD || '!CSsr3domestic';

export function PasswordProtection({ children }: PasswordProtectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if already authenticated in session
    const isAuth = sessionStorage.getItem('dashboard_authenticated') === 'true';
    if (isAuth) {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === DASHBOARD_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
      sessionStorage.setItem('dashboard_authenticated', 'true');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  if (!mounted) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-slate-900 rounded-lg shadow-2xl border border-blue-800 p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">ICS SRE vCenter</h1>
              <p className="text-blue-300">Dashboard</p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-blue-300 mb-2">
                  Enter Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-800 border border-blue-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  autoFocus
                />
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Access Dashboard
              </button>
            </form>

            <p className="text-center text-slate-400 text-xs mt-6">
              This dashboard is for authorized Broadridge personnel only.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
