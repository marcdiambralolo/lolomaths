import { createInitialGrid, getNextCase, isOperateur, calculateGameResult, isStartCaseCovered } from '@/components/lolomaths/game/competitionEngine';
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

  initGame: (numbersTxt: string[], operatorsTxt: string[], niveau?: Dtfil) => void;
  handleCaseClick: (targetCase: UneCase) => void;
  resetPions: () => void;
  calculateScores: () => void;
  confirmCalculation: (resultIndex: number) => void;
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
      directionsValid: { left: false, right: false, up: false, down: false }
    });
  },

  handleCaseClick: (targetCase: UneCase) => {
    const { pions, flatGrid } = get();

    // 1. Clic sur un pion du TileRack (Porte-pions)
    if (targetCase.tca === 2 || targetCase.tca === 3) {
      if (targetCase.etat === StateCase.Pla) {
        // Délectionner tout pion sélectionné sur le plateau
        const nextGrid = get().grid.map((row) =>
          row.map((cell) => (cell.etat === StateCase.Choi ? { ...cell, etat: StateCase.Pla } : cell))
        );

        // Sélectionner le pion dans le TileRack
        const nextPions = pions.map((p) => ({
          ...p,
          etat: p.placep === targetCase.placep ? StateCase.Choi : StateCase.Pla
        }));

        set({ grid: nextGrid, flatGrid: nextGrid.flat(), pions: nextPions });
      } else if (targetCase.etat === StateCase.Cre) {
        // Si le pion est actuellement posé sur la grille, le réinitialiser/rappeler
        const activePionOnGrid = flatGrid.find(
          (c) => (c.etat === StateCase.Choi || c.etat === StateCase.Pla) && c.placep === targetCase.placep
        );
        if (activePionOnGrid) {
          get().resetPions();
        }
      }
      return;
    }

    // 2. Clic sur une case de la Grille/Plateau (tca == 1)
    if (targetCase.tca === 1) {
      const selectedPionInRack = pions.find((p) => p.etat === StateCase.Choi);
      const selectedCaseOnGrid = flatGrid.find((c) => c.etat === StateCase.Choi && c.ncase !== targetCase.ncase);

      // CAS A : Déposer un pion du TileRack sur une case vide de la grille
      if (targetCase.etat === StateCase.Cre && selectedPionInRack) {
        const nextGrid = get().grid.map((row) =>
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

      // CAS B : Déplacer un pion non verrouillé DEPUIS le plateau VERS une autre case vide du plateau
      if (targetCase.etat === StateCase.Cre && selectedCaseOnGrid && selectedCaseOnGrid.etat !== StateCase.Lo) {
        const nextGrid = get().grid.map((row) =>
          row.map((cell) => {
            // Libérer l'ancienne case
            if (cell.ncase === selectedCaseOnGrid.ncase) {
              return {
                ...cell,
                txt: cell.itxt,
                etat: StateCase.Cre,
                placep: undefined
              };
            }
            // Déplacer le pion sur la nouvelle case cible
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

      // CAS C : Clic sur une case du plateau déjà occupée par un pion non verrouillé (StateCase.Pla)
      if (targetCase.etat === StateCase.Pla) {
        // Défaire toute sélection dans le TileRack
        const nextPions = pions.map((p) => ({ ...p, etat: p.etat === StateCase.Choi ? StateCase.Pla : p.etat }));

        // Activer la sélection de cette case (ou la désélectionner si on clique à nouveau dessus)
        const nextGrid = get().grid.map((row) =>
          row.map((cell) => {
            if (cell.ncase === targetCase.ncase) {
              return { ...cell, etat: StateCase.Choi };
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
      directionsValid: { left: false, right: false, up: false, down: false },
      gameResults: []
    });
  },

  calculateScores: () => {
    const { grid, flatGrid, niveau } = get();

    // RÈGLE DE JEU : Si la case de départ (110) n'est pas recouverte, aucun calcul n'est possible
    if (!isStartCaseCovered(flatGrid)) {
      set({ directionsValid: { left: false, right: false, up: false, down: false }, gameResults: [] });
      return;
    }

    const placedOnGrid = flatGrid.filter((c) => c.etat === StateCase.Pla || c.etat === StateCase.Choi);

    if (placedOnGrid.length === 0) return;

    const results: GameResult[] = [];
    const directionsValid = { left: false, right: false, up: false, down: false };
    const directions = [Sens.Up, Sens.Down, Sens.Left, Sens.Right];

    directions.forEach((dir, index) => {
      const firstPlaced = placedOnGrid[0];
      const sequence: UneCase[] = [];
      let current: UneCase | null = firstPlaced;

      while (current && current.txt !== '') {
        sequence.push(current);
        current = getNextCase(grid, current, dir);
      }

      if (sequence.length >= 3 && sequence.length % 2 !== 0) {
        const boutCase = sequence[sequence.length - 1];
        if (boutCase && !isOperateur(boutCase.txt)) {
          const gameRes = calculateGameResult(boutCase, sequence.slice(0, -1), placedOnGrid, niveau);
          results[index] = gameRes;

          if (dir === Sens.Left) directionsValid.left = true;
          if (dir === Sens.Right) directionsValid.right = true;
          if (dir === Sens.Up) directionsValid.up = true;
          if (dir === Sens.Down) directionsValid.down = true;
        }
      }
    });

    set({ gameResults: results, directionsValid });
  },

  confirmCalculation: (resultIndex: number) => {
    const { grid, gameResults, scoreTotal, cnbjeu, pions } = get();
    const selectedResult = gameResults[resultIndex];

    if (!selectedResult) return;

    // Verrouillage définitif des pions joués pendant le coup (Passage en StateCase.Lo)
    const nextGrid = grid.map((row) =>
      row.map((cell) =>
        cell.etat === StateCase.Pla || cell.etat === StateCase.Choi
          ? { ...cell, etat: StateCase.Lo }
          : cell
      )
    );

    const nextPions = pions.map((p) => ({ ...p, etat: StateCase.Pla }));

    set({
      grid: nextGrid,
      flatGrid: nextGrid.flat(),
      pions: nextPions,
      scoreTotal: scoreTotal + selectedResult.notedjeu,
      cnbjeu: cnbjeu + 1,
      gameResults: [],
      directionsValid: { left: false, right: false, up: false, down: false }
    });
  }
}));