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
  nombredejeu: number;
  scoreTotal: number;
  directionsValid: DirectionsValid;
  isMatchOver: boolean;

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
    numbersRacks.push(numCopy.splice(0, RACK_NUMBERS_COUNT));
  }
  const opCopy = [...operators];
  while (opCopy.length > 0) {
    operatorsRacks.push(opCopy.splice(0, RACK_OPERATORS_COUNT));
  }

  return { numbersRacks, operatorsRacks };
}

function buildPionsFromRack(
  numbersTxt: string[],
  operatorsTxt: string[]
): { numbers: UneCase[]; operators: UneCase[]; pions: UneCase[] } {
  const numbers: UneCase[] = numbersTxt.map((txt, index) => ({
    ncase: -1, // ✅ Les pions n'ont PAS de case plateau
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

/**
 * ✅ CORRIGÉ : désélectionne les cases Choi et retire les marqueurs isTarget,
 *    SANS transformer les cases cibles (Cre + isTarget) en Pla.
 */
function resetSelections(
  grid: UneCase[][],
  pions: UneCase[]
): { grid: UneCase[][]; pions: UneCase[] } {
  const nextGrid = grid.map((row) =>
    row.map((cell) => {
      // On retire toujours le marqueur isTarget (nettoyage)
      const clearedTarget = cell.isTarget
        ? { ...cell, isTarget: false }
        : cell;

      // On désélectionne uniquement les cases Choi → Pla
      // (sans toucher à leur etat d'origine Cre/Pla/Lo)
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

/**
 * ✅ CORRIGÉ : sélectionne une case du plateau et désélectionne les autres,
 *    SANS transformer les cases cibles (Cre + isTarget) en Pla.
 */
function selectCaseOnGrid(grid: UneCase[][], ncase: number): UneCase[][] {
  return grid.map((row) =>
    row.map((cell) => {
      // On retire toujours isTarget
      const clearedTarget = cell.isTarget
        ? { ...cell, isTarget: false }
        : cell;

      // La case cliquée devient Choi
      if (clearedTarget.ncase === ncase) {
        return { ...clearedTarget, etat: StateCase.Choi };
      }

      // Les autres cases Choi → Pla (désélection)
      // ⚠️ On ne touche PAS aux cases Cre/Lo/Pla
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

function hasRemainingPionsInRack(pions: UneCase[]): boolean {
  return pions.some((p) => p.etat === StateCase.Pla);
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
  nombredejeu: 20,
  scoreTotal: 0,
  directionsValid: { left: false, right: false, up: false, down: false },
  lastConfirmedResult: null,
  isMatchOver: false,

  // ============================================================
  // INITIALISATION
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
      directionsValid: { left: false, right: false, up: false, down: false },
      isMatchOver: false,
    });
  },

  // ============================================================
  // PASSAGE AU JEU SUIVANT
  // ============================================================
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

    if (matchOver) {
      const finalGrid = clearTargets(
        grid.map((row) =>
          row.map((cell) =>
            cell.etat !== StateCase.Lo
              ? {
                  ...cell,
                  txt: cell.itxt,
                  etat: StateCase.Cre,
                  placep: undefined,
                  isTarget: false,
                }
              : { ...cell, isTarget: false }
          )
        )
      );
      set({
        grid: finalGrid,
        flatGrid: finalGrid.flat(),
        numbers: [],
        operators: [],
        pions: [],
        rackIndex: nextIndex,
        cnbjeu: nextCnbjeu,
        gameResults: [null, null, null, null],
        directionsValid: { left: false, right: false, up: false, down: false },
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
          : { ...cell, isTarget: false }
      )
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
      directionsValid: { left: false, right: false, up: false, down: false },
      isMatchOver: false,
    });
  },

  // ============================================================
  // INTERACTION
  // ============================================================
  handleCaseClick: (targetCase: UneCase) => {
    const { pions, grid, flatGrid, isMatchOver } = get();

    if (isMatchOver) return;

    const selectedPionInRack = pions.find((p) => p.etat === StateCase.Choi);
    const selectedCaseOnGrid = flatGrid.find(
      (c) => c.etat === StateCase.Choi && c.tca === TypeCase.Plateau
    );

    // ---------- 1. CLIC SUR LE RACK ----------
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

          const nextGrid = removePionFromGrid(grid, selectedCaseOnGrid.ncase);
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

    // ---------- 2. CLIC SUR LE PLATEAU ----------
    if (targetCase.tca === TypeCase.Plateau) {
      if (targetCase.etat === StateCase.Lo) return;

      // 2a. Case creuse
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

      // 2b. Case occupée
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
      directionsValid: { left: false, right: false, up: false, down: false },
    });
  },

  // ============================================================
  // CALCUL DES SCORES
  // ============================================================
  calculateScores: () => {
    const { grid, flatGrid, niveau, cnbjeu, isMatchOver } = get();

    const baseGrid = clearTargets(grid);
    const baseFlatGrid = baseGrid.flat();

    if (isMatchOver) {
      set({
        grid: baseGrid,
        flatGrid: baseFlatGrid,
        directionsValid: { left: false, right: false, up: false, down: false },
        gameResults: [null, null, null, null],
      });
      return;
    }

    const emptyResults: (GameResult | null)[] = [null, null, null, null];
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

  // ============================================================
  // VALIDATION DU CALCUL
  // ============================================================
  confirmCalculation: (resultIndex: number) => {
    const { grid, gameResults, scoreTotal, isMatchOver } = get();

    if (isMatchOver) return;

    const selectedResult = gameResults[resultIndex];
    if (!selectedResult) return;

    const validatedNcases = new Set(selectedResult.sequenceNcases);

    const nextGrid = grid.map((row) =>
      row.map((cell) => {
        // ✅ Seules les cases de la séquence validée deviennent Lo.
        //    ⚠️ On EXCLUT la case cible (isTarget) : elle doit rester Cre.
        if (validatedNcases.has(cell.ncase)) {
          return { ...cell, etat: StateCase.Lo, isTarget: false };
        }
        // Les autres cases Pla/Choi → on retire le pion (retour au rack)
        if (cell.etat === StateCase.Pla || cell.etat === StateCase.Choi) {
          return {
            ...cell,
            txt: cell.itxt,
            etat: StateCase.Cre,
            placep: undefined,
            isTarget: false,
          };
        }
        // La case cible reste Cre, on retire juste le marqueur isTarget
        return { ...cell, isTarget: false };
      })
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
      directionsValid: { left: false, right: false, up: false, down: false },
      isMatchOver: false,
    });
  },
}));