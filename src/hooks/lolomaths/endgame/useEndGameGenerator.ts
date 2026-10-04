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
  const processedData = useMemo(() => processUserData(user), [user]);

  const competitions = useCompetitionList();

  const refreshData = useCallback(() => {
    if (refreshCompetitions) refreshCompetitions();
  }, [refreshCompetitions]);

  useCompetitionPolling(refreshData);

  const {
    handleLoadMoreClick,
    displayList,
    hasMore,
    remainingCount,
    isLoadingMore,
  } = usePaginationWithLoadMore(competitions);

  return useMemo(
    () => ({
      handleLoadMoreClick,
      competitionList: displayList,
      hasMore,
      remainingCount,
      isLoadingMore,
      user: processedData,
    }),
    [
      handleLoadMoreClick,
      displayList,
      hasMore,
      remainingCount,
      isLoadingMore,
      processedData,
    ]
  );
};

export default useEndGameGenerator;