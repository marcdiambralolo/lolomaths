'use client';

import { useCallback, useState } from 'react';

// Clé unique globale alignée avec les autres hooks
const ACTIVE_VALIDATED_GAME_KEY = 'active_validated_competition_id';

const isCompetitionValidated = (competitionId: string): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(ACTIVE_VALIDATED_GAME_KEY) === competitionId;
};

const useCompetitionStorage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const updateLocalCache = useCallback((competitionId: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACTIVE_VALIDATED_GAME_KEY, competitionId);
    setRefreshKey((prev) => prev + 1);
  }, []);

  const isCompetitionValidatedMemo = useCallback(
    (competitionId: string) => isCompetitionValidated(competitionId),
    []
  );

  return {
    refreshKey,
    updateLocalCache,
    isCompetitionValidated: isCompetitionValidatedMemo,
  };
};

export default useCompetitionStorage;