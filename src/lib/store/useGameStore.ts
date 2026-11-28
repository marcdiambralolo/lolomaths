import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  calculateGameResult,
  collectLineSequence,
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
  GameRecord,
  GameResult,
  MatchRecord,
  Sens,
  StateCase,
  TournamentRecord,
  TypeCase,
  UneCase,
} from '@/lib/interfaces';
import { useHistoryStore } from '@/lib/store/useHistoryStore';

const STORAGE_NAME = 'lolomaths-game';
const CURRENT_VERSION = 1;

interface DirectionsValid {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
}

export interface TournamentMeta {
  idConfig?: string;
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
  currentTournamentId: string | null;
  currentMatchId: string | null;
  tournamentMeta: TournamentMeta | null;
  matchIndex: number;
  numeromatch: string;

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
  validerCoupDirection: (resultIndex: number) => void;
  resetToInitialState: () => void;
  startTournament: (meta: TournamentMeta) => void;
  startMatch: (numeromatch: string) => void;
  endMatch: () => void;
  endTournament: () => void;
}

// ============================================================
// HELPERS
// ============================================================

const EMPTY_DIRECTIONS: DirectionsValid = {
  left: false,
  right: false,
  up: false,
  down: false,
};

const EMPTY_RESULTS: (GameResult | null)[] = [null, null, null, null];

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function toFiniteNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function mapNiveauToNumber(niveau: Dtfil): number {
  switch (niveau) {
    case Dtfil.Min:
      return 0;
    case Dtfil.Cad:
      return 1;
    case Dtfil.Jun:
      return 2;
    case Dtfil.Sen:
    default:
      return 3;
  }
}

function buildGameRecord(
  result: GameResult,
  coupNumber: number,
  matchId: string,
  tournamentId: string,
  niveau: Dtfil
): GameRecord {
  const now = new Date().toISOString();
  const notejeu = toFiniteNumber(
    result.notedjeu,
    toFiniteNumber(result.score, 0)
  );
  const notedebase = toFiniteNumber(result.notedbase, 0);
  const bonus = toFiniteNumber(result.bonus, 0);
  const nombreaatteindre = toFiniteNumber(result.nbreatind, 0);
  const resultatcalcul = toFiniteNumber(result.result, 0);
  const seqIds = Array.isArray(result.sequenceNcases)
    ? result.sequenceNcases.join(',')
    : '';

  return {
    id: result._id || (typeof result.idjeu === 'string' ? result.idjeu : '') || generateId('game'),
    matchId,
    tournamentId,
    numjeu: coupNumber,
    combinaison: result.combine ?? '',
    sequencePions: seqIds,
    cible: nombreaatteindre,
    resultat: resultatcalcul,
    nombreaatteindre,
    resultatcalcul,
    notedebase,
    bonus,
    notejeu,
    niveau: mapNiveauToNumber(niveau),
    dateCreation: result.date || result.createdAt || now,
  };
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

function addPermanentOperators(
  operators: UneCase[],
  startIndex: number
): UneCase[] {
  return [
    ...operators,
    {
      ncase: -1,
      indi: 0,
      indj: 0,
      txt: '+',
      itxt: '+',
      etat: StateCase.Pla,
      tca: TypeCase.PionOperateur,
      placep: startIndex,
    },
    {
      ncase: -1,
      indi: 0,
      indj: 0,
      txt: '-',
      itxt: '-',
      etat: StateCase.Pla,
      tca: TypeCase.PionOperateur,
      placep: startIndex + 1,
    },
  ];
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

  const baseOperators: UneCase[] = operatorsTxt.map((txt, index) => ({
    ncase: -1,
    indi: 0,
    indj: 0,
    txt,
    itxt: txt,
    etat: StateCase.Pla,
    tca: TypeCase.PionOperateur,
    placep: numbersTxt.length + index,
  }));

  const operators = addPermanentOperators(
    baseOperators,
    numbersTxt.length + baseOperators.length
  );

  return { numbers, operators, pions: [...numbers, ...operators] };
}

function clearTargets(grid: UneCase[][]): UneCase[][] {
  return grid.map((row) =>
    row.map((cell) => (cell.isTarget ? { ...cell, isTarget: false } : cell))
  );
}

function clearGridChoiAndTargets(grid: UneCase[][]): UneCase[][] {
  return grid.map((row) =>
    row.map((cell) => {
      const needsTargetClear = Boolean(cell.isTarget);
      const needsChoiClear = cell.etat === StateCase.Choi;
      if (!needsTargetClear && !needsChoiClear) return cell;
      return {
        ...cell,
        isTarget: false,
        etat: needsChoiClear ? StateCase.Pla : cell.etat,
      };
    })
  );
}

function clearRackChoi(pions: UneCase[]): UneCase[] {
  return pions.map((p) =>
    p.etat === StateCase.Choi ? { ...p, etat: StateCase.Pla } : p
  );
}

function selectPionInRack(pions: UneCase[], placep: number): UneCase[] {
  return pions.map((p) => {
    if (p.placep === placep) {
      return {
        ...p,
        etat: p.etat === StateCase.Choi ? StateCase.Pla : StateCase.Choi,
      };
    }
    return p.etat === StateCase.Choi ? { ...p, etat: StateCase.Pla } : p;
  });
}

function selectCaseOnGrid(grid: UneCase[][], ncase: number): UneCase[][] {
  return grid.map((row) =>
    row.map((cell) => {
      const clearedTarget = cell.isTarget ? { ...cell, isTarget: false } : cell;
      if (clearedTarget.ncase === ncase) {
        return {
          ...clearedTarget,
          etat:
            clearedTarget.etat === StateCase.Choi
              ? StateCase.Pla
              : StateCase.Choi,
        };
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

  const intermediate = grid.map((row) =>
    row.map((cell) => {
      if (cell.ncase === fromNcase) {
        movedTxt = cell.txt;
        movedPlacep = cell.placep;
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
            etat: StateCase.Pla,
            placep: movedPlacep,
            isTarget: false,
          }
        : cell
    )
  );
}

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
  gameResults: [...EMPTY_RESULTS],
  niveau: Dtfil.Jun,
  cnbjeu: 0,
  nombredejeu: 20,
  scoreTotal: 0,
  directionsValid: { ...EMPTY_DIRECTIONS },
  lastConfirmedResult: null as GameResult | null,
  isMatchOver: false,
  currentTournamentId: null as string | null,
  currentMatchId: null as string | null,
  tournamentMeta: null as TournamentMeta | null,
  matchIndex: 0,
  numeromatch: '',
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      initGame: (
        numbersTxt,
        operatorsTxt,
        niveau = Dtfil.Sen,
        numeromat = '0123456789',
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
          gameResults: [...EMPTY_RESULTS],
          lastConfirmedResult: null,
          directionsValid: { ...EMPTY_DIRECTIONS },
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
            gameResults: [...EMPTY_RESULTS],
            directionsValid: { ...EMPTY_DIRECTIONS },
            isMatchOver: true,
          });
          get().endMatch();
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
          gameResults: [...EMPTY_RESULTS],
          directionsValid: { ...EMPTY_DIRECTIONS },
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

        const isRackTarget =
          targetCase.tca === TypeCase.PionChiffre ||
          targetCase.tca === TypeCase.PionOperateur;

        if (selectedCaseOnGrid && isRackTarget) {
          const pionPlacep = selectedCaseOnGrid.placep;
          if (pionPlacep === undefined) return;

          const nextGrid = removePionFromGrid(grid, selectedCaseOnGrid.ncase);
          const nextPions = pions.map((p) => {
            if (p.placep === pionPlacep || p.etat === StateCase.Choi) {
              return { ...p, etat: StateCase.Pla };
            }
            return p;
          });

          set({
            grid: nextGrid,
            flatGrid: nextGrid.flat(),
            pions: nextPions,
          });
          get().calculateScores();
          return;
        }

        if (isRackTarget) {
          if (
            targetCase.etat === StateCase.Pla ||
            targetCase.etat === StateCase.Choi
          ) {
            if (targetCase.placep === undefined) return;
            const pionExists = pions.some((p) => p.placep === targetCase.placep);
            if (!pionExists) return;

            const nextPions = selectPionInRack(pions, targetCase.placep);
            const nextGrid = clearGridChoiAndTargets(grid);

            set({
              grid: nextGrid,
              flatGrid: nextGrid.flat(),
              pions: nextPions,
            });
          }
          return;
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
            }
            return;
          }

          if (
            targetCase.etat === StateCase.Pla ||
            targetCase.etat === StateCase.Choi
          ) {
            const clearedPions = clearRackChoi(pions);
            const nextGrid = selectCaseOnGrid(grid, targetCase.ncase);
            set({
              grid: nextGrid,
              flatGrid: nextGrid.flat(),
              pions: clearedPions,
            });
            get().calculateScores();
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
          gameResults: [...EMPTY_RESULTS],
          directionsValid: { ...EMPTY_DIRECTIONS },
        });
      },

      calculateScores: () => {
        const { grid, niveau, cnbjeu, isMatchOver } = get();

        const baseGrid = clearTargets(grid);
        const baseFlatGrid = baseGrid.flat();

        if (
          isMatchOver ||
          !isStartCaseCovered(baseFlatGrid) ||
          tpencadre(baseGrid)
        ) {
          set({
            grid: baseGrid,
            flatGrid: baseFlatGrid,
            directionsValid: { ...EMPTY_DIRECTIONS },
            gameResults: [...EMPTY_RESULTS],
          });
          return;
        }

        const placedOnGrid = getPlacedPions(baseFlatGrid);
        if (placedOnGrid.length === 0) {
          set({
            grid: baseGrid,
            flatGrid: baseFlatGrid,
            directionsValid: { ...EMPTY_DIRECTIONS },
            gameResults: [...EMPTY_RESULTS],
          });
          return;
        }

        const sortedPlaced = [...placedOnGrid].sort((a, b) =>
          a.indj !== b.indj ? a.indj - b.indj : a.indi - b.indi
        );
        const anchorCase = sortedPlaced[0];

        const results: (GameResult | null)[] = [...EMPTY_RESULTS];
        const directionsValid: DirectionsValid = { ...EMPTY_DIRECTIONS };

        const directions = [
          { sens: Sens.Up, index: 0, key: 'up' as const },
          { sens: Sens.Down, index: 1, key: 'down' as const },
          { sens: Sens.Left, index: 2, key: 'left' as const },
          { sens: Sens.Right, index: 3, key: 'right' as const },
        ];

        const targetGrid: UneCase[][] = baseGrid.map((row) =>
          row.map((cell) => ({ ...cell }))
        );

        directions.forEach(({ sens, index, key }) => {
          const orientation =
            sens === Sens.Left || sens === Sens.Right
              ? 'horizontal'
              : 'vertical';
          const { sequence } = collectLineSequence(
            baseGrid,
            anchorCase,
            orientation
          );
          if (!isValidSequence(sequence)) return;

          const validation = validateCombination(
            sequence,
            sortedPlaced,
            cnbjeu,
            baseGrid
          );
          if (!validation.valid) return;

          const sorted = sortSequence(sequence, sens);
          // Après sortSequence (qui inverse pour Up et Left),
          // le dernier élément est toujours celui adjacent à la case cible.
          const edgeCase = sorted[sorted.length - 1];

          const targetCase = getNextCase(baseGrid, edgeCase, sens);
          if (
            !targetCase ||
            targetCase.etat !== StateCase.Cre ||
            isOperateur(targetCase.txt) ||
            targetCase.txt === ''
          ) {
            return;
          }

          const targetRow = targetGrid[targetCase.indj];
          if (targetRow) {
            targetRow[targetCase.indi] = {
              ...targetRow[targetCase.indi],
              isTarget: true,
            };
          }

          results[index] = calculateGameResult(
            targetCase,
            sorted,
            sortedPlaced,
            niveau
          );
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
        const {
          grid,
          gameResults,
          scoreTotal,
          isMatchOver,
          pions,
          currentTournamentId,
          currentMatchId,
          cnbjeu,
          niveau,
        } = get();
        if (isMatchOver) return;

        const selectedResult = gameResults[resultIndex];
        if (!selectedResult) return;

        const validatedNcases = new Set(selectedResult.sequenceNcases);
        const validatedPlacep = new Set<number>();

        grid.forEach((row) => {
          row.forEach((cell) => {
            if (
              validatedNcases.has(cell.ncase) &&
              cell.placep !== undefined &&
              cell.placep !== null
            ) {
              validatedPlacep.add(cell.placep);
            }
          });
        });

        const nextGrid = grid.map((row) =>
          row.map((cell) => {
            if (validatedNcases.has(cell.ncase)) {
              return { ...cell, etat: StateCase.Lo, isTarget: false };
            }
            if (cell.etat === StateCase.Pla || cell.etat === StateCase.Choi) {
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

        const nextPions = pions.filter((pion) => {
          if (pion.placep === undefined || pion.placep === null) return true;
          return !validatedPlacep.has(pion.placep);
        });

        const gainedNote = toFiniteNumber(
          selectedResult.notedjeu,
          toFiniteNumber(selectedResult.score, 0)
        );
        const nextScoreTotal = toFiniteNumber(scoreTotal, 0) + gainedNote;

        set({
          grid: nextGrid,
          flatGrid: nextGrid.flat(),
          pions: nextPions,
          scoreTotal: nextScoreTotal,
          lastConfirmedResult: selectedResult,
          gameResults: [...EMPTY_RESULTS],
          directionsValid: { ...EMPTY_DIRECTIONS },
        });

        if (currentTournamentId && currentMatchId) {
          const gameRecord = buildGameRecord(
            selectedResult,
            cnbjeu + 1,
            currentMatchId,
            currentTournamentId,
            niveau
          );
          useHistoryStore
            .getState()
            .saveGame(currentTournamentId, currentMatchId, gameRecord);
        }

        get().nextJeu();
      },

      validerCoupDirection: (resultIndex: number) => {
        get().confirmCalculation(resultIndex);
      },

      resetToInitialState: () => {
        const { numeromat, nombredejeu } = get();
        const grid = createInitialGrid(numeromat);
        set({
          ...INITIAL_STATE,
          numeromat,
          nombredejeu,
          grid,
          flatGrid: grid.flat(),
        });
      },

      startTournament: (meta: TournamentMeta) => {
        const now = new Date().toISOString();
        const tournamentId = generateId('tour');
        const matchId = generateId('match');

        const tournamentRecord: TournamentRecord = {
          id: tournamentId,
          idConfig: meta.idConfig ?? '',
          numtournoi: meta.numtournoi,
          nomjoueur: meta.nomjoueur,
          niveau: mapNiveauToNumber(meta.niveau),
          couleurs: meta.couleurs,
          nombredejeu: meta.nombredejeu,
          nbmatch: meta.nbmatch,
          tempsmatch: meta.tempsmatch,
          tpsglobal: meta.tpsglobal,
          score: 0,
          datedebut: now,
          datefin: null,
          isGameOver: false,
          isgameover: false,
          matchs: [
            {
              id: matchId,
              tournamentId,
              numordrep: 1,
              numeromatch: '1',
              score: 0,
              isGameOver: false,
              datedebut: now,
              datefin: null,
              jeux: [],
            },
          ],
        };

        useHistoryStore.getState().saveTournament(tournamentRecord);

        set({
          currentTournamentId: tournamentId,
          currentMatchId: matchId,
          tournamentMeta: meta,
          matchIndex: 1,
          numeromatch: '1',
          scoreTotal: 0,
          isMatchOver: false,
        });
      },

      startMatch: (numeromatch: string) => {
        const { matchIndex, currentTournamentId, tournamentMeta } = get();
        const now = new Date().toISOString();
        const nextIndex = matchIndex + 1;
        const matchId = generateId('match');

        if (currentTournamentId) {
          const matchRecord: MatchRecord = {
            id: matchId,
            tournamentId: currentTournamentId,
            numordrep: nextIndex,
            numeromatch: numeromatch || String(nextIndex),
            score: 0,
            isGameOver: false,
            datedebut: now,
            datefin: null,
            jeux: [],
          };
          useHistoryStore.getState().saveMatch(currentTournamentId, matchRecord);
        }

        set({
          currentMatchId: matchId,
          matchIndex: nextIndex,
          numeromatch: numeromatch || String(nextIndex),
          scoreTotal: 0,
          isMatchOver: false,
          cnbjeu: 0,
          rackIndex: 0,
          nombredejeu: tournamentMeta?.nombredejeu ?? get().nombredejeu,
          gameResults: [...EMPTY_RESULTS],
          directionsValid: { ...EMPTY_DIRECTIONS },
        });
      },

      endMatch: () => {
        const {
          currentTournamentId,
          currentMatchId,
          matchIndex,
          numeromatch,
          scoreTotal,
        } = get();
        const now = new Date().toISOString();

        set({ isMatchOver: true });

        if (currentTournamentId && currentMatchId) {
          const historyStore = useHistoryStore.getState();
          const existingTournament = historyStore.getTournament(
            currentTournamentId
          );
          const existingMatch = existingTournament?.matchs?.find(
            (m) => m.id === currentMatchId
          );

          const finishedMatch: MatchRecord = {
            id: currentMatchId,
            tournamentId: currentTournamentId,
            numordrep: existingMatch?.numordrep ?? matchIndex,
            numeromatch:
              existingMatch?.numeromatch ?? (numeromatch || String(matchIndex)),
            score: toFiniteNumber(scoreTotal, existingMatch?.score ?? 0),
            isGameOver: true,
            datedebut: existingMatch?.datedebut ?? now,
            datefin: existingMatch?.datefin ?? now,
            jeux: existingMatch?.jeux ?? [],
          };

          historyStore.saveMatch(currentTournamentId, finishedMatch);
        }
      },

      endTournament: () => {
        const { currentTournamentId, tournamentMeta } = get();
        const now = new Date().toISOString();

        if (currentTournamentId) {
          const historyStore = useHistoryStore.getState();
          const existing = historyStore.getTournament(currentTournamentId);
          if (existing) {
            historyStore.saveTournament({
              ...existing,
              isGameOver: true,
              isgameover: true,
              datefin: existing.datefin ?? now,
              nombredejeu: tournamentMeta?.nombredejeu ?? existing.nombredejeu,
              nbmatch: tournamentMeta?.nbmatch ?? existing.nbmatch,
            });
          }
        }

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
      partialize: (state) => ({
        numeromat: state.numeromat,
        grid: state.grid,
        numbers: state.numbers,
        operators: state.operators,
        pions: state.pions,
        preGeneratedNumbers: state.preGeneratedNumbers,
        preGeneratedOperators: state.preGeneratedOperators,
        rackIndex: state.rackIndex,
        niveau: state.niveau,
        cnbjeu: state.cnbjeu,
        nombredejeu: state.nombredejeu,
        scoreTotal: state.scoreTotal,
        lastConfirmedResult: state.lastConfirmedResult,
        isMatchOver: state.isMatchOver,
        currentTournamentId: state.currentTournamentId,
        currentMatchId: state.currentMatchId,
        tournamentMeta: state.tournamentMeta,
        matchIndex: state.matchIndex,
        numeromatch: state.numeromatch,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.grid)) {
          state.flatGrid = state.grid.flat();
        }
      },
    }
  )
);