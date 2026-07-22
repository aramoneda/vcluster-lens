'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate slight delay for better UX
    setTimeout(() => {
      if (login(password)) {
        setPassword('');
        setIsLoading(false);
      } else {
        setError('Invalid password. Please try again.');
        setPassword('');
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl p-8">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">ICS SRE vCenter</h1>
            <p className="text-slate-400 text-sm">Dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Enter Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3">
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Access Dashboard'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-xs text-slate-500 text-center">
              This dashboard is for authorized Broadridge personnel only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
