"use client";

import React, { memo, useCallback } from 'react';
import { useCompetitionStore } from '@/lib/store/useCompetitionStore';
import { StateCase, UneCase } from '@/lib/interfaces';
import { isOperateur } from './competitionEngine';

export const TileRack: React.FC = memo(() => {
  const pions = useCompetitionStore((state) => state.pions);
  const handleCaseClick = useCompetitionStore((state) => state.handleCaseClick);
  // const annulerCoup = useCompetitionStore((state) => state.annulerCoup);

  const numbers = pions.filter((p) => p.tca === 2);
  const operators = pions.filter((p) => p.tca === 3);

  const hasPlacedPions = pions.some((p) => p.etat === StateCase.Pla || p.etat === StateCase.Choi);

  const renderPion = useCallback((pion: UneCase) => {
    const isSelected = pion.etat === StateCase.Choi;
    const isUsed = pion.etat === StateCase.Cre;
    const isOp = isOperateur(pion.txt);

    return (
      <button
        key={`pion-${pion.placep}-${pion.txt}`}
        type="button"
        onClick={() => handleCaseClick(pion)}
        disabled={isUsed}
        className={`
          w-9 h-9 sm:w-11 sm:h-11
          flex items-center justify-center
          rounded-xl font-mono text-sm sm:text-base font-black
          border-2 transition-all duration-150 active:scale-95
          ${isUsed
            ? 'opacity-20 bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed scale-90'
            : isSelected
              ? 'bg-yellow-400 border-yellow-300 text-slate-950 scale-110 shadow-lg shadow-yellow-500/30 z-10'
              : isOp
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 hover:bg-amber-500 hover:text-slate-950 shadow-md'
                : 'bg-sky-500/20 border-sky-500/50 text-sky-400 hover:bg-sky-500 hover:text-white shadow-md'
          }
        `}
        title={`Jeton ${pion.txt} (Position ${pion.placep})`}
      >
        {pion.txt}
      </button>
    );
  }, [handleCaseClick]);

  return (
    <div className="flex flex-col gap-3 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl w-full max-w-md mx-auto select-none">

      {/* En-tête du chevalet */}

      {/* Pions Nombres */}
      <div>

        <div className="grid grid-cols-6 gap-1.5 min-h-[44px] items-center bg-slate-950/50 p-1 rounded-xl border border-slate-800/50">
          {numbers.length > 0 ? (
            numbers.map(renderPion)
          ) : (
            <div className="col-span-6 text-center text-xs font-semibold text-slate-500 italic py-2">
              Plus de nombres disponibles
            </div>
          )}
        </div>
      </div>

      {/* Pions Opérateurs */}
      <div className="pt-0 border-t border-slate-800/60">
        <div className="grid grid-cols-4 gap-1.5 min-h-[44px] items-center bg-slate-950/50 p-1.5 rounded-xl border border-slate-800/50">
          {operators.length > 0 ? (
            operators.map(renderPion)
          ) : (
            <div className="col-span-4 text-center text-xs font-semibold text-slate-500 italic py-2">
              Plus d&apos;opérateurs disponibles
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

TileRack.displayName = 'TileRack';