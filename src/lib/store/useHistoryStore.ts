import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { GameRecord, MatchRecord, TournamentRecord, } from '@/lib/interfaces';

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
): TournamentRecord[] =>
  tournaments.length <= MAX_TOURNAMENTS
    ? tournaments
    : tournaments.slice(0, MAX_TOURNAMENTS);

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      tournaments: [],
      lastTournamentId: null,

      saveTournament: (tournament) => {
        set((state) => {
          const exists = state.tournaments.some(
            (t) => t.id === tournament.id
          );
          const nextTournaments = exists
            ? state.tournaments.map((t) =>
              t.id === tournament.id ? tournament : t
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
            const exists = t.matchs.some((m) => m.id === match.id);
            const matchs = exists
              ? t.matchs.map((m) => (m.id === match.id ? match : m))
              : [...t.matchs, match];
            return { ...t, matchs };
          }),
        }));
      },

      saveGame: (tournamentId, matchId, game) => {
        set((state) => ({
          tournaments: state.tournaments.map((t) => {
            if (t.id !== tournamentId) return t;
            return {
              ...t,
              matchs: t.matchs.map((m) => {
                if (m.id !== matchId) return m;
                const exists = m.jeux.some((j) => j.id === game.id);
                const jeux = exists
                  ? m.jeux.map((j) => (j.id === game.id ? game : j))
                  : [...m.jeux, game];
                return { ...m, jeux };
              }),
            };
          }),
        }));
      },

      getTournament: (id) =>
        get().tournaments.find((t) => t.id === id),

      getLastTournament: () => {
        const { tournaments, lastTournamentId } = get();
        if (!lastTournamentId) return tournaments[tournaments.length - 1];
        return tournaments.find((t) => t.id === lastTournamentId);
      },

      clearHistory: () => {
        set({ tournaments: [], lastTournamentId: null });
      },

      removeTournament: (id) => {
        set((state) => ({
          tournaments: state.tournaments.filter((t) => t.id !== id),
          lastTournamentId:
            state.lastTournamentId === id
              ? null
              : state.lastTournamentId,
        }));
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