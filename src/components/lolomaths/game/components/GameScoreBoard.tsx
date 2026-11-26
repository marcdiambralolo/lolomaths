'use client';

import React, { memo, useMemo } from 'react';
import { useGameStore } from '@/lib/store/useGameStore';

function formatScore(value: unknown): string {
  return typeof value === 'number' && Number.isFinite(value)
    ? value.toFixed(2)
    : '0.00';
}

export const GameScoreBoard: React.FC = memo(() => {
  const scoreTotal = useGameStore((state) => state.scoreTotal);
  const cnbjeu = useGameStore((state) => state.cnbjeu);
  const nombredejeu = useGameStore((state) => state.nombredejeu);

  const formattedScoreTotal = useMemo(
    () => formatScore(scoreTotal),
    [scoreTotal]
  );

  const currentGameNumber = useMemo(() => {
    const safeCnbjeu =
      typeof cnbjeu === 'number' && Number.isFinite(cnbjeu) && cnbjeu >= 0
        ? cnbjeu
        : 0;
    const rawNext = safeCnbjeu + 1;
    if (typeof nombredejeu === 'number' && nombredejeu > 0) {
      return Math.min(rawNext, nombredejeu);
    }
    return rawNext;
  }, [cnbjeu, nombredejeu]);

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
        <span className="text-xs text-white block uppercase font-medium">
          Score Total
        </span>
        <span className="text-xl font-black text-emerald-400">
          {formattedScoreTotal} 
        </span>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
        <span className="text-xs text-white block uppercase font-medium">
          jeu en cours
        </span>
        <span className="text-xl font-black text-sky-400">
          N° {currentGameNumber}
          {nombredejeu > 0 ? ` / ${nombredejeu}` : ''}
        </span>
      </div>
    </div>
  );
});

GameScoreBoard.displayName = 'GameScoreBoard';