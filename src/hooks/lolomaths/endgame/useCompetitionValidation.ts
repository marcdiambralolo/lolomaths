'use client';

import { api } from '@/lib/api/client';
import { CompetitionInfo, GameResult, MatchRecord } from '@/lib/interfaces';
import {
  calculateDuration,
  calculateDurationInSeconds,
  formatCompetitionDate,
} from '@/lib/learning/functions';
import { LearningStatsPayload } from '@/lib/learning/interface';
import { useCompetitionStore } from '@/lib/store/useCompetitionStore';
import { useHistoryStore } from '@/lib/store/useHistoryStore';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useCompetitionStorage from './useCompetitionStorage';
import { useMessage } from './useMessage';

// ============================================================
// CONSTANTES
// ============================================================

const PERMANENT_MESSAGE_DURATION = 10_000;

/**
 * Clé localStorage **globale** : un seul jeu validé à la fois.
 * Doit être strictement identique à celle de `useCompetitionStorage`.
 */
const ACTIVE_VALIDATED_GAME_KEY = 'active_validated_competition_id';

// ============================================================
// TYPES
// ============================================================

interface ValidationMessage {
  text: string;
  type: 'success' | 'error';
}

interface CompetitionStats {
  totalScore: number;
  totalMatches: number;
  completedMatches: number;
  averageScore: number;
  totalTimeSeconds: number;
}

interface NormalizedMatch {
  matchNumber: number;
  numeromatch: string;
  score: number;
  timeSpent: number;
  isgameover: boolean;
  datedebut: string | null;
}

// ============================================================
// HELPERS
// ============================================================

function toSafeNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function resolveMatches(
  competition: CompetitionInfo,
  localMatchs: MatchRecord[] | undefined
): NormalizedMatch[] {
  if (Array.isArray(competition.matchInfo) && competition.matchInfo.length > 0) {
    return competition.matchInfo.map((m, idx) => {
      const legacyFlag = (m as { isGameOver?: boolean }).isGameOver;
      return {
        matchNumber: toSafeNumber(m.matchNumber, idx + 1),
        numeromatch: m.numeromatch ?? String(idx + 1),
        score: toSafeNumber(m.score, 0),
        timeSpent: toSafeNumber(m.timeSpent, 0),
        isgameover: Boolean(m.isgameover ?? legacyFlag),
        datedebut: m.datedebut ?? null,
      };
    });
  }

  if (Array.isArray(localMatchs) && localMatchs.length > 0) {
    return localMatchs.map((m, idx) => ({
      matchNumber: toSafeNumber(m.numordrep, idx + 1),
      numeromatch: m.numeromatch ?? String(idx + 1),
      score: toSafeNumber(m.score, 0),
      timeSpent: 0,
      isgameover: Boolean(m.isGameOver),
      datedebut: m.datedebut ?? null,
    }));
  }

  return [];
}

const calculateCompetitionStats = (
  matches: NormalizedMatch[]
): CompetitionStats => {
  const totalMatches = matches.length;

  if (totalMatches === 0) {
    return {
      totalScore: 0,
      totalMatches: 0,
      completedMatches: 0,
      averageScore: 0,
      totalTimeSeconds: 0,
    };
  }

  let totalScore = 0;
  let completedMatches = 0;
  let totalTimeSeconds = 0;

  for (const m of matches) {
    totalScore += m.score;
    if (m.isgameover) completedMatches += 1;
    totalTimeSeconds += m.timeSpent;
  }

  return {
    totalScore,
    totalMatches,
    completedMatches,
    averageScore: Math.round(totalScore / totalMatches),
    totalTimeSeconds,
  };
};

const getStoredValidationStatus = (competitionId: string): boolean => {
  if (typeof window === 'undefined' || !competitionId) return false;
  return window.localStorage.getItem(ACTIVE_VALIDATED_GAME_KEY) === competitionId;
};

// ============================================================
// HOOK PRINCIPAL
// ============================================================

export const useCompetitionValidation = (competition: CompetitionInfo) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showMessage } = useMessage();
  const { updateLocalCache } = useCompetitionStorage();

  const currentConsultationId = useCompetitionStore(
    (state) => state.currentConsultationId
  );
  const setGameIsFinished = useCompetitionStore(
    (state) => state.setGameIsFinished
  );
  const updateCompetitionValidation = useCompetitionStore(
    (state) => state.updateCompetitionValidation
  );

  const localTournament = useHistoryStore((state) =>
    Array.isArray(state.tournaments)
      ? state.tournaments.find((t) => t.id === competition.id)
      : undefined
  );

  const resolvedMatches = useMemo(
    () => resolveMatches(competition, localTournament?.matchs),
    [competition, localTournament?.matchs]
  );

  const [isLocalValidating, setIsLocalValidating] = useState(false);
  const [validationMessage, setValidationMessage] =
    useState<ValidationMessage | null>(null);
  const [isValidated, setIsValidated] = useState(() =>
    getStoredValidationStatus(competition.id)
  );
  const [showPermanentMessage, setShowPermanentMessage] = useState(() =>
    getStoredValidationStatus(competition.id)
  );

  const permanentMessageTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (permanentMessageTimeoutRef.current) {
        clearTimeout(permanentMessageTimeoutRef.current);
        permanentMessageTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const stored = getStoredValidationStatus(competition.id);
    setIsValidated(stored);
    setShowPermanentMessage(stored);
  }, [competition.id]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!isMountedRef.current) return;
      if (e.key !== ACTIVE_VALIDATED_GAME_KEY) return;

      const isCurrentValidated = e.newValue === competition.id;
      setIsValidated(isCurrentValidated);
      setShowPermanentMessage(isCurrentValidated);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [competition.id]);

  const validateCompetition = useCallback(
    async (
      comp: CompetitionInfo,
      matches: NormalizedMatch[]
    ): Promise<boolean> => {
      try {
        const stats = calculateCompetitionStats(matches);

        const startDate =
          matches[0]?.datedebut ||
          comp.datedebut ||
          new Date().toISOString();
        const endDate = comp.datefin || new Date().toISOString();

        const totalTimeSeconds =
          stats.totalTimeSeconds ||
          calculateDurationInSeconds(startDate, endDate);

        const targetConsultationId = currentConsultationId;
        if (!targetConsultationId) {
          showMessage(
            'Consultation introuvable. Veuillez rafraîchir la page.',
            'error'
          );
          return false;
        }

        const { data: consultation } = await api.get<GameResult>(
          `/consultations/${targetConsultationId}`
        );

        const existingStats = (consultation?.learningStats ||
          {}) as LearningStatsPayload;
        const existingMatches = Array.isArray(existingStats.matchesDetails)
          ? existingStats.matchesDetails
          : [];

        const matchesDetails = matches.map((m) => ({
          matchNumber: m.matchNumber,
          numeromatch: m.numeromatch,
          score: m.score,
          timeSpent: m.timeSpent,
          isgameover: m.isgameover,
          niveau: comp.niveau ?? 0,
        }));

        const seenMatchKeys = new Set(
          existingMatches.map(
            (em) => `${em.matchNumber ?? ''}-${em.numeromatch ?? ''}`
          )
        );
        const newMatches = matchesDetails.filter(
          (nm) => !seenMatchKeys.has(`${nm.matchNumber}-${nm.numeromatch}`)
        );

        const totalTimeFormatted = calculateDuration(startDate, endDate);

        const updatedPayload = {
          ...consultation,
          status: 'completed' as const,
          nombredevues: 0,
          gameEndDate: endDate,
          totalTimeSeconds,
          timeSpent: totalTimeSeconds,
          finalScore: stats.totalScore,
          matchesCompleted: stats.completedMatches,
          niveau: comp.niveau ?? 0,
          learningStats: {
            totalTime: totalTimeFormatted,
            averageScore: stats.averageScore,
            completedAt: endDate,
            totalMatches:
              (existingStats.totalMatches || 0) + newMatches.length,
            matchesDetails: [...existingMatches, ...newMatches],
          },
        };

        await api.put(
          `/consultations/${targetConsultationId}`,
          updatedPayload
        );

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(ACTIVE_VALIDATED_GAME_KEY, comp.id);
        }
        updateLocalCache(comp.id);
        if (typeof updateCompetitionValidation === 'function') {
          updateCompetitionValidation(comp.id, true);
        }
        setGameIsFinished(true);

        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['game'] }),
          queryClient.invalidateQueries({
            queryKey: ['consultation', targetConsultationId],
          }),
          queryClient.invalidateQueries({ queryKey: ['competitions'] }),
          queryClient.invalidateQueries({ queryKey: ['leaderboard'] }),
        ]);

        return true;
      } catch (error: unknown) {
        console.error('❌ Erreur validation:', error);

        const err = error as {
          response?: { status?: number; data?: { message?: string } };
        };
        const status = err?.response?.status;
        const message = err?.response?.data?.message;

        if (status === 404) {
          showMessage(
            'Consultation introuvable. Veuillez rafraîchir la page.',
            'error'
          );
        } else if (status === 409) {
          showMessage('Cette compétition a déjà été validée.', 'error');
        } else if (status === 422) {
          showMessage(
            'Données invalides. Vérifiez les informations de la compétition.',
            'error'
          );
        } else {
          showMessage(message || 'Erreur lors de la validation', 'error');
        }
        return false;
      }
    },
    [
      currentConsultationId,
      showMessage,
      updateLocalCache,
      updateCompetitionValidation,
      queryClient,
      setGameIsFinished,
    ]
  );

  const handleValidate = useCallback(async () => {
    if (isLocalValidating) return;

    if (resolvedMatches.length === 0) {
      showMessage('Aucun match à valider', 'error');
      return;
    }

    const allMatchesComplete = resolvedMatches.every((m) => m.isgameover);
    if (!allMatchesComplete) {
      showMessage(
        'Tous les matches doivent être terminés avant la validation',
        'error'
      );
      return;
    }

    if (isValidated) {
      showMessage('Cette compétition a déjà été validée', 'success');
      return;
    }

    setIsLocalValidating(true);
    setValidationMessage(null);

    try {
      const success = await validateCompetition(competition, resolvedMatches);

      if (success && isMountedRef.current) {
        const stats = calculateCompetitionStats(resolvedMatches);
        setValidationMessage({
          text: `✅ Compétition validée ! Score : ${stats.totalScore} pts`,
          type: 'success',
        });
        setIsValidated(true);
        setShowPermanentMessage(true);

        if (permanentMessageTimeoutRef.current) {
          clearTimeout(permanentMessageTimeoutRef.current);
        }
        permanentMessageTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) setShowPermanentMessage(false);
        }, PERMANENT_MESSAGE_DURATION);

        router.refresh();
      } else if (isMountedRef.current) {
        setValidationMessage({
          text: '❌ Erreur lors de la validation. Veuillez réessayer.',
          type: 'error',
        });
      }
    } catch {
      if (isMountedRef.current) {
        setValidationMessage({
          text: '❌ Une erreur inattendue est survenue.',
          type: 'error',
        });
      }
    } finally {
      if (isMountedRef.current) setIsLocalValidating(false);
    }
  }, [
    competition,
    resolvedMatches,
    isLocalValidating,
    isValidated,
    validateCompetition,
    showMessage,
    router,
  ]);

  const clearValidationStatus = useCallback(() => {
    if (
      typeof window !== 'undefined' &&
      window.localStorage.getItem(ACTIVE_VALIDATED_GAME_KEY) === competition.id
    ) {
      window.localStorage.removeItem(ACTIVE_VALIDATED_GAME_KEY);
    }
    setIsValidated(false);
    setShowPermanentMessage(false);
    setValidationMessage(null);

    if (permanentMessageTimeoutRef.current) {
      clearTimeout(permanentMessageTimeoutRef.current);
      permanentMessageTimeoutRef.current = null;
    }
  }, [competition.id]);

  const handleCloseMessage = useCallback(() => setValidationMessage(null), []);
  const handleClosePermanentMessage = useCallback(
    () => setShowPermanentMessage(false),
    []
  );

  const competitionStats = useMemo(
    () => calculateCompetitionStats(resolvedMatches),
    [resolvedMatches]
  );
  const formattedStartDate = useMemo(
    () => formatCompetitionDate(competition.datedebut),
    [competition.datedebut]
  );
  const formattedFinishedDate = useMemo(
    () =>
      competition.datefin ? formatCompetitionDate(competition.datefin) : null,
    [competition.datefin]
  );
  const allMatchesCompleted = useMemo(
    () =>
      resolvedMatches.length > 0 && resolvedMatches.every((m) => m.isgameover),
    [resolvedMatches]
  );

  return useMemo(
    () => ({
      handleCloseMessage,
      handleClosePermanentMessage,
      handleValidate,
      clearValidationStatus,

      isLoading: isLocalValidating,
      isValidated,
      validationMessage,
      showPermanentMessage,

      formattedStartDate,
      formattedFinishedDate,

      stats: competitionStats,
      allMatchesCompleted,

      totalMatches: resolvedMatches.length,
      timeSpent: competition.timeSpent,
      niveau: competition.niveau,
    }),
    [
      handleCloseMessage,
      handleClosePermanentMessage,
      handleValidate,
      clearValidationStatus,
      isLocalValidating,
      isValidated,
      validationMessage,
      showPermanentMessage,
      formattedStartDate,
      formattedFinishedDate,
      competitionStats,
      allMatchesCompleted,
      resolvedMatches.length,
      competition.timeSpent,
      competition.niveau,
    ]
  );
};

export default useCompetitionValidation;