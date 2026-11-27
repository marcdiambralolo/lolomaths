import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  GameRecord,
  MatchRecord,
  TournamentRecord,
} from '@/lib/interfaces';

const MAX_TOURNAMENTS = 20;
const STORAGE_NAME = 'lolomaths_history';
const CURRENT_VERSION = 2;

interface HistoryState {
  tournaments: TournamentRecord[];
  lastTournamentId: string | null;
  saveTournament: (tournament: TournamentRecord) => void;
  saveMatch: (tournamentId: string, match: MatchRecord) => void;
  saveGame: (tournamentId: string, matchId: string, game: GameRecord) => void;
  getTournament: (id: string) => TournamentRecord | undefined;
  getLastTournament: () => TournamentRecord | undefined;
  clearHistory: () => void;
  removeTournament: (id: string) => void;
}

const toFiniteNumber = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const computeMatchScore = (jeux: GameRecord[]): number =>
  jeux.reduce((sum, g) => sum + toFiniteNumber(g.notejeu, 0), 0);

const computeTournamentScore = (matchs: MatchRecord[]): number =>
  matchs.reduce((sum, m) => sum + toFiniteNumber(m.score, 0), 0);

const enforceTournamentLimit = (
  tournaments: TournamentRecord[]
): TournamentRecord[] => {
  if (tournaments.length <= MAX_TOURNAMENTS) return tournaments;
  return tournaments.slice(tournaments.length - MAX_TOURNAMENTS);
};

const createFallbackMatch = (
  tournamentId: string,
  matchId: string,
  game: GameRecord
): MatchRecord => ({
  id: matchId,
  tournamentId,
  numordrep: 0,
  numeromatch: '1',
  score: toFiniteNumber(game.notejeu, 0),
  isGameOver: false,
  datedebut: game.dateCreation,
  datefin: null,
  jeux: [game],
});

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      tournaments: [],
      lastTournamentId: null,

      saveTournament: (tournament) => {
        set((state) => {
          const safeMatchs = Array.isArray(tournament.matchs)
            ? tournament.matchs
            : [];
          const exists = state.tournaments.some((t) => t.id === tournament.id);

          const nextTournaments = exists
            ? state.tournaments.map((t) => {
                if (t.id !== tournament.id) return t;
                const mergedMatchs =
                  safeMatchs.length > 0 ? safeMatchs : t.matchs ?? [];
                return {
                  ...t,
                  ...tournament,
                  matchs: mergedMatchs,
                  score:
                    mergedMatchs.length > 0
                      ? computeTournamentScore(mergedMatchs)
                      : toFiniteNumber(tournament.score, toFiniteNumber(t.score, 0)),
                };
              })
            : [
                ...state.tournaments,
                {
                  ...tournament,
                  matchs: safeMatchs,
                  score:
                    safeMatchs.length > 0
                      ? computeTournamentScore(safeMatchs)
                      : toFiniteNumber(tournament.score, 0),
                },
              ];

          return {
            tournaments: enforceTournamentLimit(nextTournaments),
            lastTournamentId: tournament.id,
          };
        });
      },

      saveMatch: (tournamentId, match) => {
        set((state) => ({
          tournaments: state.tournaments.map((t) => {
            if (t.id !== tournamentId) return t;

            const currentMatchs = Array.isArray(t.matchs) ? t.matchs : [];
            const existing = currentMatchs.find((m) => m.id === match.id);

            const nextMatchs = !existing
              ? [...currentMatchs, match]
              : currentMatchs.map((m) => {
                  if (m.id !== match.id) return m;
                  const mergedJeux =
                    Array.isArray(match.jeux) && match.jeux.length > 0
                      ? match.jeux
                      : existing.jeux ?? [];
                  return {
                    ...existing,
                    ...match,
                    jeux: mergedJeux,
                    score:
                      typeof match.score === 'number' &&
                      Number.isFinite(match.score)
                        ? match.score
                        : computeMatchScore(mergedJeux),
                  };
                });

            return {
              ...t,
              matchs: nextMatchs,
              score: computeTournamentScore(nextMatchs),
            };
          }),
        }));
      },

      saveGame: (tournamentId, matchId, game) => {
        set((state) => ({
          tournaments: state.tournaments.map((t) => {
            if (t.id !== tournamentId) return t;

            const currentMatchs = Array.isArray(t.matchs) ? t.matchs : [];
            const matchExists = currentMatchs.some((m) => m.id === matchId);

            const nextMatchs = !matchExists
              ? [
                  ...currentMatchs,
                  createFallbackMatch(tournamentId, matchId, game),
                ]
              : currentMatchs.map((m) => {
                  if (m.id !== matchId) return m;
                  const currentJeux = Array.isArray(m.jeux) ? m.jeux : [];
                  const gameExists = currentJeux.some((j) => j.id === game.id);
                  const jeux = gameExists
                    ? currentJeux.map((j) => (j.id === game.id ? game : j))
                    : [...currentJeux, game];

                  return {
                    ...m,
                    jeux,
                    score: computeMatchScore(jeux),
                  };
                });

            return {
              ...t,
              matchs: nextMatchs,
              score: computeTournamentScore(nextMatchs),
            };
          }),
        }));
      },

      getTournament: (id) => get().tournaments.find((t) => t.id === id),

      getLastTournament: () => {
        const { tournaments, lastTournamentId } = get();
        if (lastTournamentId) {
          const found = tournaments.find((t) => t.id === lastTournamentId);
          if (found) return found;
        }
        return tournaments[tournaments.length - 1];
      },

      clearHistory: () => {
        set({ tournaments: [], lastTournamentId: null });
      },

      removeTournament: (id) => {
        set((state) => {
          const remaining = state.tournaments.filter((t) => t.id !== id);
          const nextLastId =
            state.lastTournamentId === id
              ? remaining[remaining.length - 1]?.id ?? null
              : state.lastTournamentId;

          return {
            tournaments: remaining,
            lastTournamentId: nextLastId,
          };
        });
      },
    }),
    {
      name: STORAGE_NAME,
      storage: createJSONStorage(() => localStorage),
      version: CURRENT_VERSION,
      partialize: (state) => ({
        tournaments: state.tournaments,
        lastTournamentId: state.lastTournamentId,
      }),
      migrate: (persistedState) => {
        const state = (persistedState ?? {}) as Partial<HistoryState>;
        const safeTournaments = Array.isArray(state.tournaments)
          ? state.tournaments.map((t) => ({
              ...t,
              matchs: Array.isArray(t.matchs)
                ? t.matchs.map((m) => ({
                    ...m,
                    jeux: Array.isArray(m.jeux) ? m.jeux : [],
                  }))
                : [],
            }))
          : [];

        return {
          tournaments: safeTournaments,
          lastTournamentId: state.lastTournamentId ?? null,
        };
      },
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (!Array.isArray(state.tournaments)) {
          state.tournaments = [];
        }
      },
    }
  )
);