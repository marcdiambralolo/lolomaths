import { create } from 'zustand';
import {
  calculateGameResult,
  collectSequence,
  createInitialGrid,
  getPlacedPions,
  isOperateur,
  isStartCaseCovered,
  isValidSequence,
  radlist,
  tpencadre,
  validateCombination,
} from '@/components/lolomaths/game/competitionEngine';
import { Dtfil, GameResult, Sens, StateCase, UneCase } from '@/lib/interfaces';
// Import différé pour éviter la dépendance circulaire
import { getNextCase } from '@/components/lolomaths/game/competitionEngine';

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
  pions: UneCase[]; // Tirage actif (10 pions : 6 nombres + 4 opérateurs)
  preGeneratedNumbers: string[][]; // Paquets de 6 nombres pré-générés
  preGeneratedOperators: string[][]; // Paquets de 4 opérateurs pré-générés
  rackIndex: number; // Index du paquet courant
  gameResults: GameResult[];
  niveau: Dtfil;
  cnbjeu: number;
  scoreTotal: number;
  directionsValid: DirectionsValid;

  // Actions
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
  resetToInitialState: () => void;
}

// ============================================================
// Helpers internes
// ============================================================

/**
 * Transposition de `chalespions` Kotlin :
 * découpe `pnf` en paquets de 6 et `pno` en paquets de 4.
 */
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

/**
 * Construit les `UneCase` pions à partir d'un paquet de nombres et d'opérateurs.
 */
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

/**
 * Désélectionne tous les pions et remet les cases `Choi` à `Pla`.
 */
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
  gameResults: [],
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
    const flatGrid = grid.flat();

    // Tirages pré-générés (fidèle à `chalespions` + `radlist`)
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
      flatGrid,
      numbers,
      operators,
      pions,
      preGeneratedNumbers: numbersRacks,
      preGeneratedOperators: operatorsRacks,
      rackIndex: 0,
      niveau,
      cnbjeu: 0,
      scoreTotal: 0,
      gameResults: [],
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

    // On garde les cases Lo, on remet tout le reste à Cre
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
      gameResults: [],
      directionsValid: { left: false, right: false, up: false, down: false },
    });
  },

  // ============================================================
  // INTERACTION (transposition de `deplacemen` / `choisirp` / `selectcase` / `depla` / `echa`)
  // ============================================================
  handleCaseClick: (targetCase: UneCase) => {
    const { pions, grid, flatGrid, cnbjeu } = get();

    const selectedPionInRack = pions.find((p) => p.etat === StateCase.Choi);
    const selectedCaseOnGrid = flatGrid.find(
      (c) => c.etat === StateCase.Choi && c.tca === 1
    );

    // ---------- 1. CLIC SUR LE RACK (tca === 2 ou 3) → `choisirp` ----------
    if (targetCase.tca === 2 || targetCase.tca === 3) {
      // Cas : une case du plateau est sélectionnée → `ramepion` (retour au rack)
      if (selectedCaseOnGrid) {
        const pionOfCase = pions.find(
          (p) => p.placep === selectedCaseOnGrid.placep
        );
        const nextGrid = grid.map((row) =>
          row.map((cell) =>
            cell.ncase === selectedCaseOnGrid.ncase
              ? { ...cell, txt: cell.itxt, etat: StateCase.Cre, placep: undefined }
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
        return;
      }

      // Cas : clic sur un pion du rack
      if (targetCase.etat === StateCase.Cre) return; // pion déjà utilisé

      if (targetCase.etat === StateCase.Pla || targetCase.etat === StateCase.Choi) {
        // Désélectionne les autres pions, sélectionne celui-ci
        const nextPions = pions.map((p) => {
          if (p.placep === targetCase.placep) {
            return { ...p, etat: StateCase.Choi };
          }
          return p.etat === StateCase.Choi ? { ...p, etat: StateCase.Pla } : p;
        });

        // Désélectionne les cases du plateau
        const nextGrid = grid.map((row) =>
          row.map((cell) =>
            cell.etat === StateCase.Choi ? { ...cell, etat: StateCase.Pla } : cell
          )
        );

        set({
          grid: nextGrid,
          flatGrid: nextGrid.flat(),
          pions: nextPions,
        });
      }
      return;
    }

    // ---------- 2. CLIC SUR LE PLATEAU (tca === 1) → `deplacemen` ----------
    if (targetCase.tca === 1) {
      if (targetCase.etat === StateCase.Lo) return;

      // --- Cas `Cre` : pose d'un pion ---
      if (targetCase.etat === StateCase.Cre) {
        // a) Un pion du rack est sélectionné → `echa`
        if (selectedPionInRack) {
          const nextGrid = grid.map((row) =>
            row.map((cell) => {
              if (cell.ncase === targetCase.ncase) {
                return {
                  ...cell,
                  txt: selectedPionInRack.txt,
                  etat: StateCase.Choi,
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

        // b) Une case du plateau est sélectionnée → `depla`
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

      // --- Cas `Pla` / `Choi` : sélection d'une case (`selectcase`) ---
      if (
        targetCase.etat === StateCase.Pla ||
        targetCase.etat === StateCase.Choi
      ) {
        const cleared = clearSelections(grid, pions);
        const nextGrid = cleared.grid.map((row) =>
          row.map((cell) =>
            cell.ncase === targetCase.ncase
              ? { ...cell, etat: StateCase.Choi }
              : cell
          )
        );
        const nextPions = cleared.pions.map((p) =>
          p.etat === StateCase.Choi ? { ...p, etat: StateCase.Pla } : p
        );

        set({
          grid: nextGrid,
          flatGrid: nextGrid.flat(),
          pions: nextPions,
        });
      }
    }
  },

  // ============================================================
  // RESET DU TOUR (fidèle à `chrgpions`)
  // ============================================================
  resetPions: () => {
    const { grid, pions, preGeneratedNumbers, preGeneratedOperators, rackIndex } =
      get();

    // On remet les cases non `Lo` à `Cre`, on garde les `Lo`
    const nextGrid = grid.map((row) =>
      row.map((cell) =>
        cell.etat !== StateCase.Lo
          ? { ...cell, txt: cell.itxt, etat: StateCase.Cre, placep: undefined }
          : cell
      )
    );

    // On recharge le rack courant depuis les tirages pré-générés
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
      gameResults: [],
      directionsValid: { left: false, right: false, up: false, down: false },
    });
  },

  // ============================================================
  // CALCUL DES SCORES (fidèle à `calculons` + `valideresult`)
  // ============================================================
  calculateScores: () => {
    const { grid, flatGrid, niveau, cnbjeu } = get();

    if (!isStartCaseCovered(flatGrid)) {
      set({
        directionsValid: { left: false, right: false, up: false, down: false },
        gameResults: [],
      });
      return;
    }

    const placedOnGrid = getPlacedPions(flatGrid);
    if (placedOnGrid.length === 0) {
      set({
        directionsValid: { left: false, right: false, up: false, down: false },
        gameResults: [],
      });
      return;
    }

    // Vérification préalable : tous les opérateurs posés doivent être encadrés
    if (tpencadre(grid)) {
      set({
        directionsValid: { left: false, right: false, up: false, down: false },
        gameResults: [],
      });
      return;
    }

    const results: GameResult[] = [];
    const directionsValid = {
      left: false,
      right: false,
      up: false,
      down: false,
    };
    const directions = [Sens.Up, Sens.Down, Sens.Left, Sens.Right];

    // On part du premier pion posé (fidèle à `pions.first { it.place }`)
    const firstPlaced = placedOnGrid[0];

    directions.forEach((dir) => {
      const { sequence } = collectSequence(grid, firstPlaced, dir);

      if (!isValidSequence(sequence)) return;

      const validation = validateCombination(
        sequence,
        placedOnGrid,
        cnbjeu,
        grid
      );

      if (!validation.valid) return;

      // La case suivant la fin de la séquence doit être vide/inoccupée
      const lastInSeq = sequence[sequence.length - 1];
      const nextAfterSeq = getNextCase(grid, lastInSeq, dir);
      if (!nextAfterSeq) return;
      if (nextAfterSeq.etat !== StateCase.Cre || nextAfterSeq.txt !== '') return;

      // La case cible (dernier élément) ne doit pas être un opérateur
      if (isOperateur(lastInSeq.txt)) return;

      // Séquence sans la case cible (la case cible = "bout")
      const sequenceWithoutBout = sequence.slice(0, -1);

      const gameRes = calculateGameResult(
        lastInSeq,
        sequenceWithoutBout,
        placedOnGrid,
        niveau
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
    });

    set({ gameResults: results, directionsValid });
  },

  // ============================================================
  // VALIDATION DU CALCUL (fidèle à `calc(w)`)
  // ============================================================
  confirmCalculation: (resultIndex: number) => {
    const { grid, gameResults, scoreTotal, cnbjeu } = get();

    const selectedResult = gameResults[resultIndex];
    if (!selectedResult) return;

    // Tous les pions posés passent en `Lo`
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
      gameResults: [],
      directionsValid: { left: false, right: false, up: false, down: false },
    });

    // Passage au jeu suivant (fidèle à `calc` → `radscore` → `lojeu` / `chrgpions`)
    get().nextJeu();
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
      gameResults: [],
      directionsValid: { left: false, right: false, up: false, down: false },
    });
  },
}));

