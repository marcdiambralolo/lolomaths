'use client';

import { api } from '@/lib/api/client';
import { ActiveEdition, GameResult } from '@/lib/interfaces';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useConsultationDuplicates } from './useConsultationDuplicates';
import { useConsultationStats } from './useConsultationStats';
import { useEditionFormat } from './useEditionFormat';

const ITEMS_PER_PAGE = 10000;

export function useHistoriqueConsultations() {
  const isMountedRef = useRef(true);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [consultations, setConsultations] = useState<GameResult[]>([]);
  const [activeEdition, setActiveEdition] = useState<ActiveEdition | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<any>('/consultations/ended-learning', {
        params: { page: 1, limit: ITEMS_PER_PAGE },
      });

      if (isMountedRef.current) {
        setConsultations(data?.consultations || []);
        setActiveEdition(data?.activeEdition || null);
        setError(null);
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        console.error('Erreur:', err);
        setError(err?.message || 'Erreur lors du chargement');
      }
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    fetchData();
    return () => {
      isMountedRef.current = false;
    };
  }, [fetchData]);

  const { sortedConsultations, duplicateMap } =
    useConsultationDuplicates(consultations);

  // 🔥 On passe undefined : le hook calcule les stats à partir des consultations
  const {
    timeSpentStats,
    participantStats,
    advancedStats,
    rankedConsultations,
  } = useConsultationStats(sortedConsultations, undefined);

  const {
    edition,
    formattedStartDate,
    formattedEndDate,
  } = useEditionFormat(activeEdition ?? undefined);

  const handleGoBack = useCallback(() => {
    window.history.back();
  }, []);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return {
    consultations,
    activeEdition,
    sortedConsultations,
    duplicateMap,
    hasConsultations: sortedConsultations.length > 0,
    timeSpentStats,
    participantStats,
    advancedStats,
    rankedConsultations,
    edition,
    formattedStartDate,
    formattedEndDate,
    loading,
    error,
    refetch,
    handleGoBack,
  };
}