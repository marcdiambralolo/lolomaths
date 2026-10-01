'use client';
import { config } from '@/lib/config';
import { useAuth } from '@/lib/hooks';
import { dispatchLoginNavigation } from '@/lib/navigation/clientNavigation';
import { AnimatePresence } from 'framer-motion';
import React, { memo, useEffect, useMemo } from 'react';
import CosmicLoader from './components/CosmicLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

function ProtectedRouteComponent({
  children,
  redirectTo = config.routes.login,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  const loginUrl = useMemo(() => {
    if (typeof window === 'undefined') return redirectTo;
    const currentUrl = window.location.pathname + window.location.search;
    return `${redirectTo}?returnTo=${encodeURIComponent(currentUrl)}`;
  }, [redirectTo]);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      const [, query = ''] = loginUrl.split('?');
      const params = new URLSearchParams(query);
      dispatchLoginNavigation(params.get('returnTo') || undefined);
    }
  }, [isAuthenticated, isLoading, loginUrl]);

  if (isLoading) {
    return (
      <AnimatePresence mode="wait">
        <CosmicLoader />
      </AnimatePresence>
    );
  }

  if (!isAuthenticated) { return null; }

  return <>{children}</>;
}

export const ProtectedRoute = memo(ProtectedRouteComponent, (prev, next) => {
  return prev.redirectTo === next.redirectTo;
});

export default ProtectedRoute; 