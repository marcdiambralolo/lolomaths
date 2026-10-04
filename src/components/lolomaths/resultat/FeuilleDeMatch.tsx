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

  const isEmpty = !competitionList || competitionList.length === 0;

  return (
    <div className="w-full mx-auto max-w-md px-4 sm:px-0">
      <div className="space-y-4">
        {isEmpty && (
          <div className="text-center text-sm text-gray-500 italic py-6">
            Aucune compétition à afficher.
          </div>
        )}

        {competitionList?.map((competition, idx) => (
          <CompetitionDetails
            key={competition.id}
            competition={competition}
            priority={idx === 0}
            user={user}
          />
        ))}

        {hasMore && (
          <LoadMoreButton
            onClick={handleLoadMoreClick}
            remainingCount={remainingCount}
            isLoading={isLoadingMore}
          />
        )}
      </div>
    </div>
  );
});

FeuilleDeMatch.displayName = 'FeuilleDeMatch';

export default FeuilleDeMatch;