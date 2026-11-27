'use client';
import { GameRecord, MatchRecord } from '@/lib/interfaces';
import { useHistoryStore } from '@/lib/store/useHistoryStore';
import React, { memo, useMemo } from 'react';

function formatDuration(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  return `${h}h${m.toString().padStart(2, '0')}m${s.toString().padStart(2, '0')}s`;
}

function computeDuration(start: string | null, end: string | null): number {
  if (!start || !end) return 0;
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  if (Number.isNaN(s) || Number.isNaN(e)) return 0;
  return Math.max(0, Math.floor((e - s) / 1000));
}

function computeTournamentDuration(
  datedebut: string | null,
  datefin: string | null,
  matchs: MatchRecord[]
): number {
  const direct = computeDuration(datedebut, datefin);
  if (direct > 0) return direct;

  return matchs.reduce(
    (sum, m) => sum + computeDuration(m.datedebut, m.datefin),
    0
  );
} 

export const MatchSummaryScreen: React.FC = memo(() => {

  const tournaments = useHistoryStore((s) => s.tournaments);
  const lastTournamentId = useHistoryStore((s) => s.lastTournamentId);

  const lastTournament = useMemo(() => {
    if (lastTournamentId) {
      const found = tournaments.find((t) => t.id === lastTournamentId);
      if (found) return found;
    }
    return tournaments[tournaments.length - 1];
  }, [tournaments, lastTournamentId]);

  const stats = useMemo(() => {
    if (!lastTournament) {
      return {         
        duration: 0,
        isTournamentOver: false,
      };
    }

    const duration = computeTournamentDuration(
      lastTournament.datedebut,
      lastTournament.datefin,
      lastTournament.matchs
    );

    return {
      duration,
      isTournamentOver: lastTournament.isgameover,
    };
  }, [lastTournament]);

  const allGames: GameRecord[] = useMemo(() => {
    if (!lastTournament) return [];
    return lastTournament.matchs.flatMap((m: MatchRecord) => m.jeux);
  }, [lastTournament]);

  if (!lastTournament) {
    return (
      <div className="p-4 text-center text-slate-500 italic">
        Aucun tournoi enregistré.
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-4 text-center shadow-2xl max-w-lg mx-auto my-auto">
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
                  <th className="px-3 py-1.5 text-right">note</th>
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
                      className={`px-3 py-1.5 text-right font-bold ${g.notejeu >= 0
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
      {/* Statistiques globales */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 col-span-2">
          <span className="text-xs text-slate-500 block">Durée totale</span>
          <span className="text-xl font-black text-slate-300">
            {formatDuration(stats.duration)}
          </span>
        </div>
      </div>
    </div>
  );
});

MatchSummaryScreen.displayName = 'MatchSummaryScreen';