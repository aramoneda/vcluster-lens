'use client';

import { useAuth } from '@/lib/auth-context';
import LoginPage from './login-page';
import { ReactNode } from 'react';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <>{children}</>;
}
