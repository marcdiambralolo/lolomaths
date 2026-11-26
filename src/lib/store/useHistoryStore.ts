import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  GameRecord,
  MatchRecord,
  TournamentRecord,
} from '@/lib/interfaces';

const MAX_TOURNAMENTS = 20;
const STORAGE_NAME = 'lolomaths_history';
const CURRENT_VERSION = 1;

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
  score: game.notejeu,
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
          const exists = state.tournaments.some((t) => t.id === tournament.id);
          const nextTournaments = exists
            ? state.tournaments.map((t) =>
                t.id === tournament.id
                  ? {
                      ...t,
                      ...tournament,
                      matchs:
                        tournament.matchs.length > 0
                          ? tournament.matchs
                          : t.matchs,
                    }
                  : t
              )
            : [...state.tournaments, tournament];

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

            const existing = t.matchs.find((m) => m.id === match.id);
            if (!existing) {
              return {
                ...t,
                matchs: [...t.matchs, match],
              };
            }

            const mergedMatch: MatchRecord = {
              ...existing,
              ...match,
              jeux: match.jeux.length > 0 ? match.jeux : existing.jeux,
            };

            return {
              ...t,
              matchs: t.matchs.map((m) => (m.id === match.id ? mergedMatch : m)),
            };
          }),
        }));
      },

      saveGame: (tournamentId, matchId, game) => {
        set((state) => ({
          tournaments: state.tournaments.map((t) => {
            if (t.id !== tournamentId) return t;

            const matchExists = t.matchs.some((m) => m.id === matchId);
            if (!matchExists) {
              return {
                ...t,
                matchs: [...t.matchs, createFallbackMatch(tournamentId, matchId, game)],
              };
            }

            return {
              ...t,
              matchs: t.matchs.map((m) => {
                if (m.id !== matchId) return m;
                const gameExists = m.jeux.some((j) => j.id === game.id);
                const jeux = gameExists
                  ? m.jeux.map((j) => (j.id === game.id ? game : j))
                  : [...m.jeux, game];

                return {
                  ...m,
                  jeux,
                };
              }),
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
    }
  )
);