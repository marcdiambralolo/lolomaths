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
  pions: UneCase[];
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

const buildRackItems = (numbersTxt: string[], operatorsTxt: string[]) => {
  const cleanNumbers = numbersTxt.slice(0, 6);
  const cleanOperators = operatorsTxt.slice(0, 4);

  const numbers: UneCase[] = cleanNumbers.map((txt, index) => ({
    ncase: index,
    indi: 0,
    indj: 0,
    txt,
    itxt: txt,
    etat: StateCase.Pla,
    tca: 2,
    placep: index
  }));

  const operators: UneCase[] = cleanOperators.map((txt, index) => ({
    ncase: index,
    indi: 0,
    indj: 0,
    txt,
    itxt: txt,
    etat: StateCase.Pla,
    tca: 3,
    placep: cleanNumbers.length + index
  }));

  return { numbers, operators, pions: [...numbers, ...operators] };
};

export const useCompetitionStore = create<CompetitionState>((set, get) => ({
  numeromat: '',
  grid: [],
  flatGrid: [],
  numbers: [],
  operators: [],
  pions: [],
  gameResults: [],
  niveau: Dtfil.Sen,
  cnbjeu: 0,
  scoreTotal: 0,
  directionsValid: { left: false, right: false, up: false, down: false },
  hasUsedMultiplicationOrDivision: false,

  initGame: (numbersTxt, operatorsTxt, niveau = Dtfil.Sen, numeromat = '12345', listecaseRef) => {
    const grid = createInitialGrid(numeromat, listecaseRef);
    const flatGrid = grid.flat();
    const { numbers, operators, pions } = buildRackItems(numbersTxt, operatorsTxt);

    set({
      numeromat,
      grid,
      flatGrid,
      numbers,
      operators,
      pions,
      niveau,
      cnbjeu: 0,
      scoreTotal: 0,
      gameResults: [],
      directionsValid: { left: false, right: false, up: false, down: false },
      hasUsedMultiplicationOrDivision: false
    });
  },

  nextJeu: (newNumbersTxt, newOperatorsTxt) => {
    const { numbers, operators, pions } = buildRackItems(newNumbersTxt, newOperatorsTxt);

    set((state) => ({
      numbers,
      operators,
      pions,
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
      // Si un pion de la grille était sélectionné -> On le remet dans le rack
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

      // Pion déjà placé/utilisé sur la grille
      if (targetCase.etat === StateCase.Cre) return;

      // Sélection / Désélection d'un pion disponible dans le porte-pions
      if (targetCase.etat === StateCase.Pla || targetCase.etat === StateCase.Choi) {
        const nextGrid = grid.map((row) =>
          row.map((cell) => (cell.etat === StateCase.Choi ? { ...cell, etat: StateCase.Pla } : cell))
        );

        const nextPions = pions.map((p) => {
          if (p.placep === targetCase.placep) {
            return { ...p, etat: p.etat === StateCase.Choi ? StateCase.Pla : StateCase.Choi };
          }
          // Si un autre pion du rack était sélectionné, on le repasse en Pla
          return p.etat === StateCase.Choi ? { ...p, etat: StateCase.Pla } : p;
        });

        set({ grid: nextGrid, flatGrid: nextGrid.flat(), pions: nextPions });
      }
      return;
    }

    // 2. CLIC SUR LA GRILLE DU PLATEAU (tca === 1)
    if (targetCase.tca === 1) {
      if (targetCase.etat === StateCase.Lo) return;

      // Poser un pion sélectionné depuis le porte-pions vers une case vide de la grille
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

        // Passe le pion posé en Cre (utilisé) et nettoie l'état Choi des autres
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

      // Déplacer un pion déjà sur la grille vers une autre case vide de la grille
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

      // Sélectionner ou désélectionner un pion temporairement posé sur le plateau
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

    const lockedPlaceps = new Set(
      nextGrid
        .flat()
        .filter((c) => c.etat === StateCase.Lo && c.placep !== undefined)
        .map((c) => c.placep!)
    );

    const nextPions = pions.map((p) => ({
      ...p,
      etat: lockedPlaceps.has(p.placep!) ? StateCase.Cre : StateCase.Pla
    }));

    set({
      grid: nextGrid,
      flatGrid: nextGrid.flat(),
      pions: nextPions,
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
    const { grid, gameResults, scoreTotal, cnbjeu, pions, hasUsedMultiplicationOrDivision } = get();

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

    const lockedPlaceps = new Set(
      nextGrid
        .flat()
        .filter((c) => c.etat === StateCase.Lo && c.placep !== undefined)
        .map((c) => c.placep!)
    );

    const nextPions = pions.map((p) => ({
      ...p,
      etat: lockedPlaceps.has(p.placep!) ? StateCase.Cre : StateCase.Pla
    }));

    set({
      grid: nextGrid,
      flatGrid: nextGrid.flat(),
      pions: nextPions,
      scoreTotal: scoreTotal + selectedResult.notedjeu,
      cnbjeu: cnbjeu + 1,
      gameResults: [],
      directionsValid: { left: false, right: false, up: false, down: false },
      hasUsedMultiplicationOrDivision: nextHasUsedMulDiv
    });
  },

  resetToInitialState: () => {
    const { numbers, operators, numeromat } = get();
    const grid = createInitialGrid(numeromat);

    const resetNumbers: UneCase[] = numbers.map((p, index) => ({
      ...p,
      etat: StateCase.Pla,
      placep: index
    }));

    const resetOperators: UneCase[] = operators.map((p, index) => ({
      ...p,
      etat: StateCase.Pla,
      placep: numbers.length + index
    }));

    set({
      grid,
      flatGrid: grid.flat(),
      pions: [...resetNumbers, ...resetOperators],
      cnbjeu: 0,
      scoreTotal: 0,
      gameResults: [],
      directionsValid: { left: false, right: false, up: false, down: false },
      hasUsedMultiplicationOrDivision: false
    });
  }
}));