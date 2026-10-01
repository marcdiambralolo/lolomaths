import { useGameHistory } from '@/hooks/lolomaths/game/useGameHistory';
import React from 'react';

export const GameHistoryList: React.FC = () => {
  const { gameHistory, } = useGameHistory();

  if (gameHistory.length === 0) return null;

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-2 max-h-16 overflow-y-auto">
      <div className="flex flex-wrap gap-1 text-[10px] text-slate-400">
        {gameHistory.slice(-5).map((g, idx) => (
          <span key={idx} className="bg-slate-800 px-2 py-0.5 rounded">
            J{idx + 1}: {g.score}pts
          </span>
        ))}
      </div>
    </div>
  );
};