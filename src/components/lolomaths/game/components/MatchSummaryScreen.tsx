'use client';

import {
  GameRecord,
  MatchRecord
} from '@/lib/interfaces';
import { useHistoryStore } from '@/lib/store/useHistoryStore';
import { useRouter } from 'next/navigation';
import React, { memo, useMemo } from 'react';

// ============================================================
// HELPERS
// ============================================================

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h${m.toString().padStart(2, '0')}m${s.toString().padStart(2, '0')}s`;
}

function computeDuration(start: string | null, end: string | null): number {
  if (!start || !end) return 0;
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  if (Number.isNaN(s) || Number.isNaN(e)) return 0;
  return Math.max(0, Math.floor((e - s) / 1000));
}

// ============================================================
// COMPOSANT
// ============================================================

export const MatchSummaryScreen: React.FC = memo(() => {
  const router = useRouter();

  // ✅ Lecture depuis l'historique local
  const lastTournament = useHistoryStore((s) => s.getLastTournament());

  // ----- Calculs mémoïsés -----
  const stats = useMemo(() => {
    if (!lastTournament) {
      return {
        totalScore: 0,
        totalMatches: 0,
        totalGames: 0,
        averageScore: 0,
        duration: 0,
        isTournamentOver: false,
      };
    }

    const totalScore = lastTournament.score;
    const totalMatches = lastTournament.matchs.length;
    const totalGames = lastTournament.matchs.reduce(
      (acc, m) => acc + m.jeux.length,
      0
    );
    const averageScore =
      totalGames > 0 ? totalScore / totalGames : 0;
    const duration = computeDuration(
      lastTournament.datedebut,
      lastTournament.datefin
    );

    return {
      totalScore,
      totalMatches,
      totalGames,
      averageScore,
      duration,
      isTournamentOver: lastTournament.isgameover,
    };
  }, [lastTournament]);

  // ----- Si aucun tournoi -----
  if (!lastTournament) {
    return (
      <div className="p-4 text-center text-slate-500 italic">
        Aucun tournoi enregistré.
      </div>
    );
  }

  // ----- Liste de tous les jeux (tous matchs confondus) -----
  const allGames: GameRecord[] = lastTournament.matchs.flatMap(
    (m: MatchRecord) => m.jeux
  );

  // ----- Navigation -----
  const handleNextAction = () => {
    if (stats.isTournamentOver) {
      router.push(`/star/tournoi/${lastTournament.id}`);
    } else {
      router.push('/star/competition');
    }
  };

  const handleMenu = () => router.push('/');

  return (
    <div className="p-4 flex flex-col gap-4 text-center shadow-2xl max-w-lg mx-auto my-auto">
      <h3 className="text-2xl font-black text-amber-400">
        🏆 {stats.isTournamentOver ? 'Tournoi Terminé !' : 'Match Terminé !'}
      </h3>

      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-slate-300 text-sm">
        {stats.isTournamentOver
          ? '✅ Tous les matchs ont été joués.'
          : '✅ Match validé avec succès !'}
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-500 block">Score Total</span>
          <span className="text-2xl font-black text-emerald-400">
            {stats.totalScore} pts
          </span>
        </div>
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-500 block">Jeux Joués</span>
          <span className="text-2xl font-black text-sky-400">
            {stats.totalGames}
          </span>
        </div>
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-500 block">Matchs</span>
          <span className="text-2xl font-black text-purple-400">
            {stats.totalMatches}/{lastTournament.nbmatch}
          </span>
        </div>
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-500 block">Moyenne / Jeu</span>
          <span className="text-2xl font-black text-amber-400">
            {stats.averageScore.toFixed(1)}
          </span>
        </div>
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 col-span-2">
          <span className="text-xs text-slate-500 block">Durée totale</span>
          <span className="text-xl font-black text-slate-300">
            {formatDuration(stats.duration)}
          </span>
        </div>
      </div>

      {/* Détail des jeux */}
      {allGames.length > 0 && (
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-left">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              Détail des jeux ({allGames.length})
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
                {allGames.map((g, idx) => (
                  <tr
                    key={g.id ?? idx}
                    className="border-t border-slate-800/50 hover:bg-slate-900/40"
                  >
                    <td className="px-3 py-1.5 text-slate-500">
                      J{idx + 1}
                    </td>
                    <td className="px-3 py-1.5 text-slate-300">
                      {g.combinaison || 'N/A'}
                    </td>
                    <td
                      className={`px-3 py-1.5 text-right font-bold ${
                        g.notejeu >= 0
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {g.notejeu >= 0
                        ? `+${g.notejeu.toFixed(1)}`
                        : g.notejeu.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Boutons */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handleNextAction}
          className="py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-2xl transition-all shadow-lg hover:scale-105 active:scale-95"
        >
          {stats.isTournamentOver
            ? '📊 Voir le tournoi complet'
            : '🔄 Match suivant'}
        </button>
        <button
          type="button"
          onClick={handleMenu}
          className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-all text-sm"
        >
          🏠 Retour au menu
        </button>
      </div>
    </div>
  );
});

MatchSummaryScreen.displayName = 'MatchSummaryScreen';