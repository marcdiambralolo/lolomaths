'use client';

import { api } from '@/lib/api/client';
import { CompetitionInfo, Consultation } from '@/lib/interfaces';
import {
  calculateDuration,
  calculateDurationInSeconds,
  formatCompetitionDate,
} from '@/lib/learning/functions';
import { LearningStatsPayload } from '@/lib/learning/interface';
 import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useCompetitionStorage from './useCompetitionStorage';
import { useMessage } from './useMessage';
import {   useCompetitionStore } from '@/lib/store/useCompetitionStore';

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

// ============================================================
// CALCUL DES STATS (simplifié Lolomaths)
// ============================================================

const calculateCompetitionStats = (
  competition: CompetitionInfo
): CompetitionStats => {
  const matches = competition.matchInfo ?? [];
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
    totalScore += m.score ?? 0;
    if (m.isgameover) completedMatches += 1;
    if (typeof m.timeSpent === 'number') totalTimeSeconds += m.timeSpent;
  }

  return {
    totalScore,
    totalMatches,
    completedMatches,
    averageScore: Math.round(totalScore / totalMatches),
    totalTimeSeconds,
  };
};

// ============================================================
// LECTURE DU STATUT DE VALIDATION LOCAL
// ============================================================

const getStoredValidationStatus = (competitionId: string): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(ACTIVE_VALIDATED_GAME_KEY) === competitionId;
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

  // ----- Cleanup -----
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

  // ----- Synchronisation multi-onglets -----
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

  // ============================================================
  // VALIDATION (envoi au backend)
  // ============================================================
  const validateCompetition = useCallback(
    async (comp: CompetitionInfo): Promise<boolean> => {
      try {
        const stats = calculateCompetitionStats(comp);

        const startDate =
          comp.matchInfo?.[0]?.datedebut ||
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

        const { data: consultation } = await api.get<Consultation>(
          `/consultations/${targetConsultationId}`
        );

        const existingStats =
          (consultation?.learningStats || {}) as LearningStatsPayload;
        const existingMatches = existingStats.matchesDetails || [];

        // ✅ On enregistre uniquement les champs disponibles pour Lolomaths
        const matchesDetails = (comp.matchInfo ?? []).map((m) => ({
          matchNumber: m.matchNumber,
          numeromatch: m.numeromatch,
          score: m.score ?? 0,
          timeSpent: m.timeSpent ?? 0,
          isgameover: m.isgameover ?? false,
          niveau: comp.niveau ?? 0,
        }));

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
              (existingStats.totalMatches || 0) + stats.totalMatches,
            matchesDetails: [...existingMatches, ...matchesDetails],
          },
        };

        await api.put(
          `/consultations/${targetConsultationId}`,
          updatedPayload
        );

        // ✅ Clé globale : on stocke l'ID de la compétition validée
        localStorage.setItem(ACTIVE_VALIDATED_GAME_KEY, comp.id);
        updateLocalCache(comp.id);
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
      queryClient,
      setGameIsFinished,
    ]
  );

  // ============================================================
  // HANDLER PRINCIPAL
  // ============================================================
  const handleValidate = useCallback(async () => {
    if (isLocalValidating) return;

    if (!competition.matchInfo?.length) {
      showMessage('Aucun match à valider', 'error');
      return;
    }

    const allMatchesComplete = competition.matchInfo.every(
      (m) => m.isgameover === true
    );
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
      const success = await validateCompetition(competition);

      if (success && isMountedRef.current) {
        const stats = calculateCompetitionStats(competition);
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
      } else if (isMountedRef.current) {
        setValidationMessage({
          text: '❌ Erreur lors de la validation. Veuillez réessayer.',
          type: 'error',
        });
      }

      router.refresh();
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
    isLocalValidating,
    isValidated,
    validateCompetition,
    showMessage,
    router,
  ]);

  // ============================================================
  // RESET DU STATUT
  // ============================================================
  const clearValidationStatus = useCallback(() => {
    // ✅ On supprime la clé uniquement si elle pointe sur cette compétition
    if (localStorage.getItem(ACTIVE_VALIDATED_GAME_KEY) === competition.id) {
      localStorage.removeItem(ACTIVE_VALIDATED_GAME_KEY);
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

  // ============================================================
  // MÉMOÏSATION
  // ============================================================
  const competitionStats = useMemo(
    () => calculateCompetitionStats(competition),
    [competition]
  );
  const formattedStartDate = useMemo(
    () => formatCompetitionDate(competition.datedebut),
    [competition.datedebut]
  );
  const formattedFinishedDate = useMemo(
    () =>
      competition.datefin
        ? formatCompetitionDate(competition.datefin)
        : null,
    [competition.datefin]
  );

  const allMatchesCompleted = useMemo(
    () => competition.matchInfo?.every((m) => m.isgameover === true) ?? false,
    [competition.matchInfo]
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

      totalMatches: competition.matchInfo?.length || 0,
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
      competition.matchInfo?.length,
      competition.timeSpent,
      competition.niveau,
    ]
  );
};

export default useCompetitionValidation;