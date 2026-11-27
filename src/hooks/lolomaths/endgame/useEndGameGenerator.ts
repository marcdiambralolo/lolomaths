'use client';

import { processUserData } from '@/lib/functions';
import { useAuth } from '@/lib/hooks';
import { useCallback, useMemo } from 'react';
import useCompetitionList from './useCompetitionList';
import useCompetitionPolling from './useCompetitionPolling';
import usePaginationWithLoadMore from './usePaginationWithLoadMore';
import { useCompetitionStore } from '@/lib/store/useCompetitionStore';

export const useEndGameGenerator = () => {
  const refreshCompetitions = useCompetitionStore(
    (state) => state.refreshCompetitions
  );
  const { user } = useAuth();
  const processedData = useMemo(
    () => (user ? processUserData(user) : null),
    [user]
  );

  const rawCompetitions = useCompetitionList();
  const competitions = useMemo(
    () => (Array.isArray(rawCompetitions) ? rawCompetitions : []),
    [rawCompetitions]
  );

  const refreshData = useCallback(() => {
    if (typeof refreshCompetitions === 'function') {
      refreshCompetitions();
    }
  }, [refreshCompetitions]);

  useCompetitionPolling(refreshData);

  const {
    handleLoadMoreClick,
    displayList,
    hasMore,
    remainingCount,
    isLoadingMore,
  } = usePaginationWithLoadMore(competitions);

  const safeDisplayList = useMemo(
    () => (Array.isArray(displayList) ? displayList : []),
    [displayList]
  );

  return useMemo(
    () => ({
      handleLoadMoreClick,
      competitionList: safeDisplayList,
      hasMore: Boolean(hasMore),
      remainingCount:
        typeof remainingCount === 'number' && Number.isFinite(remainingCount)
          ? Math.max(0, remainingCount)
          : 0,
      isLoadingMore: Boolean(isLoadingMore),
      user: processedData,
    }),
    [
      handleLoadMoreClick,
      safeDisplayList,
      hasMore,
      remainingCount,
      isLoadingMore,
      processedData,
    ]
  );
};

export default useEndGameGenerator;