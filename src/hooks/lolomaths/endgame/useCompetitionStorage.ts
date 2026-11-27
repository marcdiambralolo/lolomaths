'use client';

import { useCallback, useEffect, useState } from 'react';

// Clé unique globale alignée avec les autres hooks
const ACTIVE_VALIDATED_GAME_KEY = 'active_validated_competition_id';
const VALIDATION_SYNC_EVENT = 'lolomaths:active-validated-competition-change';

const readValidatedCompetitionId = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(ACTIVE_VALIDATED_GAME_KEY);
  } catch {
    return null;
  }
};

const isCompetitionValidated = (competitionId: string): boolean => {
  if (!competitionId) return false;
  return readValidatedCompetitionId() === competitionId;
};

const notifySameTabValidationChange = (): void => {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new Event(VALIDATION_SYNC_EVENT));
  } catch {
    // Ignore si CustomEvent/Event est indisponible
  }
};

const useCompetitionStorage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorage = (event: StorageEvent) => {
      if (event.key === ACTIVE_VALIDATED_GAME_KEY || event.key === null) {
        setRefreshKey((prev) => prev + 1);
      }
    };

    const handleSameTabChange = () => {
      setRefreshKey((prev) => prev + 1);
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(VALIDATION_SYNC_EVENT, handleSameTabChange);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(VALIDATION_SYNC_EVENT, handleSameTabChange);
    };
  }, []);

  const updateLocalCache = useCallback((competitionId: string) => {
    if (typeof window === 'undefined' || !competitionId) return;
    try {
      window.localStorage.setItem(ACTIVE_VALIDATED_GAME_KEY, competitionId);
    } catch {
      // Ignore les erreurs d'accès localStorage (ex. quota dépassé)
    }
    setRefreshKey((prev) => prev + 1);
    notifySameTabValidationChange();
  }, []);

  const clearLocalCache = useCallback((competitionId?: string) => {
    if (typeof window === 'undefined') return;
    let shouldNotify = false;
    try {
      const current = window.localStorage.getItem(ACTIVE_VALIDATED_GAME_KEY);
      if (!competitionId || current === competitionId) {
        window.localStorage.removeItem(ACTIVE_VALIDATED_GAME_KEY);
        shouldNotify = true;
      }
    } catch {
      shouldNotify = true;
    }

    if (shouldNotify) {
      setRefreshKey((prev) => prev + 1);
      notifySameTabValidationChange();
    }
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