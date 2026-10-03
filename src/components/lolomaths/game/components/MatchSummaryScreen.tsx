'use client';

import React, { useMemo } from 'react';
import { useCompetitionStore } from '@/lib/store/useCompetitionStore';
import { useGameHistory } from '@/hooks/lolomaths/game/useGameHistory';

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
  const scoreTotal = useCompetitionStore((state) => state.scoreTotal);
  const cnbjeu = useCompetitionStore((state) => state.cnbjeu);
  const nombredejeu = useCompetitionStore((state) => state.nombredejeu);

  const { gameHistory } = useGameHistory();

  const averageScore = useMemo(
    () => (cnbjeu > 0 ? (scoreTotal / cnbjeu).toFixed(1) : '0'),
    [scoreTotal, cnbjeu]
  );

  return (
    <div className="p-4 flex flex-col gap-4 text-center shadow-2xl max-w-lg mx-auto my-auto">
      <h3 className="text-2xl font-black text-amber-400">🏆 Match Terminé !</h3>

      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-slate-300 text-sm">
        {isTimeUp
          ? '⏰ Temps écoulé ! Bravo pour votre participation.'
          : '✅ Match validé avec succès !'}
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-500 block">Score Final</span>
          <span className="text-2xl font-black text-emerald-400">
            {scoreTotal} pts
          </span>
        </div>
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-500 block">Jeux Joués</span>
          <span className="text-2xl font-black text-sky-400">
            {cnbjeu}/{nombredejeu}
          </span>
        </div>
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 col-span-2">
          <span className="text-xs text-slate-500 block">Moyenne par jeu</span>
          <span className="text-xl font-black text-amber-400">
            {averageScore} pts
          </span>
        </div>
      </div>

      {/* Résumé détaillé des jeux joués */}
      {gameHistory.length > 0 && (
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-left">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              Détail des jeux
            </span>
          </div>
          <div className="max-h-56 overflow-y-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900/50 text-slate-500">
                <tr>
                  <th className="px-3 py-1.5">#</th>
                  <th className="px-3 py-1.5">Combinaison</th>
                  <th className="px-3 py-1.5 text-right">Score</th>
                </tr>
              </thead>
              <tbody>
                {gameHistory.map((g, idx) => (
                  <tr
                    key={idx}
                    className="border-t border-slate-800/50 hover:bg-slate-900/40"
                  >
                    <td className="px-3 py-1.5 text-slate-500">
                      J{idx + 1}
                    </td>
                    <td className="px-3 py-1.5 text-slate-300">
                      {g.combination || 'N/A'}
                    </td>
                    <td
                      className={`px-3 py-1.5 text-right font-bold ${
                        g.score >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {g.score >= 0 ? `+${g.score.toFixed(1)}` : g.score.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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