'use client';

import { CompetitionInfo } from '@/lib/interfaces';
import { useMemo } from 'react';
import useCompetitionStorage from './useCompetitionStorage';
import { useCompetitionStore } from '@/lib/store/useCompetitionStore';

/**
 * Récupère la liste des compétitions filtrées par `gameConfig.id`,
 * enrichies du statut `isValidated`, triées (validées en premier, puis par date décroissante).
 */
const useCompetitionList = (): CompetitionInfo[] => {
  const competitions = useCompetitionStore((s) => s.competitions);
  const gameConfigId = useCompetitionStore((s) => s.gameConfig?.id);
  const { refreshKey, isCompetitionValidated } = useCompetitionStorage();

  return useMemo(() => {
    return competitions
      .filter((comp) => comp.idConfig === gameConfigId)
      .map((comp) => ({
        ...comp,
        displayName: `N°: ${comp.id.slice(-12)}`,
        isValidated: isCompetitionValidated(comp.id),
      }))
      .sort((a, b) => {
        if (a.isValidated !== b.isValidated) {
          return a.isValidated ? -1 : 1;
        }
        return (
          new Date(b.datedebut).getTime() -
          new Date(a.datedebut).getTime()
        );
      });
  }, [
    competitions,
    gameConfigId,
    refreshKey,
    isCompetitionValidated,
  ]);
};

export default useCompetitionList;