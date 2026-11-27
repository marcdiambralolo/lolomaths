'use client';

import { useCallback, useEffect, useState } from 'react';

// Clé unique globale alignée avec les autres hooks
const ACTIVE_VALIDATED_GAME_KEY = 'active_validated_competition_id';

const readValidatedCompetitionId = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(ACTIVE_VALIDATED_GAME_KEY);
  } catch {
    return null;
  }
};

const isCompetitionValidated = (competitionId: string): boolean => {
  if (!competitionId) return false;
  return readValidatedCompetitionId() === competitionId;
};

const useCompetitionStorage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorage = (event: StorageEvent) => {
      if (event.key === ACTIVE_VALIDATED_GAME_KEY) {
        setRefreshKey((prev) => prev + 1);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const updateLocalCache = useCallback((competitionId: string) => {
    if (typeof window === 'undefined' || !competitionId) return;
    try {
      localStorage.setItem(ACTIVE_VALIDATED_GAME_KEY, competitionId);
    } catch {
      // Ignore les erreurs d'accès localStorage (ex. quota dépassé)
    }
    setRefreshKey((prev) => prev + 1);
  }, []);

  const clearLocalCache = useCallback((competitionId?: string) => {
    if (typeof window === 'undefined') return;
    try {
      const current = localStorage.getItem(ACTIVE_VALIDATED_GAME_KEY);
      if (!competitionId || current === competitionId) {
        localStorage.removeItem(ACTIVE_VALIDATED_GAME_KEY);
      }
    } catch {
      // Ignore les erreurs d'accès localStorage
    }
    setRefreshKey((prev) => prev + 1);
  }, []);

  const isCompetitionValidatedMemo = useCallback(
    (competitionId: string) => isCompetitionValidated(competitionId),
    []
  );

  return {
    refreshKey,
    updateLocalCache,
    clearLocalCache,
    isCompetitionValidated: isCompetitionValidatedMemo,
  };
};

export default useCompetitionStorage;