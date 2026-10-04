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
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isPending, startTransition] = useTransition();

  const displayList = useMemo(
    () => items.slice(0, visibleCount),
    [items, visibleCount]
  );

  const hasMore = useMemo(
    () => visibleCount < items.length,
    [visibleCount, items.length]
  );

  const remainingCount = useMemo(
    () => Math.max(0, items.length - visibleCount),
    [items.length, visibleCount]
  );

  const resetPagination = useCallback(() => {
    setVisibleCount(initialCount);
  }, [initialCount]);

  const handleLoadMore = useCallback(() => {
    startTransition(() => {
      setVisibleCount((prev) =>
        Math.min(prev + increment, items.length)
      );
    });
  }, [items.length, increment]);

  const handleLoadMoreClick = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);

    try {
      handleLoadMore();
    } finally {
      setIsLoadingMore(false);
    }
  }, [handleLoadMore, isLoadingMore, hasMore]);

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