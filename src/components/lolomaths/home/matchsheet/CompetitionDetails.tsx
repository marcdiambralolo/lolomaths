'use client';

import { useCompetitionValidation } from '@/hooks/lolomaths/endgame/useCompetitionValidation';
import { CompetitionInfo, User } from '@/lib/interfaces';
import { memo, useMemo } from 'react';
import CompetitionHeader from './CompetitionHeader';
import CompetitionStats from './CompetitionStats';
import MessageToast from './MessageToast';
import PermanentSuccessMessage from './PermanentSuccessMessage';
import { useHistoryStore } from '@/lib/store/useHistoryStore';

interface CompetitionDetailsProps {
  competition: CompetitionInfo;
  priority?: boolean;
  user: User | null;
}

const CompetitionDetails = memo(function CompetitionDetails({
  competition,
  priority = false,
  user,
}: CompetitionDetailsProps) {
  const {
    handleCloseMessage,
    handleClosePermanentMessage,
    handleValidate,
    formattedStartDate,
    isLoading,
    isValidated,
    validationMessage,
    showPermanentMessage,
    formattedFinishedDate,
    stats,
    totalMatches,
  } = useCompetitionValidation(competition);

  const localTournament = useHistoryStore((s) =>
    s.tournaments.find((t) => t.id === competition.id)
  );

  const displayScore = useMemo(() => {
    if (localTournament) return localTournament.score;
    return stats.totalScore;
  }, [localTournament, stats.totalScore]);

  const displayMatches = useMemo(() => {
    if (localTournament) return localTournament.matchs.length;
    return totalMatches;
  }, [localTournament, totalMatches]);

  const displayCompletedMatches = useMemo(() => {
    if (localTournament) {
      return localTournament.matchs.filter((m) => m.isGameOver).length;
    }
    return stats.completedMatches;
  }, [localTournament, stats.completedMatches]);

  const containerClass = useMemo(
    () =>
      `bg-white dark:bg-gray-800/50 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-800 ${
        priority
          ? 'ring-2 ring-purple-500/20 shadow-lg border-purple-100'
          : ''
      }`,
    [priority]
  );

  const displayName = competition.displayName ?? competition.name ?? '';

  return (
    <div className={containerClass}>
      {!isValidated && validationMessage && (
        <MessageToast
          message={validationMessage}
          onClose={handleCloseMessage}
        />
      )}

      <div className="p-3 space-y-3">
        <CompetitionHeader
          name={displayName}
          onValidate={handleValidate}
          isLoading={isLoading}
          isValidated={Boolean(isValidated)}
        />

        {isValidated && showPermanentMessage && (
          <PermanentSuccessMessage
            competitionName={displayName}
            onClose={handleClosePermanentMessage}
          />
        )}

        <CompetitionStats
          startDate={formattedStartDate}
          finishedDate={formattedFinishedDate ?? ''}
          score={displayScore}
          matchesCount={displayMatches}
          completedMatches={displayCompletedMatches}
          timeSpent={competition.timeSpent}
          user={user}
        />
      </div>
    </div>
  );
});

CompetitionDetails.displayName = 'CompetitionDetails';

export default CompetitionDetails;