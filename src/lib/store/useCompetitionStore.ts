import { create } from 'zustand';
import {
  calculateGameResult,
  collectSequence,
  createInitialGrid,
  getPlacedPions,
  isOperateur,
  isStartCaseCovered,
  isValidSequence,
  validateCombination
} from '@/components/lolomaths/game/competitionEngine';
import { Dtfil, GameResult, Sens, StateCase, UneCase } from '../interfaces';

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
  pions: UneCase[]; // Tirage actif du rack (10 pions max : 6 nombres, 4 opérateurs)
  stockNumbers: string[]; // Réserve globale de nombres restants
  stockOperators: string[]; // Réserve globale d'opérateurs restants
  gameResults: GameResult[];
  niveau: Dtfil;
  cnbjeu: number;
  scoreTotal: number;
  directionsValid: DirectionsValid;
  hasUsedMultiplicationOrDivision: boolean;

  // Actions
  initGame: (
    numbersTxt: string[],
    operatorsTxt: string[],
    niveau?: Dtfil,
    numeromat?: string,
    listecaseRef?: string[]
  ) => void;
  nextJeu: (newNumbersTxt: string[], newOperatorsTxt: string[]) => void;
  handleCaseClick: (targetCase: UneCase) => void;
  resetPions: () => void;
  calculateScores: () => void;
  confirmCalculation: (resultIndex: number) => void;
  resetToInitialState: () => void;
}

/**
 * Générateur pseudo-aléatoire déterministe (Mulberry32)
 */
function createPRNG(seedString: string) {
  let seed = 0;
  for (let i = 0; i < seedString.length; i++) {
    seed = (seed << 5) - seed + seedString.charCodeAt(i);
    seed |= 0;
  }

  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Mélange déterministe Fisher-Yates
 */
function shuffleDeterministic<T>(array: T[], seedString: string): T[] {
  const result = [...array];
  const random = createPRNG(seedString);

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

// Fonction de tirage des 10 pions depuis le stock
const drawRackFromStock = (stockNum: string[], stockOp: string[]) => {
  const currentNumTxt = stockNum.slice(0, 6);
  const remainingNum = stockNum.slice(6);

  const currentOpTxt = stockOp.slice(0, 4);
  const remainingOp = stockOp.slice(4);

  const numbers: UneCase[] = currentNumTxt.map((txt, index) => ({
    ncase: index,
    indi: 0,
    indj: 0,
    txt,
    itxt: txt,
    etat: StateCase.Pla,
    tca: 2,
    placep: index
  }));

  const operators: UneCase[] = currentOpTxt.map((txt, index) => ({
    ncase: index,
    indi: 0,
    indj: 0,
    txt,
    itxt: txt,
    etat: StateCase.Pla,
    tca: 3,
    placep: currentNumTxt.length + index
  }));

  return {
    numbers,
    operators,
    pions: [...numbers, ...operators],
    remainingNum,
    remainingOp
  };
};

export const useCompetitionStore = create<CompetitionState>((set, get) => ({
  numeromat: '',
  grid: [],
  flatGrid: [],
  numbers: [],
  operators: [],
  pions: [],
  stockNumbers: [],
  stockOperators: [],
  gameResults: [],
  niveau: Dtfil.Sen,
  cnbjeu: 0,
  scoreTotal: 0,
  directionsValid: { left: false, right: false, up: false, down: false },
  hasUsedMultiplicationOrDivision: false,

  initGame: (numbersTxt, operatorsTxt, niveau = Dtfil.Sen, numeromat = '12345', listecaseRef) => {
    const grid = createInitialGrid(numeromat, listecaseRef);
    const flatGrid = grid.flat();

    // Mélange déterministe des listes initiales basé sur numeromat
    const shuffledNumbers = shuffleDeterministic(numbersTxt, `${numeromat}_num`);
    const shuffledOperators = shuffleDeterministic(operatorsTxt, `${numeromat}_op`);

    const { numbers, operators, pions, remainingNum, remainingOp } = drawRackFromStock(
      shuffledNumbers,
      shuffledOperators
    );

    set({
      numeromat,
      grid,
      flatGrid,
      numbers,
      operators,
      pions,
      stockNumbers: remainingNum,
      stockOperators: remainingOp,
      niveau,
      cnbjeu: 0,
      scoreTotal: 0,
      gameResults: [],
      directionsValid: { left: false, right: false, up: false, down: false },
      hasUsedMultiplicationOrDivision: false
    });
  },

  nextJeu: (newNumbersTxt, newOperatorsTxt) => {
    const { numbers, operators, pions, remainingNum, remainingOp } = drawRackFromStock(
      newNumbersTxt,
      newOperatorsTxt
    );

    set((state) => ({
      numbers,
      operators,
      pions,
      stockNumbers: remainingNum,
      stockOperators: remainingOp,
      cnbjeu: state.cnbjeu + 1,
      gameResults: [],
      directionsValid: { left: false, right: false, up: false, down: false }
    }));
  },

  handleCaseClick: (targetCase: UneCase) => {
    const { pions, grid, flatGrid } = get();

    const selectedPionInRack = pions.find((p) => p.etat === StateCase.Choi);
    const selectedCaseOnGrid = flatGrid.find(
      (c) => c.etat === StateCase.Choi && c.ncase !== targetCase.ncase
    );

    // 1. CLIC SUR LE RACK / PORTE-PIONS (tca === 2 ou 3)
    if (targetCase.tca === 2 || targetCase.tca === 3) {
      if (selectedCaseOnGrid && selectedCaseOnGrid.etat !== StateCase.Lo) {
        const nextGrid = grid.map((row) =>
          row.map((cell) => {
            if (cell.ncase === selectedCaseOnGrid.ncase) {
              return { ...cell, txt: cell.itxt, etat: StateCase.Cre, placep: undefined };
            }
            return cell;
          })
        );

        const nextPions = pions.map((p) =>
          p.placep === selectedCaseOnGrid.placep ? { ...p, etat: StateCase.Pla } : p
        );

        set({ grid: nextGrid, flatGrid: nextGrid.flat(), pions: nextPions });
        get().calculateScores();
        return;
      }

      if (targetCase.etat === StateCase.Cre) return;

      if (targetCase.etat === StateCase.Pla || targetCase.etat === StateCase.Choi) {
        const nextGrid = grid.map((row) =>
          row.map((cell) => (cell.etat === StateCase.Choi ? { ...cell, etat: StateCase.Pla } : cell))
        );

        const nextPions = pions.map((p) => {
          if (p.placep === targetCase.placep) {
            return { ...p, etat: p.etat === StateCase.Choi ? StateCase.Pla : StateCase.Choi };
          }
          return p.etat === StateCase.Choi ? { ...p, etat: StateCase.Pla } : p;
        });

        set({ grid: nextGrid, flatGrid: nextGrid.flat(), pions: nextPions });
      }
      return;
    }

    // 2. CLIC SUR LA GRILLE DU PLATEAU (tca === 1)
    if (targetCase.tca === 1) {
      if (targetCase.etat === StateCase.Lo) return;

      if (targetCase.etat === StateCase.Cre && selectedPionInRack) {
        const nextGrid = grid.map((row) =>
          row.map((cell) => {
            if (cell.ncase === targetCase.ncase) {
              return {
                ...cell,
                txt: selectedPionInRack.txt,
                etat: StateCase.Pla,
                placep: selectedPionInRack.placep
              };
            }
            return cell;
          })
        );

        const nextPions = pions.map((p) => {
          if (p.placep === selectedPionInRack.placep) {
            return { ...p, etat: StateCase.Cre };
          }
          return p.etat === StateCase.Choi ? { ...p, etat: StateCase.Pla } : p;
        });

        set({ grid: nextGrid, flatGrid: nextGrid.flat(), pions: nextPions });
        get().calculateScores();
        return;
      }

      if (targetCase.etat === StateCase.Cre && selectedCaseOnGrid) {
        const nextGrid = grid.map((row) =>
          row.map((cell) => {
            if (cell.ncase === selectedCaseOnGrid.ncase) {
              return { ...cell, txt: cell.itxt, etat: StateCase.Cre, placep: undefined };
            }
            if (cell.ncase === targetCase.ncase) {
              return {
                ...cell,
                txt: selectedCaseOnGrid.txt,
                etat: StateCase.Pla,
                placep: selectedCaseOnGrid.placep
              };
            }
            return cell;
          })
        );

        set({ grid: nextGrid, flatGrid: nextGrid.flat() });
        get().calculateScores();
        return;
      }

      if (targetCase.etat === StateCase.Pla || targetCase.etat === StateCase.Choi) {
        const nextPions = pions.map((p) => ({
          ...p,
          etat: p.etat === StateCase.Choi ? StateCase.Pla : p.etat
        }));

        const nextGrid = grid.map((row) =>
          row.map((cell) => {
            if (cell.ncase === targetCase.ncase) {
              return { ...cell, etat: cell.etat === StateCase.Choi ? StateCase.Pla : StateCase.Choi };
            }
            return cell.etat === StateCase.Choi ? { ...cell, etat: StateCase.Pla } : cell;
          })
        );

        set({ grid: nextGrid, flatGrid: nextGrid.flat(), pions: nextPions });
      }
    }
  },

  resetPions: () => {
    const { grid, pions } = get();

    const nextGrid = grid.map((row) =>
      row.map((cell) =>
        cell.etat !== StateCase.Lo
          ? { ...cell, txt: cell.itxt, etat: StateCase.Cre, placep: undefined }
          : cell
      )
    );

    const nextPions = pions.map((p) => ({ ...p, etat: StateCase.Pla }));

    set({
      grid: nextGrid,
      flatGrid: nextGrid.flat(),
      pions: nextPions,
      numbers: nextPions.filter((p) => p.tca === 2),
      operators: nextPions.filter((p) => p.tca === 3),
      directionsValid: { left: false, right: false, up: false, down: false },
      gameResults: []
    });
  },

  calculateScores: () => {
    const { grid, flatGrid, niveau, cnbjeu, hasUsedMultiplicationOrDivision } = get();

    if (!isStartCaseCovered(flatGrid)) {
      set({ directionsValid: { left: false, right: false, up: false, down: false }, gameResults: [] });
      return;
    }

    const placedOnGrid = getPlacedPions(flatGrid);
    if (placedOnGrid.length === 0) {
      set({ directionsValid: { left: false, right: false, up: false, down: false }, gameResults: [] });
      return;
    }

    const results: GameResult[] = [];
    const directionsValid = { left: false, right: false, up: false, down: false };
    const directions = [Sens.Up, Sens.Down, Sens.Left, Sens.Right];

    directions.forEach((dir) => {
      const firstPlaced = placedOnGrid[0];
      const { sequence } = collectSequence(grid, firstPlaced, dir);

      if (!isValidSequence(sequence)) return;

      const validation = validateCombination(sequence, placedOnGrid, cnbjeu, grid);

      if (validation.valid) {
        const boutCase = sequence[sequence.length - 1];

        if (boutCase && !isOperateur(boutCase.txt)) {
          const sequenceWithoutBout = sequence.slice(0, -1);

          // Calcule le résultat du coup (égalité, supérieur ou inférieur). Le coup est systématiquement valide.
          const gameRes = calculateGameResult(
            boutCase,
            sequenceWithoutBout,
            placedOnGrid,
            niveau,
            hasUsedMultiplicationOrDivision
          );

          results.push(gameRes);

          switch (dir) {
            case Sens.Left:
              directionsValid.left = true;
              break;
            case Sens.Right:
              directionsValid.right = true;
              break;
            case Sens.Up:
              directionsValid.up = true;
              break;
            case Sens.Down:
              directionsValid.down = true;
              break;
          }
        }
      }
    });

    set({ gameResults: results, directionsValid });
  },

  confirmCalculation: (resultIndex: number) => {
    const {
      grid,
      gameResults,
      scoreTotal,
      cnbjeu,
      stockNumbers,
      stockOperators,
      hasUsedMultiplicationOrDivision
    } = get();

    const selectedResult = gameResults[resultIndex];
    if (!selectedResult) return;

    const hasMulOrDiv =
      selectedResult.combine.includes('*') || selectedResult.combine.includes('/');
    const nextHasUsedMulDiv = hasUsedMultiplicationOrDivision || hasMulOrDiv;

    const nextGrid = grid.map((row) =>
      row.map((cell) =>
        cell.etat === StateCase.Pla || cell.etat === StateCase.Choi
          ? { ...cell, etat: StateCase.Lo }
          : cell
      )
    );

    const { numbers, operators, pions, remainingNum, remainingOp } = drawRackFromStock(
      stockNumbers,
      stockOperators
    );

    set({
      grid: nextGrid,
      flatGrid: nextGrid.flat(),
      pions,
      numbers,
      operators,
      stockNumbers: remainingNum,
      stockOperators: remainingOp,
      scoreTotal: scoreTotal + selectedResult.notedjeu,
      cnbjeu: cnbjeu + 1,
      gameResults: [],
      directionsValid: { left: false, right: false, up: false, down: false },
      hasUsedMultiplicationOrDivision: nextHasUsedMulDiv
    });
  },

  resetToInitialState: () => {
    const { numeromat, stockNumbers, stockOperators, pions } = get();
    const grid = createInitialGrid(numeromat);

    const allNumbersTxt = [...pions.filter((p) => p.tca === 2).map((p) => p.txt), ...stockNumbers];
    const allOperatorsTxt = [...pions.filter((p) => p.tca === 3).map((p) => p.txt), ...stockOperators];

    const shuffledNumbers = shuffleDeterministic(allNumbersTxt, `${numeromat}_num`);
    const shuffledOperators = shuffleDeterministic(allOperatorsTxt, `${numeromat}_op`);

    const { numbers, operators, pions: newPions, remainingNum, remainingOp } = drawRackFromStock(
      shuffledNumbers,
      shuffledOperators
    );

    set({
      grid,
      flatGrid: grid.flat(),
      pions: newPions,
      numbers,
      operators,
      stockNumbers: remainingNum,
      stockOperators: remainingOp,
      cnbjeu: 0,
      scoreTotal: 0,
      gameResults: [],
      directionsValid: { left: false, right: false, up: false, down: false },
      hasUsedMultiplicationOrDivision: false
    });
  }
}));