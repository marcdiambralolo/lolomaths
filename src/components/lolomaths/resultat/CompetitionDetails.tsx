'use client';

import { useCompetitionValidation } from '@/hooks/lolomaths/endgame/useCompetitionValidation';
import { CompetitionInfo, User } from '@/lib/interfaces';
import { memo, useMemo } from 'react';
import Link from 'next/link';
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

function toFiniteNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
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
    Array.isArray(s.tournaments)
      ? s.tournaments.find((t) => t.id === competition.id)
      : undefined
  );

  const displayScore = useMemo(() => {
    const hasLocalMatchs =
      localTournament &&
      Array.isArray(localTournament.matchs) &&
      localTournament.matchs.length > 0;

    if (
      localTournament &&
      typeof localTournament.score === 'number' &&
      Number.isFinite(localTournament.score) &&
      (hasLocalMatchs || localTournament.score > 0 || stats?.totalScore === undefined)
    ) {
      return localTournament.score;
    }

    return toFiniteNumber(stats?.totalScore, 0);
  }, [localTournament, stats?.totalScore]);

  const displayMatches = useMemo(() => {
    if (localTournament && Array.isArray(localTournament.matchs)) {
      return localTournament.matchs.length;
    }
    return toFiniteNumber(totalMatches, 0);
  }, [localTournament, totalMatches]);

  const displayCompletedMatches = useMemo(() => {
    if (localTournament && Array.isArray(localTournament.matchs)) {
      return localTournament.matchs.filter((m) => Boolean(m.isGameOver)).length;
    }
    return toFiniteNumber(stats?.completedMatches, 0);
  }, [localTournament, stats?.completedMatches]);

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
          user={user}
        />

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
          <span>
            Matchs terminés : {displayCompletedMatches} / {displayMatches}
          </span>
          {competition.id && (
            <Link
              href={`/star/tournoi/${competition.id}`}
              className="font-semibold text-purple-600 dark:text-purple-400 hover:underline"
            >
              Voir détail →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
});

CompetitionDetails.displayName = 'CompetitionDetails';

export default CompetitionDetails;