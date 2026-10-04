import React from 'react';
import { useGameStore } from '@/lib/store/useGameStore';

interface GameHeaderControlsProps {
  hasPlacedPions: boolean;
  onResetRound: () => void;
}

export const GameHeaderControls: React.FC<GameHeaderControlsProps> = ({
  hasPlacedPions,
  onResetRound,
}) => {
  const cnbjeu = useGameStore((state) => state.cnbjeu);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-lg select-none">
      <div className="font-mono text-xs font-bold text-slate-400 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
        Jeu #{cnbjeu + 1}
      </div> 
      <button
        type="button"
        onClick={onResetRound}
        className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 font-bold rounded-xl text-xs transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        disabled={!hasPlacedPions}
      >
        REFAIRE
      </button>
    </div>
  );
};