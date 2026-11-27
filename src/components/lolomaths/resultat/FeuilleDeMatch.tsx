'use client';

import { memo } from 'react';
import { useEndGameGenerator } from '@/hooks/lolomaths/endgame/useEndGameGenerator';
import CompetitionDetails from './CompetitionDetails';
import LoadMoreButton from './LoadMoreButton';

const FeuilleDeMatch = memo(() => {
  const {
    handleLoadMoreClick,
    competitionList,
    hasMore,
    remainingCount,
    isLoadingMore,
    user,
  } = useEndGameGenerator();

  const safeList = Array.isArray(competitionList) ? competitionList : [];
  const isEmpty = safeList.length === 0;
  const safeRemaining =
    typeof remainingCount === 'number' && Number.isFinite(remainingCount)
      ? Math.max(0, remainingCount)
      : 0;
  const shouldShowLoadMore = Boolean(hasMore) && (safeRemaining > 0 || isLoadingMore);

  return (
    <div className="w-full mx-auto max-w-md px-4 sm:px-0">
      <div className="space-y-4">
        {isEmpty && (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 italic py-6">
            Aucune compétition à afficher.
          </div>
        )}

        {safeList.map((competition, idx) => (
          <CompetitionDetails
            key={`${competition.id || 'competition'}-${idx}`}
            competition={competition}
            priority={idx === 0}
            user={user}
          />
        ))}

        {shouldShowLoadMore && (
          <LoadMoreButton
            onClick={handleLoadMoreClick}
            remainingCount={safeRemaining}
            isLoading={isLoadingMore}
          />
        )}
      </div>
    </div>
  );
});

FeuilleDeMatch.displayName = 'FeuilleDeMatch';

export default FeuilleDeMatch;