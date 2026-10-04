import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CompetitionInfo, LearningConfiguration, MatchInfo, } from '@/lib/interfaces';

const MAX_COMPETITIONS = 10;
const STORAGE_NAME = 'lolomaths-store';
const CURRENT_VERSION = 1;

interface StoredMatchInfo {
  id?: string;
  isgameover?: boolean;
  timeSpent?: number;
  matchNumber?: number;
  niveau?: number;
  numeromatch?: string;
  datedebut?: string | null;
  datefin?: string | null;
  score?: number;
}

interface StoredCompetition {
  id: string;
  datedebut: string;
  datefin: string;
  idConfig: string;
  consultationId: string;
  timeSpent: number;
  displayName?: string;
  isValidated?: boolean;
  niveau?: number;
  matchInfo: StoredMatchInfo[];
}

interface CompetitionState {
  gameConfig: LearningConfiguration | null;
  currentMatchInfo: MatchInfo[];
  competitions: CompetitionInfo[];
  competitionsVersion: number;
  currentConsultationId: string | null;
  gameIsFinished: boolean;
  setGameConfig: (config: LearningConfiguration | null) => void;
  resetGameConfig: () => void;
  setCurrentMatchInfo: (matches: MatchInfo[]) => void;
  appendMatchInfo: (match: MatchInfo) => void;
  updateMatchInfo: (index: number, match: Partial<MatchInfo>) => void;
  clearCurrentMatchInfo: () => void;
  addCompetition: (competition: CompetitionInfo) => void;
  getCompetitionById: (id: string) => CompetitionInfo | undefined;
  removeCompetitionById: (id: string) => boolean;
  getAllCompetitions: () => CompetitionInfo[];
  getLatestCompetitions: (limit?: number) => CompetitionInfo[];
  addMultipleCompetitions: (newCompetitions: CompetitionInfo[]) => void;
  refreshCompetitions: () => void;
  updateCompetitionValidation: (id: string, isValidated: boolean) => void;
  setCurrentConsultationId: (id: string | null) => void;
  setGameIsFinished: (value: boolean) => void;
  resetAll: () => void;
}

// ============================================================
// HELPERS
// ============================================================

const sortByDateDesc = (a: CompetitionInfo, b: CompetitionInfo): number =>
  new Date(b.datedebut).getTime() - new Date(a.datedebut).getTime();

const enforceMaxLimit = (
  competitions: CompetitionInfo[]
): CompetitionInfo[] => {
  if (competitions.length <= MAX_COMPETITIONS) return competitions;
  const sorted = [...competitions].sort(sortByDateDesc);
  return sorted.slice(0, MAX_COMPETITIONS);
};

const compressCompetition = (c: CompetitionInfo): StoredCompetition => ({
  id: c.id,
  datedebut: c.datedebut,
  datefin: c.datefin,
  idConfig: c.idConfig ?? '',
  consultationId: c.consultationId ?? '',
  timeSpent: c.timeSpent ?? 0,
  displayName: c.displayName,
  isValidated: c.isValidated,
  niveau: c.niveau,
  matchInfo: c.matchInfo.map((m) => ({
    id: m.id,
    isgameover: m.isgameover,
    timeSpent: m.timeSpent,
    matchNumber: m.matchNumber,
    niveau: m.niveau,
    numeromatch: m.numeromatch,
    datedebut: m.datedebut,
    datefin: m.datefin,
    score: m.score,
  })),
});

const decompressCompetition = (s: StoredCompetition): CompetitionInfo => ({
  id: s.id,
  datedebut: s.datedebut,
  datefin: s.datefin,
  idConfig: s.idConfig,
  consultationId: s.consultationId,
  timeSpent: s.timeSpent,
  displayName: s.displayName || `N°: ${s.id.slice(-12)}`,
  isValidated: s.isValidated || false,
  niveau: s.niveau ?? 0,
  matchInfo: s.matchInfo.map((m) => ({
    id: m.id,
    isgameover: m.isgameover || false,
    timeSpent: m.timeSpent,
    matchNumber: m.matchNumber || 0,
    niveau: m.niveau || 0,
    numeromatch: m.numeromatch || '',
    datedebut: m.datedebut || null,
    datefin: m.datefin || null,
    score: m.score || 0,
  })),
});

const isStorageNearLimit = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const testKey = '__size_test__';
    const testData = 'x'.repeat(1024 * 1024);
    localStorage.setItem(testKey, testData);
    localStorage.removeItem(testKey);
    return false;
  } catch {
    return true;
  }
};

// ============================================================
// ÉTAT INITIAL
// ============================================================

const INITIAL_STATE = {
  gameConfig: null as LearningConfiguration | null,
  currentMatchInfo: [] as MatchInfo[],
  competitions: [] as CompetitionInfo[],
  competitionsVersion: 0,
  currentConsultationId: null as string | null,
  gameIsFinished: false,
};

// ============================================================
// STORE
// ============================================================

export const useCompetitionStore = create<CompetitionState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      // ----- Config -----
      setGameConfig: (config) => set({ gameConfig: config }),
      resetGameConfig: () => set({ gameConfig: null }),

      // ----- Match en cours -----
      setCurrentMatchInfo: (matches) => set({ currentMatchInfo: matches }),

      appendMatchInfo: (match) =>
        set((state) => ({
          currentMatchInfo: [...state.currentMatchInfo, match],
        })),

      updateMatchInfo: (index, updatedMatch) =>
        set((state) => {
          const newMatches = [...state.currentMatchInfo];
          if (index >= 0 && index < newMatches.length) {
            newMatches[index] = { ...newMatches[index], ...updatedMatch };
          }
          return { currentMatchInfo: newMatches };
        }),

      clearCurrentMatchInfo: () => set({ currentMatchInfo: [] }),

      // ----- Compétitions -----
      addCompetition: (competition) => {
        set((state) => {
          const exists = state.competitions.some(
            (c) => c.id === competition.id
          );
          if (exists) return state;

          let newCompetitions = [competition, ...state.competitions];
          newCompetitions = enforceMaxLimit(newCompetitions);

          if (isStorageNearLimit()) {
            newCompetitions = newCompetitions.slice(
              0,
              MAX_COMPETITIONS - 2
            );
          }

          return {
            competitions: newCompetitions,
            competitionsVersion: state.competitionsVersion + 1,
          };
        });
      },

      getCompetitionById: (id) =>
        get().competitions.find((c) => c.id === id),

      removeCompetitionById: (id) => {
        let removed = false;
        set((state) => {
          const newCompetitions = state.competitions.filter(
            (c) => c.id !== id
          );
          removed = newCompetitions.length !== state.competitions.length;
          return {
            competitions: newCompetitions,
            competitionsVersion: state.competitionsVersion + 1,
          };
        });
        return removed;
      },

      getAllCompetitions: () => get().competitions,

      getLatestCompetitions: (limit = MAX_COMPETITIONS) => {
        const competitions = get().competitions;
        return [...competitions].sort(sortByDateDesc).slice(0, limit);
      },

      addMultipleCompetitions: (newCompetitions) => {
        set((state) => {
          const existingIds = new Set(
            state.competitions.map((c) => c.id)
          );
          const uniqueNew = newCompetitions.filter(
            (c) => !existingIds.has(c.id)
          );
          const all = enforceMaxLimit([
            ...uniqueNew,
            ...state.competitions,
          ]);
          return {
            competitions: all,
            competitionsVersion: state.competitionsVersion + 1,
          };
        });
      },

      refreshCompetitions: () =>
        set((state) => ({
          competitionsVersion: state.competitionsVersion + 1,
        })),

      updateCompetitionValidation: (id, isValidated) =>
        set((state) => ({
          competitions: state.competitions.map((comp) =>
            comp.id === id ? { ...comp, isValidated } : comp
          ),
          competitionsVersion: state.competitionsVersion + 1,
        })),

      // ----- Consultation / état -----
      setCurrentConsultationId: (id) =>
        set({ currentConsultationId: id }),

      setGameIsFinished: (value) => set({ gameIsFinished: value }),

      resetAll: () => set({ ...INITIAL_STATE }),
    }),
    {
      name: STORAGE_NAME,
      storage: createJSONStorage(() => localStorage),
      version: CURRENT_VERSION,
      partialize: (state) => ({
        gameConfig: state.gameConfig,
        competitions: state.competitions.map(compressCompetition),
        competitionsVersion: state.competitionsVersion,
        currentConsultationId: state.currentConsultationId,
        gameIsFinished: state.gameIsFinished,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        try {
          if (state.competitions) {
            state.competitions = (
              state.competitions as unknown as StoredCompetition[]
            ).map(decompressCompetition);
            state.competitions = enforceMaxLimit(state.competitions);
            state.competitionsVersion = Date.now();
          }
        } catch (error) {
          console.error('Error decompressing competitions:', error);
          state.competitions = [];
        }

        state.currentMatchInfo = state.currentMatchInfo || [];
      },
    }
  )
);