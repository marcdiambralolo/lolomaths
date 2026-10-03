import { create } from 'zustand';
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
} from '@/components/lolomaths/game/competitionEngine';
import { Dtfil, GameResult, Sens, StateCase, UneCase } from '@/lib/interfaces';

interface DirectionsValid {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
}

interface CompetitionState {
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
  scoreTotal: number;
  directionsValid: DirectionsValid;

  initGame: (
    numbersTxt: string[],
    operatorsTxt: string[],
    niveau?: Dtfil,
    numeromat?: string,
    listecaseRef?: string[]
  ) => void;
  nextJeu: () => void;
  handleCaseClick: (targetCase: UneCase) => void;
  resetPions: () => void;
  calculateScores: () => void;
  confirmCalculation: (resultIndex: number) => void;
  validerCoupDirection?: (resultIndex: number) => void;
  resetToInitialState: () => void;
}

// ============================================================
// Helpers internes
// ============================================================

function splitIntoRacks(
  numbers: string[],
  operators: string[]
): { numbersRacks: string[][]; operatorsRacks: string[][] } {
  const numbersRacks: string[][] = [];
  const operatorsRacks: string[][] = [];

  const numCopy = [...numbers];
  while (numCopy.length > 0) {
    numbersRacks.push(numCopy.splice(0, 6));
  }
  const opCopy = [...operators];
  while (opCopy.length > 0) {
    operatorsRacks.push(opCopy.splice(0, 4));
  }

  return { numbersRacks, operatorsRacks };
}

function buildPionsFromRack(
  numbersTxt: string[],
  operatorsTxt: string[]
): { numbers: UneCase[]; operators: UneCase[]; pions: UneCase[] } {
  const numbers: UneCase[] = numbersTxt.map((txt, index) => ({
    ncase: index,
    indi: 0,
    indj: 0,
    txt,
    itxt: txt,
    etat: StateCase.Pla,
    tca: 2,
    placep: index,
  }));

  const operators: UneCase[] = operatorsTxt.map((txt, index) => ({
    ncase: index,
    indi: 0,
    indj: 0,
    txt,
    itxt: txt,
    etat: StateCase.Pla,
    tca: 3,
    placep: numbersTxt.length + index,
  }));

  return { numbers, operators, pions: [...numbers, ...operators] };
}

function clearSelections(
  grid: UneCase[][],
  pions: UneCase[]
): { grid: UneCase[][]; pions: UneCase[] } {
  const nextGrid = grid.map((row) =>
    row.map((cell) =>
      cell.etat === StateCase.Choi ? { ...cell, etat: StateCase.Pla } : cell
    )
  );
  const nextPions = pions.map((p) =>
    p.etat === StateCase.Choi ? { ...p, etat: StateCase.Pla } : p
  );
  return { grid: nextGrid, pions: nextPions };
}

// ============================================================
// Store
// ============================================================

export const useCompetitionStore = create<CompetitionState>((set, get) => ({
  numeromat: '',
  grid: [],
  flatGrid: [],
  numbers: [],
  operators: [],
  pions: [],
  preGeneratedNumbers: [],
  preGeneratedOperators: [],
  rackIndex: 0,
  gameResults: [null, null, null, null],
  niveau: Dtfil.Sen,
  cnbjeu: 0,
  scoreTotal: 0,
  directionsValid: { left: false, right: false, up: false, down: false },
  lastConfirmedResult: null,

  // ============================================================
  // INITIALISATION
  // ============================================================
  initGame: (
    numbersTxt,
    operatorsTxt,
    niveau = Dtfil.Sen,
    numeromat = '12345',
    listecaseRef
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
      scoreTotal: 0,
      gameResults: [null, null, null, null],
      lastConfirmedResult: null,
      directionsValid: { left: false, right: false, up: false, down: false },
    });
  },

  nextJeu: () => {
    const {
      preGeneratedNumbers,
      preGeneratedOperators,
      rackIndex,
      grid,
      cnbjeu,
    } = get();

    const nextIndex = rackIndex + 1;
    const nextNumbers = preGeneratedNumbers[nextIndex] ?? [];
    const nextOperators = preGeneratedOperators[nextIndex] ?? [];

    const { numbers, operators, pions } = buildPionsFromRack(
      nextNumbers,
      nextOperators
    );

    const nextGrid = grid.map((row) =>
      row.map((cell) =>
        cell.etat === StateCase.Lo
          ? cell
          : { ...cell, txt: cell.itxt, etat: StateCase.Cre, placep: undefined }
      )
    );

    set({
      grid: nextGrid,
      flatGrid: nextGrid.flat(),
      numbers,
      operators,
      pions,
      rackIndex: nextIndex,
      cnbjeu: cnbjeu + 1,
      gameResults: [null, null, null, null],
      directionsValid: { left: false, right: false, up: false, down: false },
    });
  },

  // ============================================================
  // INTERACTION
  // ============================================================
  handleCaseClick: (targetCase: UneCase) => {
    const { pions, grid, flatGrid } = get();

    const selectedPionInRack = pions.find((p) => p.etat === StateCase.Choi);
    const selectedCaseOnGrid = flatGrid.find(
      (c) => c.etat === StateCase.Choi && c.tca === 1
    );

    // ---------- 1. CLIC SUR LE RACK (tca === 2 ou 3) ----------
    if (targetCase.tca === 2 || targetCase.tca === 3) {
      switch (targetCase.etat) {
        case StateCase.Pla: {
          const nextPions = pions.map((p) => {
            if (p.placep === targetCase.placep) {
              return { ...p, etat: StateCase.Choi };
            }
            return p.etat === StateCase.Choi
              ? { ...p, etat: StateCase.Pla }
              : p;
          });

          const nextGrid = grid.map((row) =>
            row.map((cell) =>
              cell.etat === StateCase.Choi
                ? { ...cell, etat: StateCase.Pla }
                : cell
            )
          );

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
          if (selectedCaseOnGrid) {
            const pionOfCase = pions.find(
              (p) => p.placep === selectedCaseOnGrid.placep
            );

            const nextGrid = grid.map((row) =>
              row.map((cell) =>
                cell.ncase === selectedCaseOnGrid.ncase
                  ? {
                      ...cell,
                      txt: cell.itxt,
                      etat: StateCase.Cre,
                      placep: undefined,
                    }
                  : cell
              )
            );

            const nextPions = pions.map((p) =>
              p.placep === pionOfCase?.placep
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
          }
          return;
        }

        default:
          return;
      }
    }

    // ---------- 2. CLIC SUR LE PLATEAU (tca === 1) ----------
    if (targetCase.tca === 1) {
      if (targetCase.etat === StateCase.Lo) return;

      // Case creuse → Pose ou déplacement
      if (targetCase.etat === StateCase.Cre) {
        // Pose d'un pion depuis le rack
        if (selectedPionInRack) {
          const nextGrid = grid.map((row) =>
            row.map((cell) => {
              if (cell.ncase === targetCase.ncase) {
                return {
                  ...cell,
                  txt: selectedPionInRack.txt,
                  etat: StateCase.Pla,
                  placep: selectedPionInRack.placep,
                };
              }
              return cell;
            })
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

        // Déplacement d'un pion déjà présent sur la grille
        if (selectedCaseOnGrid) {
          const nextGrid = grid.map((row) =>
            row.map((cell) => {
              if (cell.ncase === selectedCaseOnGrid.ncase) {
                return {
                  ...cell,
                  txt: cell.itxt,
                  etat: StateCase.Cre,
                  placep: undefined,
                };
              }
              if (cell.ncase === targetCase.ncase) {
                return {
                  ...cell,
                  txt: selectedCaseOnGrid.txt,
                  etat: StateCase.Pla,
                  placep: selectedCaseOnGrid.placep,
                };
              }
              return cell;
            })
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

      // Sélection / Désélection d'une case plateau déjà occupée
      if (
        targetCase.etat === StateCase.Pla ||
        targetCase.etat === StateCase.Choi
      ) {
        const cleared = clearSelections(grid, pions);
        const isAlreadySelected = targetCase.etat === StateCase.Choi;

        const nextGrid = cleared.grid.map((row) =>
          row.map((cell) =>
            cell.ncase === targetCase.ncase
              ? {
                  ...cell,
                  etat: isAlreadySelected ? StateCase.Pla : StateCase.Choi,
                }
              : cell
          )
        );

        set({
          grid: nextGrid,
          flatGrid: nextGrid.flat(),
          pions: cleared.pions,
        });
      }
    }
  },

  // ============================================================
  // RESET DU TOUR
  // ============================================================
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
          ? { ...cell, txt: cell.itxt, etat: StateCase.Cre, placep: undefined }
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
      directionsValid: { left: false, right: false, up: false, down: false },
    });
  },

  // ============================================================
  // CALCUL DES SCORES
  // ============================================================
  calculateScores: () => {
    const { grid, flatGrid, niveau, cnbjeu } = get();

    const emptyResults: (GameResult | null)[] = [null, null, null, null];
    const emptyDirections = {
      left: false,
      right: false,
      up: false,
      down: false,
    };

    if (!isStartCaseCovered(flatGrid)) {
      set({ directionsValid: emptyDirections, gameResults: emptyResults });
      return;
    }

    const placedOnGrid = getPlacedPions(flatGrid);
    if (placedOnGrid.length === 0) {
      set({ directionsValid: emptyDirections, gameResults: emptyResults });
      return;
    }

    if (tpencadre(grid)) {
      set({ directionsValid: emptyDirections, gameResults: emptyResults });
      return;
    }

    const results: (GameResult | null)[] = [null, null, null, null];
    const directionsValid = {
      left: false,
      right: false,
      up: false,
      down: false,
    };

    // Ordre : Up=0, Down=1, Left=2, Right=3
    const directions = [
      { sens: Sens.Up, index: 0, key: 'up' as const },
      { sens: Sens.Down, index: 1, key: 'down' as const },
      { sens: Sens.Left, index: 2, key: 'left' as const },
      { sens: Sens.Right, index: 3, key: 'right' as const },
    ];

    const firstPlaced = placedOnGrid[0];

    directions.forEach(({ sens, index, key }) => {
      const { sequence } = collectSequence(grid, firstPlaced, sens);

      if (!isValidSequence(sequence)) return;

      const validation = validateCombination(
        sequence,
        placedOnGrid,
        cnbjeu,
        grid
      );

      if (!validation.valid) return;

      // Trier la séquence (fidèle à `trita` Kotlin) : par indi (horizontal) ou indj (vertical)
      const sorted = sortSequence(sequence, sens);

      // Trouver la case cible = la case Cre au-delà du bord de la séquence, dans la direction
      // Up    → au-dessus de sorted[0]
      // Down  → en dessous de sorted[last]
      // Left  → à gauche de sorted[0]
      // Right → à droite de sorted[last]
      const edgeCase =
        sens === Sens.Up || sens === Sens.Left
          ? sorted[0]
          : sorted[sorted.length - 1];

      const targetCase = getNextCase(grid, edgeCase, sens);
      if (!targetCase) return;
      if (targetCase.etat !== StateCase.Cre) return;
      if (isOperateur(targetCase.txt)) return;
      if (targetCase.txt === '') return;

      const gameRes = calculateGameResult(
        targetCase,
        sorted,
        placedOnGrid,
        niveau
      );

      results[index] = gameRes;
      directionsValid[key] = true;
    });

    set({ gameResults: results, directionsValid });
  },

  // ============================================================
  // VALIDATION DU CALCUL
  // ============================================================
  confirmCalculation: (resultIndex: number) => {
    const { grid, gameResults, scoreTotal } = get();

    const selectedResult = gameResults[resultIndex];
    if (!selectedResult) return;

    const nextGrid = grid.map((row) =>
      row.map((cell) =>
        cell.etat === StateCase.Pla || cell.etat === StateCase.Choi
          ? { ...cell, etat: StateCase.Lo }
          : cell
      )
    );

    set({
      grid: nextGrid,
      flatGrid: nextGrid.flat(),
      scoreTotal: scoreTotal + selectedResult.notedjeu,
      lastConfirmedResult: selectedResult,
      gameResults: [null, null, null, null],
      directionsValid: { left: false, right: false, up: false, down: false },
    });

    get().nextJeu();
  },

  validerCoupDirection: (resultIndex: number) => {
    get().confirmCalculation(resultIndex);
  },

  // ============================================================
  // RESET COMPLET
  // ============================================================
  resetToInitialState: () => {
    const { numeromat } = get();
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
      scoreTotal: 0,
      gameResults: [null, null, null, null],
      lastConfirmedResult: null,
      directionsValid: { left: false, right: false, up: false, down: false },
    });
  },
}));