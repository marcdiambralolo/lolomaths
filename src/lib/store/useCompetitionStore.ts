import {
  createInitialGrid,
  isOperateur,
  calculateGameResult,
  isStartCaseCovered,
  validateCombination,
  collectSequence,
  getPlacedPions,
  isValidSequence
} from '@/components/lolomaths/game/competitionEngine';
import { create } from 'zustand';
import { UneCase, GameResult, Dtfil, StateCase, Sens } from '../interfaces';

interface CompetitionState {
  grid: UneCase[][];
  flatGrid: UneCase[];
  numbers: UneCase[];
  operators: UneCase[];
  pions: UneCase[];
  gameResults: GameResult[];
  niveau: Dtfil;
  cnbjeu: number;
  scoreTotal: number;
  directionsValid: { left: boolean; right: boolean; up: boolean; down: boolean };
  hasUsedMultiplicationOrDivision: boolean;

  initGame: (numbersTxt: string[], operatorsTxt: string[], niveau?: Dtfil) => void;
  handleCaseClick: (targetCase: UneCase) => void;
  resetPions: () => void;
  calculateScores: () => void;
  confirmCalculation: (resultIndex: number) => void;
  resetToInitialState: () => void;
}

export const useCompetitionStore = create<CompetitionState>((set, get) => ({
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

  initGame: (numbersTxt, operatorsTxt, niveau = Dtfil.Sen) => {
    const grid = createInitialGrid();
    const flatGrid = grid.flat();

    const numbers: UneCase[] = numbersTxt.map((txt, index) => ({
      ncase: index,
      indi: 0,
      indj: 0,
      txt,
      itxt: txt,
      etat: StateCase.Pla,
      tca: 2,
      placep: index
    }));

    const operators: UneCase[] = operatorsTxt.map((txt, index) => ({
      ncase: index,
      indi: 0,
      indj: 0,
      txt,
      itxt: txt,
      etat: StateCase.Pla,
      tca: 3,
      placep: numbersTxt.length + index
    }));

    const pions = [...numbers, ...operators];

    set({
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

  handleCaseClick: (targetCase: UneCase) => {
    const { pions, flatGrid, grid } = get();

    const selectedPionInRack = pions.find((p) => p.etat === StateCase.Choi);
    const selectedCaseOnGrid = flatGrid.find((c) => c.etat === StateCase.Choi && c.ncase !== targetCase.ncase);

    // 1. CLIC SUR LE TILERACK (Porte-pions)
    if (targetCase.tca === 2 || targetCase.tca === 3) {
      // CAS RETRAIT : Si une case du plateau est sélectionnée, remettre ce pion au porte-pions
      if (selectedCaseOnGrid && selectedCaseOnGrid.etat !== StateCase.Lo) {
        const nextGrid = grid.map((row) =>
          row.map((cell) => {
            if (cell.ncase === selectedCaseOnGrid.ncase) {
              return {
                ...cell,
                txt: cell.itxt,
                etat: StateCase.Cre,
                placep: undefined
              };
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

      // Si le pion du rack est déjà utilisé sur le plateau (StateCase.Cre), ignore
      if (targetCase.etat === StateCase.Cre) {
        return;
      }

      // Sélection / Désélection dans le TileRack
      if (targetCase.etat === StateCase.Pla || targetCase.etat === StateCase.Choi) {
        const nextGrid = grid.map((row) =>
          row.map((cell) => (cell.etat === StateCase.Choi ? { ...cell, etat: StateCase.Pla } : cell))
        );

        const nextPions = pions.map((p) => ({
          ...p,
          etat: p.placep === targetCase.placep && p.etat !== StateCase.Choi ? StateCase.Choi : StateCase.Pla
        }));

        set({ grid: nextGrid, flatGrid: nextGrid.flat(), pions: nextPions });
      }
      return;
    }

    // 2. CLIC SUR LA GRILLE DU PLATEAU (tca == 1)
    if (targetCase.tca === 1) {
      // Ignorer les cases verrouillées
      if (targetCase.etat === StateCase.Lo) {
        return;
      }

      // CAS A : Déposer un pion du TileRack sur une case vide de la grille
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

        const nextPions = pions.map((p) =>
          p.placep === selectedPionInRack.placep ? { ...p, etat: StateCase.Cre } : p
        );

        set({ grid: nextGrid, flatGrid: nextGrid.flat(), pions: nextPions });
        get().calculateScores();
        return;
      }

      // CAS B : Déplacer un pion non verrouillé DEPUIS le plateau VERS une autre case vide
      if (targetCase.etat === StateCase.Cre && selectedCaseOnGrid) {
        const nextGrid = grid.map((row) =>
          row.map((cell) => {
            if (cell.ncase === selectedCaseOnGrid.ncase) {
              return {
                ...cell,
                txt: cell.itxt,
                etat: StateCase.Cre,
                placep: undefined
              };
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

      // CAS C : Sélectionner un pion déjà placé sur la grille (StateCase.Pla / Choi)
      if (targetCase.etat === StateCase.Pla || targetCase.etat === StateCase.Choi) {
        const nextPions = pions.map((p) => ({ ...p, etat: p.etat === StateCase.Choi ? StateCase.Pla : p.etat }));

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

    // Libère toutes les cases non verrouillées
    const nextGrid = grid.map((row) =>
      row.map((cell) =>
        cell.etat !== StateCase.Lo
          ? { ...cell, txt: cell.itxt, etat: StateCase.Cre, placep: undefined }
          : cell
      )
    );

    // Identifie les pions actuellement verrouillés sur le plateau
    const lockedPlaceps = nextGrid
      .flat()
      .filter((c) => c.etat === StateCase.Lo && c.placep !== undefined)
      .map((c) => c.placep);

    // Les pions non verrouillés redeviennent disponibles dans le rack
    const nextPions = pions.map((p) => ({
      ...p,
      etat: lockedPlaceps.includes(p.placep) ? StateCase.Cre : StateCase.Pla
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

      if (!isValidSequence(sequence)) {
        return;
      }

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

          // Ajout dense dans le tableau
          results.push(gameRes);

          switch (dir) {
            case Sens.Left: directionsValid.left = true; break;
            case Sens.Right: directionsValid.right = true; break;
            case Sens.Up: directionsValid.up = true; break;
            case Sens.Down: directionsValid.down = true; break;
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
      pions,
      hasUsedMultiplicationOrDivision
    } = get();

    const selectedResult = gameResults[resultIndex];
    if (!selectedResult) return;

    const hasMultiplicationOrDivision =
      selectedResult.combine.includes('*') || selectedResult.combine.includes('/');
    const nextHasUsedMulDiv = hasUsedMultiplicationOrDivision || hasMultiplicationOrDivision;

    // Verrouillage définitif des pions joués sur le plateau (StateCase.Lo)
    const nextGrid = grid.map((row) =>
      row.map((cell) =>
        cell.etat === StateCase.Pla || cell.etat === StateCase.Choi
          ? { ...cell, etat: StateCase.Lo }
          : cell
      )
    );

    // Marquer dans le porte-pions les pions définitivement consommés
    const lockedPlaceps = nextGrid
      .flat()
      .filter((c) => c.etat === StateCase.Lo && c.placep !== undefined)
      .map((c) => c.placep);

    const nextPions = pions.map((p) => ({
      ...p,
      etat: lockedPlaceps.includes(p.placep) ? StateCase.Cre : StateCase.Pla
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
    const { numbers, operators } = get();
    const grid = createInitialGrid();
    const flatGrid = grid.flat();

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

    const resetPions = [...resetNumbers, ...resetOperators];

    set({
      grid,
      flatGrid,
      pions: resetPions,
      cnbjeu: 0,
      scoreTotal: 0,
      gameResults: [],
      directionsValid: { left: false, right: false, up: false, down: false },
      hasUsedMultiplicationOrDivision: false
    });
  }
}));