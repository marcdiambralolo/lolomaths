'use client';

import { CompetitionInfo, TournamentRecord } from '@/lib/interfaces';
import { useMemo } from 'react';
import useCompetitionStorage from './useCompetitionStorage';
import { useCompetitionStore } from '@/lib/store/useCompetitionStore';
import { useHistoryStore } from '@/lib/store/useHistoryStore';

function toTimestamp(value: string | null | undefined): number {
  if (!value) return 0;
  const ts = new Date(value).getTime();
  return Number.isNaN(ts) ? 0 : ts;
}

function mapTournamentToCompetitionInfo(
  tournament: TournamentRecord,
  isValidated: boolean
): CompetitionInfo {
  const datedebut = tournament.datedebut ?? new Date().toISOString();
  const datefin = tournament.datefin ?? datedebut;

  return {
    id: tournament.id,
    idConfig: tournament.idConfig ?? '',
    displayName: `N°: ${tournament.id.slice(-12)}`,
    name: tournament.nomjoueur,
    datedebut,
    datefin,
    score: tournament.score,
    matchesCount: tournament.matchs.length,
    completedMatches: tournament.matchs.filter((m) => m.isGameOver).length,
    isValidated,
    timeSpent:0,
    matchInfo: tournament.matchs.map((m) => ({
      id: m.id,
      isGameOver: m.isGameOver, 
    })),
  };
}

/**
 * Récupère la liste des compétitions filtrées par la configuration active,
 * enrichies du statut `isValidated`, triées (validées en premier, puis date décroissante).
 */
const useCompetitionList = (): CompetitionInfo[] => {
  const competitions = useCompetitionStore((s) => s.competitions);
  const gameConfigId = useCompetitionStore(
    (s) => s.gameConfig?.id ?? s.gameConfig?._id ?? null
  );
  const localTournaments = useHistoryStore((s) => s.tournaments);
  const { refreshKey, isCompetitionValidated } = useCompetitionStorage();

  return useMemo(() => {
    const filteredRemote = (competitions ?? []).filter((comp) =>
      gameConfigId ? comp.idConfig === gameConfigId : true
    );

    const remoteIds = new Set(filteredRemote.map((c) => c.id));

    const extraLocal = (localTournaments ?? [])
      .filter((t) => {
        if (remoteIds.has(t.id)) return false;
        if (!gameConfigId) return true;
        return !t.idConfig || t.idConfig === gameConfigId;
      })
      .map((t) =>
        mapTournamentToCompetitionInfo(t, isCompetitionValidated(t.id))
      );

    const combined = [
      ...filteredRemote.map((comp) => ({
        ...comp,
        displayName: comp.displayName ?? `N°: ${comp.id.slice(-12)}`,
        isValidated: isCompetitionValidated(comp.id),
      })),
      ...extraLocal,
    ];

    return combined.sort((a, b) => {
      if (a.isValidated !== b.isValidated) {
        return a.isValidated ? -1 : 1;
      }
      return toTimestamp(b.datedebut) - toTimestamp(a.datedebut);
    });
  }, [
    competitions,
    gameConfigId,
    localTournaments,
    refreshKey,
    isCompetitionValidated,
  ]);
};

export default useCompetitionList;