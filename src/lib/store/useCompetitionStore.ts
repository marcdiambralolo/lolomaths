import {
  createInitialGrid,
  getNextCase,
  isOperateur,
  calculateGameResult,
  isStartCaseCovered,
  validateCombination,
  collectSequence,
  getPlacedPions,
  hasLockedPionInSequence,
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
  hasUsedMultiplicationOrDivision: boolean; // NOUVEAU

  initGame: (numbersTxt: string[], operatorsTxt: string[], niveau?: Dtfil) => void;
  handleCaseClick: (targetCase: UneCase) => void;
  resetPions: () => void;
  calculateScores: () => void;
  confirmCalculation: (resultIndex: number) => void;
  // NOUVELLE FONCTION
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
  hasUsedMultiplicationOrDivision: false, // NOUVEAU

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
      hasUsedMultiplicationOrDivision: false // NOUVEAU
    });
  },

  handleCaseClick: (targetCase: UneCase) => {
    const { pions, flatGrid, grid } = get();

    // 1. Clic sur un pion du TileRack (Porte-pions)
    if (targetCase.tca === 2 || targetCase.tca === 3) {
      // Si le pion est déjà utilisé (StateCase.Cre), on ne peut pas le sélectionner
      if (targetCase.etat === StateCase.Cre) {
        return;
      }

      if (targetCase.etat === StateCase.Pla) {
        // Déselectionner tout pion sélectionné sur le plateau
        const nextGrid = grid.map((row) =>
          row.map((cell) => (cell.etat === StateCase.Choi ? { ...cell, etat: StateCase.Pla } : cell))
        );

        // Sélectionner le pion dans le TileRack
        const nextPions = pions.map((p) => ({
          ...p,
          etat: p.placep === targetCase.placep ? StateCase.Choi : StateCase.Pla
        }));

        set({ grid: nextGrid, flatGrid: nextGrid.flat(), pions: nextPions });
      }
      return;
    }

    // 2. Clic sur une case de la Grille/Plateau (tca == 1)
    if (targetCase.tca === 1) {
      // IMPORTANT: Ne pas permettre de sélectionner une case Lo (verrouillée)
      if (targetCase.etat === StateCase.Lo) {
        return;
      }

      const selectedPionInRack = pions.find((p) => p.etat === StateCase.Choi);
      const selectedCaseOnGrid = flatGrid.find((c) => c.etat === StateCase.Choi && c.ncase !== targetCase.ncase);

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

      // CAS B : Déplacer un pion non verrouillé DEPUIS le plateau VERS une autre case vide du plateau
      if (targetCase.etat === StateCase.Cre && selectedCaseOnGrid) {
        // Ne pas autoriser le déplacement d'un pion Lo (verrouillé)
        if (selectedCaseOnGrid.etat === StateCase.Lo) {
          return;
        }

        const nextGrid = grid.map((row) =>
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
        const nextGrid = grid.map((row) =>
          row.map((cell) => {
            if (cell.ncase === targetCase.ncase) {
              return { ...cell, etat: StateCase.Choi };
            }
            return cell.etat === StateCase.Choi ? { ...cell, etat: StateCase.Pla } : cell;
          })
        );

        set({ grid: nextGrid, flatGrid: nextGrid.flat(), pions: nextPions });
      }

      // CAS D : Remettre un pion du plateau dans le porte-pions (clic sur une case vide)
      if (targetCase.etat === StateCase.Cre && selectedCaseOnGrid) {
        // Cette partie est déjà gérée dans le CAS B
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
    const { grid, flatGrid, niveau, cnbjeu, hasUsedMultiplicationOrDivision } = get();

    // RÈGLE DE JEU : Si la case de départ (110) n'est pas recouverte, aucun calcul n'est possible
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

    directions.forEach((dir, index) => {
      // Utiliser le premier pion placé comme point de départ
      const firstPlaced = placedOnGrid[0];
      
      // Collecter la séquence complète dans cette direction
      const { sequence } = collectSequence(grid, firstPlaced, dir);

      // Vérifier si la séquence est valide (longueur impaire >= 3)
      if (!isValidSequence(sequence)) {
        return;
      }

      // VALIDATION COMPLÈTE avec toutes les règles
      const validation = validateCombination(sequence, placedOnGrid, cnbjeu, grid);

      if (validation.valid) {
        // Le bout de la séquence est le dernier élément (nombre cible)
        const boutCase = sequence[sequence.length - 1];
        
        if (boutCase && !isOperateur(boutCase.txt)) {
          // La séquence sans le bout (les pions de la combinaison)
          const sequenceWithoutBout = sequence.slice(0, -1);
          
          const gameRes = calculateGameResult(
            boutCase,
            sequenceWithoutBout,
            placedOnGrid,
            niveau,
            hasUsedMultiplicationOrDivision
          );
          
          results[index] = gameRes;

          // Activer la direction correspondante
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
      hasUsedMultiplicationOrDivision,
      numbers,
      operators
    } = get();
    
    const selectedResult = gameResults[resultIndex];

    if (!selectedResult) return;

    // Vérifier si la combinaison utilisée contient × ou ÷
    const hasMultiplicationOrDivision = selectedResult.combine.includes('*') || 
                                         selectedResult.combine.includes('/');
    const nextHasUsedMulDiv = hasUsedMultiplicationOrDivision || hasMultiplicationOrDivision;

    // Verrouillage définitif des pions joués pendant le coup (Passage en StateCase.Lo)
    const nextGrid = grid.map((row) =>
      row.map((cell) =>
        cell.etat === StateCase.Pla || cell.etat === StateCase.Choi
          ? { ...cell, etat: StateCase.Lo }
          : cell
      )
    );

    // Réinitialiser les pions pour le prochain jeu (mais garder les mêmes valeurs)
    // Les pions qui étaient sur le plateau sont maintenant Lo dans le grid
    // Les pions dans le rack repassent en StateCase.Pla
    const nextPions = pions.map((p) => ({ ...p, etat: StateCase.Pla }));

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

  // NOUVELLE FONCTION : Réinitialiser complètement l'état
  resetToInitialState: () => {
    const { numbers, operators, niveau } = get();
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