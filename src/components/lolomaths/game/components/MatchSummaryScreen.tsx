'use client';

import { GameRecord, MatchRecord } from '@/lib/interfaces';
import { useHistoryStore } from '@/lib/store/useHistoryStore';
import React, { memo, useMemo } from 'react';

function toSafeNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function formatDuration(seconds: number): string {
  const safe = Math.max(0, Math.floor(toSafeNumber(seconds, 0)));
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  return `${h}h${m.toString().padStart(2, '0')}m${s.toString().padStart(2, '0')}s`;
}

function computeDuration(
  start: string | null | undefined,
  end: string | null | undefined,
  fallbackEndMs = Date.now()
): number {
  if (!start) return 0;
  const s = new Date(start).getTime();
  if (Number.isNaN(s)) return 0;

  const parsedEnd = end ? new Date(end).getTime() : fallbackEndMs;
  const e = Number.isNaN(parsedEnd) ? fallbackEndMs : parsedEnd;

  return Math.max(0, Math.floor((e - s) / 1000));
}

function computeTournamentDuration(
  datedebut: string | null | undefined,
  datefin: string | null | undefined,
  matchs: MatchRecord[]
): number {
  const safeMatchs = Array.isArray(matchs) ? matchs : [];
  const direct = computeDuration(
    datedebut,
    datefin ?? (datedebut ? new Date().toISOString() : null)
  );
  if (direct > 0) return direct;

  return safeMatchs.reduce(
    (sum, m) =>
      sum +
      computeDuration(
        m.datedebut,
        m.datefin ?? (m.datedebut ? new Date().toISOString() : null)
      ),
    0
  );
}

export const MatchSummaryScreen: React.FC = memo(() => {
  const tournaments = useHistoryStore((s) => s.tournaments);
  const lastTournamentId = useHistoryStore((s) => s.lastTournamentId);

  const lastTournament = useMemo(() => {
    const safeTournaments = Array.isArray(tournaments) ? tournaments : [];
    if (lastTournamentId) {
      const found = safeTournaments.find((t) => t.id === lastTournamentId);
      if (found) return found;
    }
    return safeTournaments[safeTournaments.length - 1];
  }, [tournaments, lastTournamentId]);

  const stats = useMemo(() => {
    if (!lastTournament) {
      return {
        duration: 0,
        isTournamentOver: false,
      };
    }

    const safeMatchs = Array.isArray(lastTournament.matchs)
      ? lastTournament.matchs
      : [];

    const duration = computeTournamentDuration(
      lastTournament.datedebut,
      lastTournament.datefin,
      safeMatchs
    );

    return {
      duration,
      isTournamentOver: Boolean(
        lastTournament.isGameOver ?? lastTournament.isgameover
      ),
    };
  }, [lastTournament]);

  const allGames: GameRecord[] = useMemo(() => {
    if (!lastTournament || !Array.isArray(lastTournament.matchs)) return [];
    return lastTournament.matchs.flatMap((m: MatchRecord) =>
      Array.isArray(m.jeux) ? m.jeux : []
    );
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
      {allGames.length > 0 && (
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-left flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              Détail des jeux ({allGames.length})
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              {stats.isTournamentOver ? 'Terminé' : 'En cours'}
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
                {allGames.map((g, idx) => {
                  const note = toSafeNumber(g.notejeu, 0);
                  return (
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
                          note >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {note >= 0 ? `+${note.toFixed(1)}` : note.toFixed(1)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

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