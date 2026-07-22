'use client';

import { useAuth } from '@/lib/auth-context';
import LoginPage from './login-page';
import { ReactNode, useEffect, useState } from 'react';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // During initial render on server, render children to avoid hydration mismatch
  // Client-side useEffect will handle showing login when needed
  if (!isMounted) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <>{children}</>;
}
