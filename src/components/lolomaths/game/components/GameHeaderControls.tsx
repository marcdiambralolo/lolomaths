import React from 'react';
import { useCompetitionStore } from '@/lib/store/useCompetitionStore';

interface GameHeaderControlsProps {
  formattedTime: string;
  hasPlacedPions: boolean;
  onResetRound: () => void;
}

export const GameHeaderControls: React.FC<GameHeaderControlsProps> = ({
  formattedTime,
  hasPlacedPions,
  onResetRound,
}) => {
  const cnbjeu = useCompetitionStore((state) => state.cnbjeu);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-lg">
      <div className="font-mono text-xs font-bold text-slate-400 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
        Jeu #{cnbjeu + 1}
      </div>
      <div className="font-mono font-black text-2xl text-rose-500 bg-rose-500/10 border border-rose-500/20 px-4 py-1 rounded-xl">
        {formattedTime}
      </div>
      <button
        onClick={onResetRound}
        className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 font-bold rounded-xl text-xs transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        disabled={!hasPlacedPions}
      >
        REFAIRE
      </button>
    </div>
  );
};