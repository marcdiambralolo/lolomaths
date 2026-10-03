import React from 'react';
import { useCompetitionStore } from '@/lib/store/useCompetitionStore';

export const GameScoreBoard: React.FC = () => {
  const scoreTotal = useCompetitionStore((state) => state.scoreTotal);
  const cnbjeu = useCompetitionStore((state) => state.cnbjeu);

  const averageScore =
    cnbjeu > 0 ? (scoreTotal / cnbjeu).toFixed(1) : '0';

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
        <span className="text-xs text-slate-500 block uppercase font-medium">
          Score Total
        </span>
        <span className="text-xl font-black text-emerald-400">
          {scoreTotal} pts
        </span>
        {cnbjeu > 0 && (
          <span className="text-[10px] text-slate-500 block mt-1">
            Moy: {averageScore} pts/jeu
          </span>
        )}
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
        <span className="text-xs text-slate-500 block uppercase font-medium">
          Match en cours
        </span>
        <span className="text-xl font-black text-sky-400">
          N° {cnbjeu + 1}
        </span>
      </div>
    </div>
  );
};