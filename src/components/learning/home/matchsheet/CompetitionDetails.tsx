'use client';
import { useCompetitionValidation } from '@/hooks/learning/endgame/useCompetitionValidation';
import { memo } from 'react';
import CompetitionHeader from './CompetitionHeader';
import CompetitionStats from './CompetitionStats';
import MessageToast from './MessageToast';
import PermanentSuccessMessage from './PermanentSuccessMessage';
import { CompetitionInfo, User } from '@/lib/interfaces';

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
    handleCloseMessage, handleClosePermanentMessage, handleValidate,
    formattedStartDate, isLoading, isValidated, validationMessage,
    showPermanentMessage, formattedFinishedDate,
  } = useCompetitionValidation(competition);

  const getBackgroundClasses = () => {
    if (isValidated) {
      return 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50/50 border-emerald-200';
    }
    return 'bg-white border-gray-100 dark:border-gray-800';
  };

  const getBorderClasses = () => {
    if (isValidated) {
      return 'border-2 border-emerald-300 shadow-lg shadow-emerald-100/50';
    }
    return `border ${priority ? 'border-purple-100 ring-2 ring-purple-500/20 shadow-lg' : 'border-gray-100 dark:border-gray-800 shadow-md'}`;
  };

  const containerClass = `rounded-2xl overflow-hidden transition-all duration-300 ${getBackgroundClasses()} ${getBorderClasses()}`;

  return (
    <div className={containerClass}>

      {isValidated && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-1.5 flex items-center justify-center gap-2">
          <span className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Dernier jeu validé ✓
          </span>
        </div>
      )}

      {!isValidated && (
        <MessageToast message={validationMessage} onClose={handleCloseMessage} />
      )}

      <div className="p-2 space-y-2">
        <CompetitionHeader
          name={competition.displayName ?? ''}
          onValidate={handleValidate}
          isLoading={isLoading}
          isValidated={Boolean(isValidated)}
        />

        {isValidated && showPermanentMessage && (
          <PermanentSuccessMessage
            competitionName={competition.name ?? ''}
            onClose={handleClosePermanentMessage}
          />
        )}

        <CompetitionStats
          startDate={formattedStartDate}
          finishedDate={formattedFinishedDate ?? ''}
          timeSpent={competition.timeSpent}
          punChangeCount={competition.punChangeCount}
          user={user}
        />
      </div>
    </div>
  );
});

export default CompetitionDetails;