import { useGameStore } from '@/lib/store/useGameStore';
import React from 'react';

export const GameScoreBoard: React.FC = () => {
  const scoreTotal = useGameStore((state) => state.scoreTotal);
  const cnbjeu = useGameStore((state) => state.cnbjeu);
  const formattedScoreTotal = scoreTotal.toFixed(2);

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
        <span className="text-xs text-white block uppercase font-medium">
          Score Total
        </span>
        <span className="text-xl font-black text-emerald-400">
          {formattedScoreTotal} pts
        </span>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
        <span className="text-xs text-white block uppercase font-medium">
          jeu en cours
        </span>
        <span className="text-xl font-black text-sky-400">
          N° {cnbjeu + 1}
        </span>
      </div>
    </div>
  );
};