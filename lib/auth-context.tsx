'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated in session storage
    const stored = sessionStorage.getItem('vcenter-dashboard-auth');
    if (stored === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (password: string): boolean => {
    let correctPassword = process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD || '';
    // Remove surrounding quotes if present (environment variables sometimes include quotes)
    if ((correctPassword.startsWith("'") && correctPassword.endsWith("'")) ||
        (correctPassword.startsWith('"') && correctPassword.endsWith('"'))) {
      correctPassword = correctPassword.slice(1, -1);
    }
    if (password === correctPassword) {
      sessionStorage.setItem('vcenter-dashboard-auth', 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem('vcenter-dashboard-auth');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
