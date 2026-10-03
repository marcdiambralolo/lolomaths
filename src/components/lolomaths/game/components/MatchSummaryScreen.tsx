import React from 'react';
import { useCompetitionStore } from '@/lib/store/useCompetitionStore';

interface MatchSummaryScreenProps {
  isTimeUp: boolean;
  onRestart: () => void;
  onShowDetails: () => void;
}

export const MatchSummaryScreen: React.FC<MatchSummaryScreenProps> = ({
  isTimeUp,
  onRestart,
  onShowDetails,
}) => {
  // Sélecteurs ciblés (évite les re-renders inutiles)
  const scoreTotal = useCompetitionStore((state) => state.scoreTotal);
  const cnbjeu = useCompetitionStore((state) => state.cnbjeu);

  const averageScore =
    cnbjeu > 0 ? (scoreTotal / cnbjeu).toFixed(1) : '0';

  return (
    <div className="p-6 flex flex-col gap-6 text-center shadow-2xl max-w-lg mx-auto my-auto">
      <h3 className="text-2xl font-black text-amber-400">🏆 Match Terminé !</h3>

      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-slate-300 text-sm">
        {isTimeUp
          ? '⏰ Temps écoulé ! Bravo pour votre participation.'
          : '✅ Match validé avec succès !'}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-500 block">Score Final</span>
          <span className="text-2xl font-black text-emerald-400">
            {scoreTotal} pts
          </span>
        </div>
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-500 block">Jeux Joués</span>
          <span className="text-2xl font-black text-sky-400">{cnbjeu}</span>
        </div>
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 col-span-2">
          <span className="text-xs text-slate-500 block">Moyenne par jeu</span>
          <span className="text-xl font-black text-amber-400">
            {averageScore} pts
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={onRestart}
          className="py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-2xl transition-all shadow-lg hover:scale-105 active:scale-95"
        >
          🔄 RECOMMENCER UN MATCH
        </button>
        <button
          onClick={onShowDetails}
          className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-all text-sm"
        >
          📊 Voir les détails
        </button>
      </div>
    </div>
  );
};