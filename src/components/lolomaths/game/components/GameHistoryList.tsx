import React from 'react';
import { useGameHistory } from '@/hooks/lolomaths/game/useGameHistory';

export const GameHistoryList: React.FC = () => {
  const { gameHistory } = useGameHistory();

  if (gameHistory.length === 0) return null;

  const visibleGames = gameHistory.slice(-5);
  const offset = gameHistory.length - visibleGames.length;

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-2 max-h-16 overflow-y-auto">
      <div className="flex flex-wrap gap-1 text-[10px] text-slate-400">
        {visibleGames.map((g, idx) => {
          const realIndex = offset + idx + 1;
          return (
            <span key={realIndex} className="bg-slate-800 px-2 py-0.5 rounded">
              J{realIndex}: {g.score}pts
            </span>
          );
        })}
      </div>
    </div>
  );
};