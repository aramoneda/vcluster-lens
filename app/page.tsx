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
}
