'use client';

import {
  BarChart3,
  Calendar,
  Clock,
  Phone,
  Trophy,
  User as UserIcon,
} from 'lucide-react';
import { memo, useMemo } from 'react';
import InfoRow from './InfoRow';
import { User } from '@/lib/interfaces';
import { formatToHMS } from '@/lib/learning/functions';

interface CompetitionStatsProps {
  startDate: string;
  finishedDate: string;
  timeSpent?: number;
  punChangeCount?: number;
  showUserInfo?: boolean;
  user: User | null;
  score?: number;
  matchesCount?: number;
  completedMatches?: number;
}

function toFiniteNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

const CompetitionStats = memo(function CompetitionStats({
  startDate,
  finishedDate,
  timeSpent,
  punChangeCount,
  showUserInfo = true,
  user,
  score,
  matchesCount,
  completedMatches,
}: CompetitionStatsProps) {
  const elapsedTime = useMemo((): string => {
    if (!startDate || !finishedDate) return 'N/A';

    const start = new Date(startDate).getTime();
    const end = new Date(finishedDate).getTime();

    if (Number.isNaN(start) || Number.isNaN(end)) return 'N/A';

    const diffSeconds = Math.floor((end - start) / 1000);
    if (diffSeconds < 0) return 'N/A';

    return formatToHMS(diffSeconds) || 'N/A';
  }, [startDate, finishedDate]);

  const safeTimeSpent = toFiniteNumber(timeSpent);
  const displayElapsedTime =
    safeTimeSpent !== undefined && safeTimeSpent > 0
      ? formatToHMS(safeTimeSpent) || 'N/A'
      : elapsedTime !== 'N/A'
        ? elapsedTime
        : safeTimeSpent === 0
          ? formatToHMS(0) || '00:00:00'
          : 'N/A';

  const safeScore = toFiniteNumber(score);
  const safeMatchesCount = toFiniteNumber(matchesCount);
  const safeCompletedMatches = toFiniteNumber(completedMatches);
  const safePunChangeCount = toFiniteNumber(punChangeCount);

  const fullName = user
    ? `${user.nom || ''} ${user.prenoms || ''}`.trim() || 'Utilisateur'
    : 'Utilisateur';
  const phoneNumber = user?.phone || 'Non renseigné';

  return (
    <div className="w-full dark:from-gray-800/30 dark:to-gray-900/30 dark:border-gray-700/50 mt-1">
      {showUserInfo && user && (
        <div className="mb-3 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30 shadow-sm">
          <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
            <div className="rounded-full bg-blue-100 dark:bg-blue-800/30 p-1">
              <UserIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            Informations du joueur
          </h4>
          <InfoRow
            label="Nom complet"
            value={fullName}
            icon={<UserIcon className="w-3.5 h-3.5" />}
          />
          <InfoRow
            label="Téléphone"
            value={phoneNumber}
            icon={<Phone className="w-3.5 h-3.5" />}
          />
        </div>
      )}

      <div className="space-y-1">
        <InfoRow
          label="Date de début"
          value={startDate || 'N/A'}
          icon={<Calendar className="w-3.5 h-3.5" />}
        />
        <InfoRow
          label="Date de fin"
          value={finishedDate || 'En cours'}
          icon={<Calendar className="w-3.5 h-3.5" />}
        />
        <InfoRow
          label="Temps écoulé"
          value={displayElapsedTime}
          highlight
          icon={<Clock className="w-3.5 h-3.5" />}
        />
        {safePunChangeCount !== undefined && (
          <InfoRow
            label="Nombre de Points"
            value={safePunChangeCount}
            icon={<BarChart3 className="w-3.5 h-3.5" />}
          />
        )}
        {safeScore !== undefined && (
          <InfoRow
            label="Score Total"
            value={safeScore}
            icon={<Trophy className="w-3.5 h-3.5" />}
          />
        )}
        {safeMatchesCount !== undefined && (
          <InfoRow
            label="Nombre de matchs"
            value={safeMatchesCount}
            icon={<Trophy className="w-3.5 h-3.5" />}
          />
        )}
        
      </div>
    </div>
  );
});

CompetitionStats.displayName = 'CompetitionStats';

export default CompetitionStats;