'use client';

import React, { memo, useMemo } from 'react';
import { useGameStore } from '@/lib/store/useGameStore';

interface GameHeaderControlsProps {
  hasPlacedPions: boolean;
  onResetRound: () => void;
}

export const GameHeaderControls: React.FC<GameHeaderControlsProps> = memo(
  ({ hasPlacedPions, onResetRound }) => {
    const cnbjeu = useGameStore((state) => state.cnbjeu);
    const nombredejeu = useGameStore((state) => state.nombredejeu);
    const isMatchOver = useGameStore((state) => state.isMatchOver);

    const gameNumberLabel = useMemo(() => {
      const safeCnbjeu =
        typeof cnbjeu === 'number' && Number.isFinite(cnbjeu) && cnbjeu >= 0
          ? cnbjeu
          : 0;
      const rawNext = safeCnbjeu + 1;
      const current =
        typeof nombredejeu === 'number' && nombredejeu > 0
          ? Math.min(rawNext, nombredejeu)
          : rawNext;

      return nombredejeu > 0 ? `Jeu #${current} / ${nombredejeu}` : `Jeu #${current}`;
    }, [cnbjeu, nombredejeu]);

    const isResetDisabled = !hasPlacedPions || isMatchOver;

    return (
      <div className="bg-slate-900 border border-slate-800 p-3 flex items-center justify-between gap-3 shadow-lg select-none">
        <div className="font-mono text-xs font-bold text-slate-400 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
          {gameNumberLabel}
        </div>
        <button
          type="button"
          onClick={onResetRound}
          className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 font-bold rounded-xl text-xs transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={isResetDisabled}
        >
          REFAIRE
        </button>
      </div>
    );
  }
);

GameHeaderControls.displayName = 'GameHeaderControls';