import { useCompetitionStore } from '@/lib/store/useCompetitionStore';
import React from 'react';

 

export const GameScoreBoard: React.FC  = ({
 
 
}) => {
  const store = useCompetitionStore();
  const averageScore = store.cnbjeu > 0 ? (store.scoreTotal / store.cnbjeu).toFixed(1) : 0;

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
        <span className="text-xs text-slate-500 block uppercase font-medium">Score Total</span>
        <span className="text-xl font-black text-emerald-400">{store.scoreTotal} pts</span>
        {store.cnbjeu > 0 && (
          <span className="text-[10px] text-slate-500 block mt-1">
            Moy: {averageScore} pts/jeu
          </span>
        )}
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
        <span className="text-xs text-slate-500 block uppercase font-medium">Match en cours</span>
        <span className="text-xl font-black text-sky-400">N° {store.cnbjeu + 1}</span>
        {store.hasUsedMultiplicationOrDivision && (
          <span className="text-[10px] text-amber-400 block mt-1">
            ×÷ bonus utilisé ✓
          </span>
        )}
      </div>
    </div>
  );
};