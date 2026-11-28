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

function toFiniteScore(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
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
  const score = toFiniteScore(tournament.score, 0);

  return {
    id: safeId,
    idConfig: tournament.idConfig ?? '',
    displayName: `N°: ${safeId.slice(-12)}`,
    name: tournament.nomjoueur ?? '',
    nomjoueur: tournament.nomjoueur ?? '',
    numtournoi: tournament.numtournoi ?? '',
    niveau: tournament.niveau,
    couleurs: tournament.couleurs,
    nombredejeu: tournament.nombredejeu,
    nbmatch: tournament.nbmatch,
    tempsmatch: tournament.tempsmatch,
    tpsglobal: tournament.tpsglobal,
    datedebut,
    datefin,
    score,
    totalScore: score,
    isgameover: Boolean(tournament.isGameOver ?? tournament.isgameover),
    matchesCount: safeMatchs.length,
    completedMatches: safeMatchs.filter((m) => Boolean(m.isGameOver)).length,
    isValidated,
    timeSpent: computeElapsedSeconds(datedebut, datefin),
    matchInfo: safeMatchs.map((m, idx) => ({
      id: m.id,
      tournamentId: safeId,
      matchNumber: toFiniteScore(m.numordrep, idx + 1),
      isGameOver: Boolean(m.isGameOver),
      isgameover: Boolean(m.isGameOver),
      score: toFiniteScore(m.score, 0),
      numeromatch: m.numeromatch ?? '',
      datedebut: m.datedebut ?? null,
      datefin: m.datefin ?? null,
      jeux: Array.isArray(m.jeux) ? m.jeux : [],
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

    const localById = new Map<string, TournamentRecord>();
    for (const t of safeLocal) {
      if (t?.id) localById.set(t.id, t);
    }

    const filteredRemote = safeRemote.filter((comp) => {
      if (!gameConfigId) return true;
      return !comp.idConfig || comp.idConfig === gameConfigId;
    });

    const remoteIds = new Set(filteredRemote.map((c) => c.id));

    const enrichedRemote: CompetitionInfo[] = filteredRemote.map((comp) => {
      const localMatch = localById.get(comp.id);
      const localScore = localMatch
        ? toFiniteScore(localMatch.score, 0)
        : undefined;
      const remoteScore = toFiniteScore(comp.score ?? comp.totalScore, 0);
      const mergedScore =
        localScore !== undefined && (localScore > 0 || remoteScore === 0)
          ? localScore
          : remoteScore;

      const hasRemoteMatchInfo =
        Array.isArray(comp.matchInfo) && comp.matchInfo.length > 0;
      const mergedMatchInfo = hasRemoteMatchInfo
        ? comp.matchInfo
        : localMatch && Array.isArray(localMatch.matchs)
          ? localMatch.matchs.map((m, idx) => ({
              id: m.id,
              tournamentId: comp.id,
              matchNumber: toFiniteScore(m.numordrep, idx + 1),
              isGameOver: Boolean(m.isGameOver),
              isgameover: Boolean(m.isGameOver),
              score: toFiniteScore(m.score, 0),
              numeromatch: m.numeromatch ?? '',
              datedebut: m.datedebut ?? null,
              datefin: m.datefin ?? null,
              jeux: Array.isArray(m.jeux) ? m.jeux : [],
            }))
          : [];

      return {
        ...comp,
        displayName:
          comp.displayName ?? `N°: ${String(comp.id ?? '').slice(-12)}`,
        score: mergedScore,
        totalScore: mergedScore,
        matchInfo: mergedMatchInfo,
        isValidated: isCompetitionValidated(comp.id),
      };
    });

    const extraLocal = safeLocal
      .filter((t) => {
        if (!t?.id || remoteIds.has(t.id)) return false;
        if (!gameConfigId) return true;
        return !t.idConfig || t.idConfig === gameConfigId;
      })
      .map((t) =>
        mapTournamentToCompetitionInfo(t, isCompetitionValidated(t.id))
      );

    const combined: CompetitionInfo[] = [...enrichedRemote, ...extraLocal];

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