'use client';

import { memo } from 'react';
import { Trophy, Users, Target } from 'lucide-react';

interface WinningInfoCardProps {
  bestScore: number;
  totalParticipants: number;
  perfectCount?: number;
}

const WinningInfoCard = memo(function WinningInfoCard({
  bestScore,
  totalParticipants,
  perfectCount = 0,
}: WinningInfoCardProps) {
  return (
    <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-900/20 dark:via-yellow-900/20 dark:to-orange-900/20 rounded-2xl border-2 border-amber-200 dark:border-amber-800 p-5 shadow-lg">
      <div className="grid grid-cols-3 gap-4 text-center">
        {/* Meilleur score */}
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center mb-2">
            <Trophy className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700 dark:text-amber-400">
            {bestScore.toFixed(2)}
          </div>
          <div className="text-[10px] font-semibold text-amber-600 dark:text-amber-500 uppercase tracking-wide">
            Meilleur score
          </div>
        </div>

        {/* Participants */}
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-2">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-700 dark:text-purple-400">
            {totalParticipants}
          </div>
          <div className="text-[10px] font-semibold text-purple-600 dark:text-purple-500 uppercase tracking-wide">
            Participants
          </div>
        </div>

        {/* Calculs parfaits */}
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mb-2">
            <Target className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
            {perfectCount}
          </div>
          <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-500 uppercase tracking-wide">
            Calculs parfaits
          </div>
        </div>
      </div>
    </div>
  );
});

WinningInfoCard.displayName = 'WinningInfoCard';

export default WinningInfoCard;