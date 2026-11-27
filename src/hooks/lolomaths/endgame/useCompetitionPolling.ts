'use client';

import { useCallback, useEffect, useRef } from 'react';

// Clé unique globale alignée avec les autres hooks
const ACTIVE_VALIDATED_GAME_KEY = 'active_validated_competition_id';
const REFETCH_INTERVAL = 10000;
const DEBOUNCE_DELAY = 150;

const useCompetitionPolling = (onRefresh: () => void) => {
  const onRefreshRef = useRef(onRefresh);
  const isRefreshingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  const refreshData = useCallback(() => {
    if (isRefreshingRef.current) return;
    isRefreshingRef.current = true;

    try {
      if (typeof onRefreshRef.current === 'function') {
        onRefreshRef.current();
      }
    } finally {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        isRefreshingRef.current = false;
        timeoutRef.current = null;
      }, DEBOUNCE_DELAY);
    }
  }, []);

  // ----- Polling -----
  useEffect(() => {
    const intervalId = setInterval(refreshData, REFETCH_INTERVAL);
    return () => {
      clearInterval(intervalId);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [refreshData]);

  // ----- Sync multi-onglets -----
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === ACTIVE_VALIDATED_GAME_KEY || e.key === null) {
        refreshData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshData]);

  return { refreshData };
};

export default useCompetitionPolling;