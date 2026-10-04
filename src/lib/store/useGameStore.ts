import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  calculateGameResult,
  collectSequence,
  createInitialGrid,
  getNextCase,
  getPlacedPions,
  isOperateur,
  isStartCaseCovered,
  isValidSequence,
  radlist,
  sortSequence,
  tpencadre,
  validateCombination,
  RACK_NUMBERS_COUNT,
  RACK_OPERATORS_COUNT,
} from '@/components/lolomaths/game/competitionEngine';
import {
  Dtfil,
  GameResult,
  Sens,
  StateCase,
  TypeCase,
  UneCase,
} from '@/lib/interfaces';

// ============================================================
// CONSTANTES
// ============================================================

const STORAGE_NAME = 'lolomaths-game';
const CURRENT_VERSION = 1;

// ============================================================
// TYPES
// ============================================================

interface DirectionsValid {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
}

export interface TournamentMeta {
  nomjoueur: string;
  numtournoi: string;
  niveau: Dtfil;
  couleurs: number;
  nombredejeu: number;
  nbmatch: number;
  tempsmatch: string;
  tpsglobal: number;
}

interface GameState {
  // État de jeu
  numeromat: string;
  grid: UneCase[][];
  flatGrid: UneCase[];
  numbers: UneCase[];
  operators: UneCase[];
  lastConfirmedResult: GameResult | null;
  pions: UneCase[];
  preGeneratedNumbers: string[][];
  preGeneratedOperators: string[][];
  rackIndex: number;
  gameResults: (GameResult | null)[];
  niveau: Dtfil;
  cnbjeu: number;
  nombredejeu: number;
  scoreTotal: number;
  directionsValid: DirectionsValid;
  isMatchOver: boolean;
  // Identité tournoi / match
  currentTournamentId: string | null;
  currentMatchId: string | null;
  tournamentMeta: TournamentMeta | null;
  matchIndex: number;
  numeromatch: string;

  // Actions
  initGame: (
    numbersTxt: string[],
    operatorsTxt: string[],
    niveau?: Dtfil,
    numeromat?: string,
    listecaseRef?: string[],
    nombredejeu?: number
  ) => void;
  nextJeu: () => void;
  handleCaseClick: (targetCase: UneCase) => void;
  resetPions: () => void;
  calculateScores: () => void;
  confirmCalculation: (resultIndex: number) => void;
  validerCoupDirection?: (resultIndex: number) => void;
  resetToInitialState: () => void;
  startTournament: (meta: TournamentMeta) => void;
  startMatch: (numeromatch: string) => void;
  endMatch: () => void;
  endTournament: () => void;
}

// ============================================================
// HELPERS
// ============================================================

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function splitIntoRacks(
  numbers: string[],
  operators: string[]
): { numbersRacks: string[][]; operatorsRacks: string[][] } {
  const numbersRacks: string[][] = [];
  const operatorsRacks: string[][] = [];

  const numCopy = [...numbers];
  while (numCopy.length >= RACK_NUMBERS_COUNT) {
    numbersRacks.push(numCopy.splice(0, RACK_NUMBERS_COUNT));
  }
  if (numCopy.length > 0) numbersRacks.push(numCopy);

  const opCopy = [...operators];
  while (opCopy.length >= RACK_OPERATORS_COUNT) {
    operatorsRacks.push(opCopy.splice(0, RACK_OPERATORS_COUNT));
  }
  if (opCopy.length > 0) operatorsRacks.push(opCopy);

  return { numbersRacks, operatorsRacks };
}

function buildPionsFromRack(
  numbersTxt: string[],
  operatorsTxt: string[]
): { numbers: UneCase[]; operators: UneCase[]; pions: UneCase[] } {
  const numbers: UneCase[] = numbersTxt.map((txt, index) => ({
    ncase: -1,
    indi: 0,
    indj: 0,
    txt,
    itxt: txt,
    etat: StateCase.Pla,
    tca: TypeCase.PionChiffre,
    placep: index,
  }));

  const operators: UneCase[] = operatorsTxt.map((txt, index) => ({
    ncase: -1,
    indi: 0,
    indj: 0,
    txt,
    itxt: txt,
    etat: StateCase.Pla,
    tca: TypeCase.PionOperateur,
    placep: numbersTxt.length + index,
  }));

  return { numbers, operators, pions: [...numbers, ...operators] };
}

function clearTargets(grid: UneCase[][]): UneCase[][] {
  return grid.map((row) =>
    row.map((cell) => (cell.isTarget ? { ...cell, isTarget: false } : cell))
  );
}

function resetSelections(
  grid: UneCase[][],
  pions: UneCase[]
): { grid: UneCase[][]; pions: UneCase[] } {
  const nextGrid = grid.map((row) =>
    row.map((cell) => {
      const clearedTarget = cell.isTarget ? { ...cell, isTarget: false } : cell;
      return clearedTarget.etat === StateCase.Choi
        ? { ...clearedTarget, etat: StateCase.Pla }
        : clearedTarget;
    })
  );
  const nextPions = pions.map((p) =>
    p.etat === StateCase.Choi ? { ...p, etat: StateCase.Pla } : p
  );
  return { grid: nextGrid, pions: nextPions };
}

function selectPionInRack(pions: UneCase[], placep: number): UneCase[] {
  return pions.map((p) =>
    p.placep === placep
      ? { ...p, etat: StateCase.Choi }
      : p.etat === StateCase.Choi
        ? { ...p, etat: StateCase.Pla }
        : p
  );
}

function selectCaseOnGrid(grid: UneCase[][], ncase: number): UneCase[][] {
  return grid.map((row) =>
    row.map((cell) => {
      const clearedTarget = cell.isTarget ? { ...cell, isTarget: false } : cell;
      if (clearedTarget.ncase === ncase) {
        return { ...clearedTarget, etat: StateCase.Choi };
      }
      return clearedTarget.etat === StateCase.Choi
        ? { ...clearedTarget, etat: StateCase.Pla }
        : clearedTarget;
    })
  );
}

function placePionOnGrid(
  grid: UneCase[][],
  ncase: number,
  pion: UneCase
): UneCase[][] {
  return grid.map((row) =>
    row.map((cell) =>
      cell.ncase === ncase
        ? {
          ...cell,
          txt: pion.txt,
          etat: StateCase.Pla,
          placep: pion.placep,
          isTarget: false,
        }
        : cell
    )
  );
}

function removePionFromGrid(grid: UneCase[][], ncase: number): UneCase[][] {
  return grid.map((row) =>
    row.map((cell) =>
      cell.ncase === ncase
        ? {
          ...cell,
          txt: cell.itxt,
          etat: StateCase.Cre,
          placep: undefined,
          isTarget: false,
        }
        : cell
    )
  );
}

function movePionOnGrid(
  grid: UneCase[][],
  fromNcase: number,
  toNcase: number
): UneCase[][] {
  let movedTxt = '';
  let movedPlacep: number | undefined;
  let movedItxt = '';

  const intermediate = grid.map((row) =>
    row.map((cell) => {
      if (cell.ncase === fromNcase) {
        movedTxt = cell.txt;
        movedPlacep = cell.placep;
        movedItxt = cell.itxt;
        return {
          ...cell,
          txt: cell.itxt,
          etat: StateCase.Cre,
          placep: undefined,
          isTarget: false,
        };
      }
      return cell;
    })
  );

  return intermediate.map((row) =>
    row.map((cell) =>
      cell.ncase === toNcase
        ? {
          ...cell,
          txt: movedTxt,
          itxt: movedItxt,
          etat: StateCase.Pla,
          placep: movedPlacep,
          isTarget: false,
        }
        : cell
    )
  );
}

// ============================================================
// ÉTAT INITIAL
// ============================================================

const INITIAL_STATE = {
  numeromat: '',
  grid: [] as UneCase[][],
  flatGrid: [] as UneCase[],
  numbers: [] as UneCase[],
  operators: [] as UneCase[],
  pions: [] as UneCase[],
  preGeneratedNumbers: [] as string[][],
  preGeneratedOperators: [] as string[][],
  rackIndex: 0,
  gameResults: [null, null, null, null] as (GameResult | null)[],
  niveau: Dtfil.Sen,
  cnbjeu: 0,
  nombredejeu: 20,
  scoreTotal: 0,
  directionsValid: { left: false, right: false, up: false, down: false },
  lastConfirmedResult: null as GameResult | null,
  isMatchOver: false,

  currentTournamentId: null as string | null,
  currentMatchId: null as string | null,
  tournamentMeta: null as TournamentMeta | null,
  matchIndex: 0,
  numeromatch: '',
};

// ============================================================
// STORE
// ============================================================

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      // ============================================================
      // ACTIONS DE JEU
      // ============================================================

      initGame: (
        numbersTxt,
        operatorsTxt,
        niveau = Dtfil.Sen,
        numeromat = '123456789',
        listecaseRef,
        nombredejeu = 20
      ) => {
        const grid = createInitialGrid(numeromat, listecaseRef);

        const shuffledNumbers = radlist(numbersTxt, numeromat);
        const shuffledOperators = radlist(operatorsTxt, numeromat);

        const { numbersRacks, operatorsRacks } = splitIntoRacks(
          shuffledNumbers,
          shuffledOperators
        );

        const firstNumbers = numbersRacks[0] ?? [];
        const firstOperators = operatorsRacks[0] ?? [];

        const { numbers, operators, pions } = buildPionsFromRack(
          firstNumbers,
          firstOperators
        );

        set({
          numeromat,
          grid,
          flatGrid: grid.flat(),
          numbers,
          operators,
          pions,
          preGeneratedNumbers: numbersRacks,
          preGeneratedOperators: operatorsRacks,
          rackIndex: 0,
          niveau,
          cnbjeu: 0,
          nombredejeu,
          scoreTotal: 0,
          gameResults: [null, null, null, null],
          lastConfirmedResult: null,
          directionsValid: {
            left: false,
            right: false,
            up: false,
            down: false,
          },
          isMatchOver: false,
        });
      },

      nextJeu: () => {
        const {
          preGeneratedNumbers,
          preGeneratedOperators,
          rackIndex,
          grid,
          cnbjeu,
          nombredejeu,
        } = get();

        const nextIndex = rackIndex + 1;
        const nextCnbjeu = cnbjeu + 1;
        const matchOver = nextCnbjeu >= nombredejeu;

        const nextGrid = grid.map((row) =>
          row.map((cell) => {
            if (cell.etat === StateCase.Lo) {
              return { ...cell, isTarget: false };
            }
            return {
              ...cell,
              txt: cell.itxt,
              etat: StateCase.Cre,
              placep: undefined,
              isTarget: false,
            };
          })
        );

        if (matchOver) {
          set({
            grid: nextGrid,
            flatGrid: nextGrid.flat(),
            numbers: [],
            operators: [],
            pions: [],
            rackIndex: nextIndex,
            cnbjeu: nextCnbjeu,
            gameResults: [null, null, null, null],
            directionsValid: {
              left: false,
              right: false,
              up: false,
              down: false,
            },
            isMatchOver: true,
          });
          return;
        }

        const nextNumbers = preGeneratedNumbers[nextIndex] ?? [];
        const nextOperators = preGeneratedOperators[nextIndex] ?? [];
        const { numbers, operators, pions } = buildPionsFromRack(
          nextNumbers,
          nextOperators
        );

        set({
          grid: nextGrid,
          flatGrid: nextGrid.flat(),
          numbers,
          operators,
          pions,
          rackIndex: nextIndex,
          cnbjeu: nextCnbjeu,
          gameResults: [null, null, null, null],
          directionsValid: {
            left: false,
            right: false,
            up: false,
            down: false,
          },
          isMatchOver: false,
        });
      },

      handleCaseClick: (targetCase: UneCase) => {
        const { pions, grid, flatGrid, isMatchOver } = get();

        if (isMatchOver) return;

        const selectedPionInRack = pions.find(
          (p) => p.etat === StateCase.Choi
        );
        const selectedCaseOnGrid = flatGrid.find(
          (c) => c.etat === StateCase.Choi && c.tca === TypeCase.Plateau
        );

        if (
          targetCase.tca === TypeCase.PionChiffre ||
          targetCase.tca === TypeCase.PionOperateur
        ) {
          switch (targetCase.etat) {
            case StateCase.Pla: {
              const nextPions = selectPionInRack(pions, targetCase.placep!);
              const { grid: nextGrid } = resetSelections(grid, pions);
              set({
                grid: nextGrid,
                flatGrid: nextGrid.flat(),
                pions: nextPions,
              });
              return;
            }

            case StateCase.Choi:
              return;

            case StateCase.Cre: {
              if (!selectedCaseOnGrid) return;

              const pionOfCase = pions.find(
                (p) => p.placep === selectedCaseOnGrid.placep
              );
              if (!pionOfCase) return;

              const nextGrid = removePionFromGrid(
                grid,
                selectedCaseOnGrid.ncase
              );
              const nextPions = pions.map((p) =>
                p.placep === pionOfCase.placep
                  ? { ...p, etat: StateCase.Pla }
                  : p.etat === StateCase.Choi
                    ? { ...p, etat: StateCase.Pla }
                    : p
              );

              set({
                grid: nextGrid,
                flatGrid: nextGrid.flat(),
                pions: nextPions,
              });
              get().calculateScores();
              return;
            }

            default:
              return;
          }
        }

        if (targetCase.tca === TypeCase.Plateau) {
          if (targetCase.etat === StateCase.Lo) return;

          if (targetCase.etat === StateCase.Cre) {
            if (selectedPionInRack) {
              const nextGrid = placePionOnGrid(
                grid,
                targetCase.ncase,
                selectedPionInRack
              );
              const nextPions = pions.map((p) =>
                p.placep === selectedPionInRack.placep
                  ? { ...p, etat: StateCase.Cre }
                  : p
              );
              set({
                grid: nextGrid,
                flatGrid: nextGrid.flat(),
                pions: nextPions,
              });
              get().calculateScores();
              return;
            }

            if (selectedCaseOnGrid) {
              const nextGrid = movePionOnGrid(
                grid,
                selectedCaseOnGrid.ncase,
                targetCase.ncase
              );
              set({
                grid: nextGrid,
                flatGrid: nextGrid.flat(),
              });
              get().calculateScores();
              return;
            }
            return;
          }

          if (
            targetCase.etat === StateCase.Pla ||
            targetCase.etat === StateCase.Choi
          ) {
            const isAlreadySelected = targetCase.etat === StateCase.Choi;
            if (isAlreadySelected) {
              const { grid: nextGrid, pions: nextPions } = resetSelections(
                grid,
                pions
              );
              set({
                grid: nextGrid,
                flatGrid: nextGrid.flat(),
                pions: nextPions,
              });
              return;
            }

            const nextGrid = selectCaseOnGrid(grid, targetCase.ncase);
            set({
              grid: nextGrid,
              flatGrid: nextGrid.flat(),
            });
          }
        }
      },

      resetPions: () => {
        const {
          grid,
          preGeneratedNumbers,
          preGeneratedOperators,
          rackIndex,
        } = get();

        const nextGrid = grid.map((row) =>
          row.map((cell) =>
            cell.etat !== StateCase.Lo
              ? {
                ...cell,
                txt: cell.itxt,
                etat: StateCase.Cre,
                placep: undefined,
                isTarget: false,
              }
              : cell
          )
        );

        const currentNumbers = preGeneratedNumbers[rackIndex] ?? [];
        const currentOperators = preGeneratedOperators[rackIndex] ?? [];
        const { numbers, operators, pions: nextPions } = buildPionsFromRack(
          currentNumbers,
          currentOperators
        );

        set({
          grid: nextGrid,
          flatGrid: nextGrid.flat(),
          numbers,
          operators,
          pions: nextPions,
          gameResults: [null, null, null, null],
          directionsValid: {
            left: false,
            right: false,
            up: false,
            down: false,
          },
        });
      },

      calculateScores: () => {
        const { grid, flatGrid, niveau, cnbjeu, isMatchOver } = get();

        const baseGrid = clearTargets(grid);
        const baseFlatGrid = baseGrid.flat();

        if (isMatchOver) {
          set({
            grid: baseGrid,
            flatGrid: baseFlatGrid,
            directionsValid: {
              left: false,
              right: false,
              up: false,
              down: false,
            },
            gameResults: [null, null, null, null],
          });
          return;
        }

        const emptyResults: (GameResult | null)[] = [
          null,
          null,
          null,
          null,
        ];
        const emptyDirections = {
          left: false,
          right: false,
          up: false,
          down: false,
        };

        if (!isStartCaseCovered(baseFlatGrid)) {
          set({
            grid: baseGrid,
            flatGrid: baseFlatGrid,
            directionsValid: emptyDirections,
            gameResults: emptyResults,
          });
          return;
        }

        const placedOnGrid = getPlacedPions(baseFlatGrid);
        if (placedOnGrid.length === 0) {
          set({
            grid: baseGrid,
            flatGrid: baseFlatGrid,
            directionsValid: emptyDirections,
            gameResults: emptyResults,
          });
          return;
        }

        if (tpencadre(baseGrid)) {
          set({
            grid: baseGrid,
            flatGrid: baseFlatGrid,
            directionsValid: emptyDirections,
            gameResults: emptyResults,
          });
          return;
        }

        const results: (GameResult | null)[] = [null, null, null, null];
        const directionsValid = {
          left: false,
          right: false,
          up: false,
          down: false,
        };

        const directions = [
          { sens: Sens.Up, index: 0, key: 'up' as const },
          { sens: Sens.Down, index: 1, key: 'down' as const },
          { sens: Sens.Left, index: 2, key: 'left' as const },
          { sens: Sens.Right, index: 3, key: 'right' as const },
        ];

        const firstPlaced = placedOnGrid[0];

        const targetGrid: UneCase[][] = baseGrid.map((row) =>
          row.map((cell) => ({ ...cell }))
        );

        directions.forEach(({ sens, index, key }) => {
          const { sequence } = collectSequence(baseGrid, firstPlaced, sens);

          if (!isValidSequence(sequence)) return;

          const validation = validateCombination(
            sequence,
            placedOnGrid,
            cnbjeu,
            baseGrid
          );

          if (!validation.valid) return;

          const sorted = sortSequence(sequence, sens);

          const edgeCase =
            sens === Sens.Up || sens === Sens.Left
              ? sorted[0]
              : sorted[sorted.length - 1];

          const targetCase = getNextCase(baseGrid, edgeCase, sens);
          if (!targetCase) return;
          if (targetCase.etat !== StateCase.Cre) return;
          if (isOperateur(targetCase.txt)) return;
          if (targetCase.txt === '') return;

          const targetRow = targetGrid[targetCase.indj];
          if (targetRow) {
            targetRow[targetCase.indi] = {
              ...targetRow[targetCase.indi],
              isTarget: true,
            };
          }

          const gameRes = calculateGameResult(
            targetCase,
            sorted,
            placedOnGrid,
            niveau
          );

          results[index] = gameRes;
          directionsValid[key] = true;
        });

        set({
          grid: targetGrid,
          flatGrid: targetGrid.flat(),
          gameResults: results,
          directionsValid,
        });
      },

      confirmCalculation: (resultIndex: number) => {
        const { grid, gameResults, scoreTotal, isMatchOver } = get();

        if (isMatchOver) return;

        const selectedResult = gameResults[resultIndex];
        if (!selectedResult) return;

        const validatedNcases = new Set(selectedResult.sequenceNcases);

        const nextGrid = grid.map((row) =>
          row.map((cell) => {
            if (validatedNcases.has(cell.ncase)) {
              return { ...cell, etat: StateCase.Lo, isTarget: false };
            }
            if (
              cell.etat === StateCase.Pla ||
              cell.etat === StateCase.Choi
            ) {
              return {
                ...cell,
                txt: cell.itxt,
                etat: StateCase.Cre,
                placep: undefined,
                isTarget: false,
              };
            }
            return { ...cell, isTarget: false };
          })
        );

        set({
          grid: nextGrid,
          flatGrid: nextGrid.flat(),
          scoreTotal: scoreTotal + selectedResult.notedjeu,
          lastConfirmedResult: selectedResult,
          gameResults: [null, null, null, null],
          directionsValid: {
            left: false,
            right: false,
            up: false,
            down: false,
          },
        });

        get().nextJeu();
      },

      validerCoupDirection: (resultIndex: number) => {
        get().confirmCalculation(resultIndex);
      },

      resetToInitialState: () => {
        const { numeromat, nombredejeu } = get();
        const grid = createInitialGrid(numeromat);
        set({
          grid,
          flatGrid: grid.flat(),
          numbers: [],
          operators: [],
          pions: [],
          preGeneratedNumbers: [],
          preGeneratedOperators: [],
          rackIndex: 0,
          cnbjeu: 0,
          nombredejeu,
          scoreTotal: 0,
          gameResults: [null, null, null, null],
          lastConfirmedResult: null,
          directionsValid: {
            left: false,
            right: false,
            up: false,
            down: false,
          },
          isMatchOver: false,
        });
      },

      // ============================================================
      // ACTIONS TOURNOI / MATCH
      // ============================================================

      startTournament: (meta: TournamentMeta) => {
        const tournamentId = generateId('tour');
        const matchId = generateId('match');

        set({
          currentTournamentId: tournamentId,
          currentMatchId: matchId,
          tournamentMeta: meta,
          matchIndex: 0,
          numeromatch: '1',
          scoreTotal: 0,
          isMatchOver: false,
        });
      },

      startMatch: (numeromatch: string) => {
        const { matchIndex } = get();
        const matchId = generateId('match');

        set({
          currentMatchId: matchId,
          matchIndex: matchIndex + 1,
          numeromatch,
          scoreTotal: 0,
          isMatchOver: false,
        });
      },

      endMatch: () => {
        set({ isMatchOver: true });
      },

      endTournament: () => {
        set({
          currentTournamentId: null,
          currentMatchId: null,
          tournamentMeta: null,
          matchIndex: 0,
          numeromatch: '',
          scoreTotal: 0,
          isMatchOver: false,
        });
      },
    }),
    {
      name: STORAGE_NAME,
      storage: createJSONStorage(() => localStorage),
      version: CURRENT_VERSION,
      // On persiste tout l'état de jeu
      partialize: (state) => ({ ...state }),
    }
  )
);