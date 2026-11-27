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

function computeElapsedSeconds(
  startIso: string | null | undefined,
  endIso: string | null | undefined
): number {
  const start = toTimestamp(startIso);
  const end = toTimestamp(endIso);
  if (start <= 0 || end <= 0 || end < start) return 0;
  return Math.floor((end - start) / 1000);
}

function mapTournamentToCompetitionInfo(
  tournament: TournamentRecord,
  isValidated: boolean
): CompetitionInfo {
  const safeMatchs = Array.isArray(tournament.matchs) ? tournament.matchs : [];
  const datedebut = tournament.datedebut ?? new Date().toISOString();
  const datefin = tournament.datefin ?? datedebut;
  const safeId = String(tournament.id ?? '');

  return {
    id: safeId,
    idConfig: tournament.idConfig ?? '',
    displayName: `N°: ${safeId.slice(-12)}`,
    name: tournament.nomjoueur ?? '',
    datedebut,
    datefin,
    score: typeof tournament.score === 'number' ? tournament.score : 0,
    matchesCount: safeMatchs.length,
    completedMatches: safeMatchs.filter((m) => Boolean(m.isGameOver)).length,
    isValidated,
    timeSpent: computeElapsedSeconds(datedebut, datefin),
    matchInfo: safeMatchs.map((m) => ({
      id: m.id,
      isGameOver: Boolean(m.isGameOver),
      isgameover: Boolean(m.isGameOver),
      score: typeof m.score === 'number' ? m.score : 0,
      numeromatch: m.numeromatch ?? '',
      datedebut: m.datedebut ?? null,
      datefin: m.datefin ?? null,
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
    const safeRemote = Array.isArray(competitions) ? competitions : [];
    const safeLocal = Array.isArray(localTournaments) ? localTournaments : [];

    const filteredRemote = safeRemote.filter((comp) => {
      if (!gameConfigId) return true;
      return !comp.idConfig || comp.idConfig === gameConfigId;
    });

    const remoteIds = new Set(filteredRemote.map((c) => c.id));

    const extraLocal = safeLocal
      .filter((t) => {
        if (!t?.id || remoteIds.has(t.id)) return false;
        if (!gameConfigId) return true;
        return !t.idConfig || t.idConfig === gameConfigId;
      })
      .map((t) =>
        mapTournamentToCompetitionInfo(t, isCompetitionValidated(t.id))
      );

    const combined: CompetitionInfo[] = [
      ...filteredRemote.map((comp) => ({
        ...comp,
        displayName:
          comp.displayName ?? `N°: ${String(comp.id ?? '').slice(-12)}`,
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