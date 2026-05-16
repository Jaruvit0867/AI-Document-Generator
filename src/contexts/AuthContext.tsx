'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getToken, setToken, clearToken } from '@/lib/auth';
import api from '@/lib/api';

interface User {
  id: number;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (isAuthenticated()) {
          // Optionally fetch user data from API
          // For now, we'll just set a basic user object
          const token = getToken();
          if (token) {
            // You could decode the JWT to get user info
            // For simplicity, we'll just mark as authenticated
            setUser({ id: 0, email: '' });
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        clearToken();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.auth.login({ email, password });
      setToken(response.access_token);
      setUser({ id: 0, email }); // Set basic user info
      router.push('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      await api.auth.register({ email, password });
      // Auto-login after registration
      await login(email, password);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    clearToken();
    setUser(null);
    router.push('/auth/login');
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Made with Bob
