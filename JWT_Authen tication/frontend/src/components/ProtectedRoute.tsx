'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackUrl?: string;
}

/**
 * Universal Route Guard Component
 * 
 * Wrap any component/page with <ProtectedRoute> to enforce authentication.
 * If unauthenticated, gracefully redirects to /login.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallbackUrl = '/login',
}) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(fallbackUrl);
    }
  }, [user, isLoading, router, fallbackUrl]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-sm font-medium text-slate-400">
          Verifying security session...
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};
