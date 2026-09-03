"use client";

import React from 'react';
import { useCompetitionStore } from '@/lib/store/useCompetitionStore';
import { StateCase } from '@/lib/interfaces';
import { isOperateur } from './competitionEngine';
  
export const TileRack: React.FC = () => {
  const { pions, handleCaseClick } = useCompetitionStore();

  const numbers = pions.filter((p) => p.tca === 2);
  const operators = pions.filter((p) => p.tca === 3);

  const renderPion = (pion: typeof pions[0]) => {
    const isSelected = pion.etat === StateCase.Choi;
    const isUsed = pion.etat === StateCase.Cre;
    const isOp = isOperateur(pion.txt);

    return (
      <button
        key={`pion-${pion.placep}-${pion.txt}`}
        onClick={() => handleCaseClick(pion)}
        disabled={isUsed}
        className={`
          w-10 h-10 sm:w-12 sm:h-12
          flex items-center justify-center
          rounded-xl font-mono text-sm sm:text-base font-black
          border-2 transition-all duration-150 active:scale-95
          ${
            isUsed
              ? 'opacity-20 bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed scale-90'
              : isSelected
              ? 'bg-yellow-400 border-yellow-300 text-slate-950 scale-110 shadow-lg shadow-yellow-500/30 z-10'
              : isOp
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 hover:bg-amber-500 hover:text-slate-950 shadow-md'
              : 'bg-sky-500/20 border-sky-500/50 text-sky-400 hover:bg-sky-500 hover:text-white shadow-md'
          }
        `}
      >
        {pion.txt}
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl w-full">
      <div>
         <div className="flex flex-wrap gap-2 min-h-[48px] items-center">
          {numbers.map(renderPion)}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800/60">
           <div className="flex flex-wrap gap-2 min-h-[48px] items-center">
          {operators.map(renderPion)}
        </div>
      </div>
    </div>
  );
};