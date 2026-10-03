import { UneCase, StateCase, Sens, Dtfil, GameResult } from "@/lib/interfaces";

export const GRID_ROWS = 17;
export const GRID_COLS = 13;
export const START_CASE_INDEX = 110; // Case de départ centrale (Ligne 8, Col 6)

// Set réutilisable pour éviter la réallocation mémoire à chaque vérification
const OPERATORS_SET = new Set(['+', '-', '*', '/', '×', '÷']);

export function isOperateur(txt: string): boolean {
  return OPERATORS_SET.has(txt);
}

// ============================================================
// 1. GENERATEUR PSEUDO-ALEATOIRE DÉTERMINISTE (JavaRandom LCG 48-bit avec BigInt)
// ============================================================

export class JavaRandom {
  private seed: bigint;
  private static readonly MULTIPLIER = 0x5DEECE66Dn;
  private static readonly ADDEND = 0xBn;
  private static readonly MASK = (1n << 48n) - 1n;

  constructor(seed: number) {
    this.seed = (BigInt(seed) ^ JavaRandom.MULTIPLIER) & JavaRandom.MASK;
  }

  private next(bits: number): number {
    this.seed = (this.seed * JavaRandom.MULTIPLIER + JavaRandom.ADDEND) & JavaRandom.MASK;
    return Number(this.seed >> BigInt(48 - bits));
  }

  public nextDouble(): number {
    const high = BigInt(this.next(26));
    const low = BigInt(this.next(27));
    const combined = (high << 27n) + low;
    return Number(combined) / 9007199254740992; // 2^53
  }
}

/**
 * Mélange déterministe d'une liste (pioche de jetons / tirage initial)
 * Transposition stricte de radlist(list, seed) Kotlin.
 */
export function radlist(list: string[], seed: number | string): string[] {
  if (!list || list.length === 0) return [];

  const numericSeed = typeof seed === 'string' ? parseInt(seed, 10) || 12345 : seed;
  const rng = new JavaRandom(numericSeed);
  
  const pool = [...list];
  const lra: string[] = [];

  while (pool.length > 0) {
    const randomIndex = Math.floor(rng.nextDouble() * pool.length);
    lra.push(pool[randomIndex]);
    pool.splice(randomIndex, 1);
  }

  return lra;
}

/**
 * Distribution initiale de la main du joueur
 */
export function generateInitialRack(fullPool: string[], numeromat: string, count: number = 7): {
  rack: string[];
  remainingPool: string[];
} {
  const shuffledPool = radlist(fullPool, numeromat);
  return {
    rack: shuffledPool.slice(0, count),
    remainingPool: shuffledPool.slice(count)
  };
}

/**
 * Vérifie de façon sécurisée si la case de départ est couverte
 */
export const isStartCaseCovered = (flatGrid: UneCase[] | undefined | null): boolean => {
  if (!flatGrid || !Array.isArray(flatGrid)) return false;
  
  const startCase = flatGrid.find((cell) => cell.ncase === START_CASE_INDEX);
  if (!startCase) return false;
  
  return (
    startCase.etat === StateCase.Pla ||
    startCase.etat === StateCase.Choi ||
    startCase.etat === StateCase.Lo ||
    (startCase.txt !== '' && startCase.txt !== undefined)
  );
};

/**
 * Génère un nombre aléatoire (Fallback non déterministe)
 */
export function getRandomBoardNumber(): string {
  return Math.floor(Math.random() * 640).toString();
}

/**
 * Crée la grille initiale de 17 lignes x 13 colonnes
 */
export function createInitialGrid(numeromat?: string, listecaseRef?: string[]): UneCase[][] {
  let lcases: string[] = [];

  if (numeromat && listecaseRef && listecaseRef.length >= GRID_ROWS * GRID_COLS) {
    const seed = parseInt(numeromat, 10) || 12345;
    lcases = radlist(listecaseRef, seed);

    // Permutation forcée de la case 'depart' vers l'index central 110
    const indp = lcases.indexOf('depart');
    if (indp !== -1) {
      const tdep = lcases[START_CASE_INDEX];
      lcases[START_CASE_INDEX] = lcases[indp];
      lcases[indp] = tdep;
    }
  } else {
    for (let i = 0; i < GRID_ROWS * GRID_COLS; i++) {
      lcases.push(i === START_CASE_INDEX ? 'depart' : getRandomBoardNumber());
    }
  }

  const grid: UneCase[][] = [];
  let count = 0;
  for (let j = 0; j < GRID_ROWS; j++) {
    const row: UneCase[] = [];
    for (let i = 0; i < GRID_COLS; i++) {
      const val = lcases[count] || '';
      row.push({
        ncase: count,
        indi: i,
        indj: j,
        txt: val === 'depart' ? '' : val,
        itxt: val === 'depart' ? '' : val,
        etat: StateCase.Cre,
        tca: 1
      });
      count++;
    }
    grid.push(row);
  }
  return grid;
}

/**
 * Récupère la case suivante dans la direction indiquée
 */
export function getNextCase(grid: UneCase[][], current: UneCase, direction: Sens): UneCase | null {
  if (!grid || !current) return null;

  switch (direction) {
    case Sens.Right:
      return grid[current.indj]?.[current.indi + 1] || null;
    case Sens.Left:
      return grid[current.indj]?.[current.indi - 1] || null;
    case Sens.Up:
      return grid[current.indj - 1]?.[current.indi] || null;
    case Sens.Down:
      return grid[current.indj + 1]?.[current.indi] || null;
    default:
      return null;
  }
}

// ============================================================
// 2. FONCTIONS DE VALIDATION (Transposition Kotlin)
// ============================================================

export function sontDeMemeType(cellA: UneCase, cellB: UneCase): boolean {
  return isOperateur(cellA.txt) === isOperateur(cellB.txt);
}

export function validateAlternance(sequence: UneCase[]): boolean {
  if (!sequence || sequence.length < 3) return false;

  if (isOperateur(sequence[0].txt) || isOperateur(sequence[sequence.length - 1].txt)) {
    return false;
  }

  for (let i = 0; i < sequence.length - 1; i++) {
    if (sontDeMemeType(sequence[i], sequence[i + 1])) {
      return false;
    }
  }

  return true;
}

export function validateNoSuperposition(sequence: UneCase[], placedPions: UneCase[]): boolean {
  const usedCells = new Set<number>();
  for (const cell of sequence) {
    if (usedCells.has(cell.ncase)) return false;
    usedCells.add(cell.ncase);
  }

  for (const pion of placedPions) {
    if (pion.etat === StateCase.Pla || pion.etat === StateCase.Choi) {
      if (!sequence.some((cell) => cell.ncase === pion.ncase)) {
        return false;
      }
    }
  }

  return true;
}

export function validateEnchainement(sequence: UneCase[], cnbjeu: number): boolean {
  if (cnbjeu === 0) return true;
  return sequence.some((cell) => cell.etat === StateCase.Lo);
}

const isOccupied = (c: UneCase | null): boolean => {
  return Boolean(c && c.etat !== StateCase.Cre);
};

export function encadre(a: UneCase | null, b: UneCase | null): boolean {
  return isOccupied(a) === isOccupied(b);
}

/**
 * Validation optimisée de l'encadrement des opérateurs sur la grille
 */
export function validateOperateursEncadres(sequence: UneCase[], grid: UneCase[][]): boolean {
  if (!grid || grid.length === 0) return false;

  for (let j = 0; j < GRID_ROWS; j++) {
    for (let i = 0; i < GRID_COLS; i++) {
      const cell = grid[j]?.[i];
      if (cell && cell.etat !== StateCase.Cre && isOperateur(cell.txt)) {
        const left = i > 0 ? grid[j][i - 1] : null;
        const right = i < GRID_COLS - 1 ? grid[j][i + 1] : null;
        const up = j > 0 ? grid[j - 1][i] : null;
        const down = j < GRID_ROWS - 1 ? grid[j + 1][i] : null;

        if (!encadre(left, right) || !encadre(up, down)) {
          return false;
        }
      }
    }
  }
  return true;
}

export function validateCombination(
  sequence: UneCase[],
  placedPions: UneCase[],
  cnbjeu: number,
  grid: UneCase[][]
): { valid: boolean; reason?: string } {
  if (!validateAlternance(sequence)) {
    return { valid: false, reason: 'Alternance incorrecte ou fermeture non propre' };
  }

  if (!validateNoSuperposition(sequence, placedPions)) {
    return { valid: false, reason: 'Superposition détectée' };
  }

  if (!validateEnchainement(sequence, cnbjeu)) {
    return { valid: false, reason: 'Aucun pion verrouillé utilisé (enchaînement requis)' };
  }

  if (!validateOperateursEncadres(sequence, grid)) {
    return { valid: false, reason: 'Un ou plusieurs opérateurs ne sont pas encadrés sur le plateau' };
  }

  return { valid: true };
}

// ============================================================
// 3. FONCTIONS DE COLLECTE ET DE CALCUL DE SÉQUENCE
// ============================================================

export function collectSequence(
  grid: UneCase[][],
  startCase: UneCase,
  direction: Sens
): { sequence: UneCase[]; hasLoPion: boolean } {
  const sequence: UneCase[] = [];
  let hasLoPion = false;

  let current: UneCase | null = startCase;
  while (current && current.txt !== '') {
    sequence.push(current);
    if (current.etat === StateCase.Lo) hasLoPion = true;
    const next = getNextCase(grid, current, direction);
    if (next && next.etat === StateCase.Cre) break;
    current = next;
  }

  const oppositeDirections: Record<Sens, Sens> = {
    [Sens.Up]: Sens.Down,
    [Sens.Down]: Sens.Up,
    [Sens.Left]: Sens.Right,
    [Sens.Right]: Sens.Left
  };

  const oppositeDirection = oppositeDirections[direction];

  let prev = getNextCase(grid, startCase, oppositeDirection);
  while (prev && prev.txt !== '') {
    sequence.unshift(prev);
    if (prev.etat === StateCase.Lo) hasLoPion = true;
    const next = getNextCase(grid, prev, oppositeDirection);
    if (next && next.etat === StateCase.Cre) break;
    prev = next;
  }

  return { sequence, hasLoPion };
}

export function sortSequence(sequence: UneCase[], direction: Sens): UneCase[] {
  const isHorizontal = direction === Sens.Left || direction === Sens.Right;
  return [...sequence].sort((a, b) => {
    const aIndex = isHorizontal ? a.indi : a.indj;
    const bIndex = isHorizontal ? b.indi : b.indj;
    return aIndex - bIndex;
  });
}

// ============================================================
// 4. FONCTIONS UTILITAIRES POUR LE STORE ZUSTAND (Sécurisées)
// ============================================================

export function isValidSequence(sequence: UneCase[] | undefined | null): boolean {
  if (!sequence || !Array.isArray(sequence)) return false;
  return sequence.length >= 3 && sequence.length % 2 !== 0;
}

export function getPlacedPions(flatGrid: UneCase[] | undefined | null): UneCase[] {
  if (!flatGrid || !Array.isArray(flatGrid)) return [];
  return flatGrid.filter(
    (c) => c.etat === StateCase.Pla || c.etat === StateCase.Choi
  );
}

export function getLockedPions(flatGrid: UneCase[] | undefined | null): UneCase[] {
  if (!flatGrid || !Array.isArray(flatGrid)) return [];
  return flatGrid.filter((c) => c.etat === StateCase.Lo);
}

export function hasLockedPionInSequence(sequence: UneCase[] | undefined | null): boolean {
  if (!sequence || !Array.isArray(sequence)) return false;
  return sequence.some((cell) => cell.etat === StateCase.Lo);
}

/**
 * Évalue la formule et calcule la note et les bonus.
 * RÈGLE : TOUT coup est valide (inférieur, égal ou supérieur).
 * Les bonus s'appliquent UNIQUEMENT si Resultat === CaseVisée.
 */
export function calculateGameResult(
  targetCase: UneCase,
  sequence: UneCase[],
  placedPions: UneCase[],
  niveau: Dtfil,
  hasUsedMultiplicationOrDivision: boolean = false
): GameResult {
  const targetValue = parseInt(targetCase.itxt || targetCase.txt, 10) || 0;

  const game: GameResult = {
    nbreatind: targetValue,
    result: 0,
    notedbase: 0,
    bonus: 0,
    notedjeu: 0,
    combine: sequence ? sequence.map((c) => c.txt).join('') : '',
    targetCase
  };

  if (!sequence || sequence.length === 0) return game;

  // Évaluation sécurisée de l'expression mathématique
  const sanitizedExpr = sequence
    .map((c) => c.txt)
    .join('')
    .replace(/×|x/gi, '*')
    .replace(/÷/g, '/');

  let calculatedValue = 0;
  if (/^[0-9+\-*/().\s]+$/.test(sanitizedExpr)) {
    try {
      calculatedValue = Function(`"use strict"; return (${sanitizedExpr})`)();
    } catch {
      calculatedValue = 0;
    }
  }

  game.result = Number.isFinite(calculatedValue) ? calculatedValue : 0;

  const isExactMatch = game.result === game.nbreatind;

  if (isExactMatch) {
    // 1. Égalité parfaite : Note de base maximale (+5) + activation de tous les bonus
    game.notedbase = 5;

    let totalBonus = 0;
    const totalPionsUsed = sequence.length;

    // Bonus de longueur
    if (totalPionsUsed >= 7 && totalPionsUsed <= 10) {
      totalBonus += totalPionsUsed - 6;
    }

    // Bonus de palier par niveau
    if (niveau === Dtfil.Min && game.nbreatind >= 30) totalBonus += 1;
    if (niveau === Dtfil.Cad && game.nbreatind >= 100) totalBonus += 1;
    if (niveau === Dtfil.Jun && game.nbreatind >= 200) totalBonus += 1;
    if (niveau === Dtfil.Sen && game.nbreatind >= 300) totalBonus += 1;

    // Bonus d'opérateurs (* ou /)
    const hasMultiplicationOrDivision = sequence.some(
      (cell) => cell.txt === '*' || cell.txt === '/' || cell.txt === '×' || cell.txt === '÷'
    );
    if (hasMultiplicationOrDivision && !hasUsedMultiplicationOrDivision) {
      totalBonus += 1;
    }

    game.bonus = totalBonus;
  } else {
    // 2. Résultat supérieur ou inférieur : Valide, mais pénalité d'écart et AUCUN bonus
    const diff = Math.abs(game.nbreatind - game.result);
    game.notedbase = -diff;
    game.bonus = 0;
  }

  game.notedjeu = game.notedbase + game.bonus;

  return game;
}