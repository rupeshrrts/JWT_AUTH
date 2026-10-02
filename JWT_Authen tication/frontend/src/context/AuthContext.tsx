'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, LoginCredentials, RegisterCredentials } from '@/types/auth';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      const response = await authService.getMe();
      if (response.success && response.user) {
        setUser(response.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (credentials: LoginCredentials) => {
    const res = await authService.login(credentials);
    if (res.success && res.user) {
      setUser(res.user);
      router.push('/dashboard');
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    const res = await authService.register(credentials);
    if (res.success) {
      // Auto-login after registration or redirect to login
      router.push('/login');
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
