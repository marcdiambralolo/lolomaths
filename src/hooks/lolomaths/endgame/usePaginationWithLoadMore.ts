'use client';

import {
  INITIAL_VISIBLE_COUNT,
  LOAD_MORE_INCREMENT,
} from '@/lib/learning/constantes';
import { useCallback, useMemo, useState, useTransition } from 'react';

/**
 * Gère la pagination d'une liste avec un bouton "Charger plus".
 * Générique : fonctionne avec n'importe quel tableau `T`.
 */
const usePaginationWithLoadMore = <T,>(
  items: T[],
  initialCount: number = INITIAL_VISIBLE_COUNT,
  increment: number = LOAD_MORE_INCREMENT
) => {
  const safeInitialCount =
    typeof initialCount === 'number' && Number.isFinite(initialCount)
      ? Math.max(1, Math.floor(initialCount))
      : 5;
  const safeIncrement =
    typeof increment === 'number' && Number.isFinite(increment)
      ? Math.max(1, Math.floor(increment))
      : 5;

  const safeItems = useMemo(
    () => (Array.isArray(items) ? items : []),
    [items]
  );

  const [visibleCount, setVisibleCount] = useState(safeInitialCount);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isPending, startTransition] = useTransition();

  const effectiveVisibleCount = useMemo(
    () => Math.min(visibleCount, safeItems.length),
    [visibleCount, safeItems.length]
  );

  const displayList = useMemo(
    () => safeItems.slice(0, effectiveVisibleCount),
    [safeItems, effectiveVisibleCount]
  );

  const hasMore = useMemo(
    () => effectiveVisibleCount < safeItems.length,
    [effectiveVisibleCount, safeItems.length]
  );

  const remainingCount = useMemo(
    () => Math.max(0, safeItems.length - effectiveVisibleCount),
    [safeItems.length, effectiveVisibleCount]
  );

  const resetPagination = useCallback(() => {
    setVisibleCount(safeInitialCount);
  }, [safeInitialCount]);

  const handleLoadMore = useCallback(() => {
    startTransition(() => {
      setVisibleCount((prev) =>
        Math.min(Math.max(prev, safeInitialCount) + safeIncrement, safeItems.length)
      );
    });
  }, [safeItems.length, safeIncrement, safeInitialCount]);

  const handleLoadMoreClick = useCallback(async () => {
    if (isLoadingMore || isPending || !hasMore) return;
    setIsLoadingMore(true);

    try {
      handleLoadMore();
    } finally {
      setIsLoadingMore(false);
    }
  }, [handleLoadMore, isLoadingMore, isPending, hasMore]);

  return {
    displayList,
    hasMore,
    remainingCount,
    isLoadingMore: isLoadingMore || isPending,
    handleLoadMoreClick,
    resetPagination,
  };
};

export default usePaginationWithLoadMore;