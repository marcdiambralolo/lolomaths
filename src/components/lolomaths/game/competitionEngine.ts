import {
  UneCase,
  StateCase,
  Sens,
  Dtfil,
  GameResult,
  TypeCase,
} from '@/lib/interfaces';

// ============================================================
// CONSTANTES GLOBALES
// ============================================================

export const GRID_ROWS = 17;
export const GRID_COLS = 13;
export const START_CASE_INDEX = 110; // Case de départ centrale (Ligne 8, Col 6)

/** Taille d'un rack : nombre de pions chiffres + opérateurs. */
export const RACK_NUMBERS_COUNT = 6;
export const RACK_OPERATORS_COUNT = 4;

/** Symbole interne pour la case départ. */
export const DEPART_SYMBOL = 'depart';

/**
 * Set des opérateurs reconnus. Inclut les variantes Unicode `×` et `÷`.
 */
const OPERATORS_SET: ReadonlySet<string> = new Set([
  '+',
  '-',
  '*',
  '/',
  '×',
  '÷',
]);

/**
 * Vérifie si une chaîne est un opérateur.
 */
export function isOperateur(txt: string): boolean {
  return OPERATORS_SET.has(txt);
}

// ============================================================
// 1. GÉNÉRATEUR PSEUDO-ALÉATOIRE DÉTERMINISTE
//    (JavaRandom LCG 48-bit — transposition stricte de Kotlin)
// ============================================================

export class JavaRandom {
  private seed: bigint;
  private static readonly MULTIPLIER = 0x5deece66dn;
  private static readonly ADDEND = 0xbn;
  private static readonly MASK = (1n << 48n) - 1n;

  constructor(seed: number) {
    this.seed = (BigInt(seed) ^ JavaRandom.MULTIPLIER) & JavaRandom.MASK;
  }

  private next(bits: number): number {
    this.seed =
      (this.seed * JavaRandom.MULTIPLIER + JavaRandom.ADDEND) & JavaRandom.MASK;
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
 * Mélange déterministe d'une liste — transposition stricte de `radlist` Kotlin.
 *
 * ⚠️ Lève une erreur explicite si le mélange n'aboutit pas (au lieu de
 *    retourner une liste incomplète silencieusement).
 */
export function radlist(list: string[], seed: number | string): string[] {
  if (!list || list.length === 0) return [];

  const numericSeed =
    typeof seed === 'string' ? parseInt(seed, 10) || 12345 : seed;
  const rng = new JavaRandom(numericSeed);
  const lra: string[] = [];
  const use = new Array<boolean>(list.length).fill(false);

  const maxIterations = list.length * 1000;
  let iterations = 0;

  while (lra.length < list.length) {
    if (++iterations > maxIterations) {
      throw new Error(
        `[radlist] Impossible de mélanger la liste (seed=${numericSeed}, taille=${list.length}).`
      );
    }

    const compteur = Math.round(rng.nextDouble() * (list.length - 1));

    if (compteur < 0 || compteur >= list.length) continue;
    if (use[compteur]) continue;

    use[compteur] = true;
    lra.push(list[compteur]);
  }

  return lra;
}

/**
 * Distribution du rack à partir d'un pool.
 */
export function generateInitialRack(
  fullPool: string[],
  numeromat: string,
  count = 7
): { rack: string[]; remainingPool: string[] } {
  const shuffledPool = radlist(fullPool, numeromat);
  return {
    rack: shuffledPool.slice(0, count),
    remainingPool: shuffledPool.slice(count),
  };
}

// ============================================================
// 2. CONSTRUCTION DE LA GRILLE
// ============================================================

/**
 * Transposition stricte de `malisteca(numeromat, wl)` Kotlin.
 */
export function malisteca(numeromat: string, wl: string[]): string[] {
  const lcases = radlist(wl, numeromat);
  const indp = lcases.indexOf(DEPART_SYMBOL);
  if (indp !== -1 && indp !== START_CASE_INDEX) {
    const tdep = lcases[START_CASE_INDEX];
    lcases[START_CASE_INDEX] = lcases[indp];
    lcases[indp] = tdep;
  }
  return lcases;
}

/**
 * Fallback non déterministe : génère un nombre aléatoire pour la grille.
 */
export function getRandomBoardNumber(): string {
  return Math.floor(Math.random() * 640).toString();
}

/**
 * Crée la grille initiale (17 × 13).
 */
export function createInitialGrid(
  numeromat?: string,
  listecaseRef?: string[]
): UneCase[][] {
  let lcases: string[] = [];

  if (
    numeromat &&
    listecaseRef &&
    listecaseRef.length >= GRID_ROWS * GRID_COLS
  ) {
    lcases = malisteca(numeromat, listecaseRef);
  } else {
    for (let i = 0; i < GRID_ROWS * GRID_COLS; i++) {
      lcases.push(i === START_CASE_INDEX ? DEPART_SYMBOL : getRandomBoardNumber());
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
        txt: val === DEPART_SYMBOL ? '' : val,
        itxt: val === DEPART_SYMBOL ? '' : val,
        etat: StateCase.Cre,
        tca: TypeCase.Plateau,
      });
      count++;
    }
    grid.push(row);
  }
  return grid;
}

// ============================================================
// 3. NAVIGATION SUR LA GRILLE
// ============================================================

export function getNextCase(
  grid: UneCase[][],
  current: UneCase,
  direction: Sens
): UneCase | null {
  if (!grid || !current) return null;
  switch (direction) {
    case Sens.Right:
      return grid[current.indj]?.[current.indi + 1] ?? null;
    case Sens.Left:
      return grid[current.indj]?.[current.indi - 1] ?? null;
    case Sens.Up:
      return grid[current.indj - 1]?.[current.indi] ?? null;
    case Sens.Down:
      return grid[current.indj + 1]?.[current.indi] ?? null;
    default:
      return null;
  }
}

// ============================================================
// 4. VALIDATIONS
// ============================================================

export function sontDeMemeType(a: UneCase, b: UneCase): boolean {
  return isOperateur(a.txt) === isOperateur(b.txt);
}

export function validateAlternance(sequence: UneCase[]): boolean {
  if (!sequence || sequence.length < 3) return false;
  if (isOperateur(sequence[0].txt)) return false;
  if (isOperateur(sequence[sequence.length - 1].txt)) return false;

  for (let i = 0; i < sequence.length - 1; i++) {
    if (sontDeMemeType(sequence[i], sequence[i + 1])) return false;
  }
  return true;
}

export function validateNoSuperposition(
  sequence: UneCase[],
  placedPions: UneCase[]
): boolean {
  const used = new Set<number>();
  for (const c of sequence) {
    if (used.has(c.ncase)) return false;
    used.add(c.ncase);
  }
  for (const p of placedPions) {
    if (
      (p.etat === StateCase.Pla || p.etat === StateCase.Choi) &&
      !sequence.some((c) => c.ncase === p.ncase)
    ) {
      return false;
    }
  }
  return true;
}

export function validateEnchainement(
  sequence: UneCase[],
  cnbjeu: number
): boolean {
  if (cnbjeu === 0) return true;
  return sequence.some((c) => c.etat === StateCase.Lo);
}

export function encadre(a: UneCase | null, b: UneCase | null): boolean {
  if (a === null && b === null) return true;
  if (a === null) return b !== null && b.etat === StateCase.Cre;
  if (b === null) return a.etat === StateCase.Cre;
  if (a.etat !== StateCase.Cre && b.etat === StateCase.Cre) return false;
  if (b.etat !== StateCase.Cre && a.etat === StateCase.Cre) return false;
  return true;
}

export function tpencadre(grid: UneCase[][]): boolean {
  for (let j = 0; j < GRID_ROWS; j++) {
    for (let i = 0; i < GRID_COLS; i++) {
      const cell = grid[j]?.[i];
      if (!cell) continue;
      if (cell.etat === StateCase.Cre) continue;
      if (!isOperateur(cell.txt)) continue;

      const left = i > 0 ? grid[j][i - 1] : null;
      const right = i < GRID_COLS - 1 ? grid[j][i + 1] : null;
      const up = j > 0 ? grid[j - 1][i] : null;
      const down = j < GRID_ROWS - 1 ? grid[j + 1][i] : null;

      if (!encadre(left, right)) return true;
      if (!encadre(up, down)) return true;
    }
  }
  return false;
}

export function validateCombination(
  sequence: UneCase[],
  placedPions: UneCase[],
  cnbjeu: number,
  grid: UneCase[][]
): { valid: boolean; reason?: string } {
  if (!validateAlternance(sequence)) {
    return { valid: false, reason: 'Alternance incorrecte' };
  }
  if (!validateNoSuperposition(sequence, placedPions)) {
    return { valid: false, reason: 'Superposition détectée' };
  }
  if (!validateEnchainement(sequence, cnbjeu)) {
    return { valid: false, reason: 'Aucun pion verrouillé utilisé' };
  }
  if (tpencadre(grid)) {
    return { valid: false, reason: 'Opérateur non encadré sur le plateau' };
  }
  return { valid: true };
}

// ============================================================
// 5. COLLECTE DE SÉQUENCE
// ============================================================

export function collectSequence(
  grid: UneCase[][],
  startCase: UneCase,
  direction: Sens
): { sequence: UneCase[]; hasLoPion: boolean } {
  const sequence: UneCase[] = [];
  let hasLoPion = false;

  let current: UneCase | null = startCase;
  while (current && current.txt !== '' && current.etat !== StateCase.Cre) {
    sequence.push(current);
    if (current.etat === StateCase.Lo) hasLoPion = true;
    const next = getNextCase(grid, current, direction);
    if (!next) break;
    if (next.etat === StateCase.Cre || next.txt === '') break;
    current = next;
  }

  const opposite: Record<Sens, Sens> = {
    [Sens.Up]: Sens.Down,
    [Sens.Down]: Sens.Up,
    [Sens.Left]: Sens.Right,
    [Sens.Right]: Sens.Left,
  };
  let prev = getNextCase(grid, startCase, opposite[direction]);
  while (prev && prev.txt !== '' && prev.etat !== StateCase.Cre) {
    sequence.unshift(prev);
    if (prev.etat === StateCase.Lo) hasLoPion = true;
    const next = getNextCase(grid, prev, opposite[direction]);
    if (!next) break;
    if (next.etat === StateCase.Cre || next.txt === '') break;
    prev = next;
  }

  return { sequence, hasLoPion };
}

export function sortSequence(sequence: UneCase[], direction: Sens): UneCase[] {
  const isHorizontal = direction === Sens.Left || direction === Sens.Right;
  return [...sequence].sort((a, b) => {
    const ai = isHorizontal ? a.indi : a.indj;
    const bi = isHorizontal ? b.indi : b.indj;
    return ai - bi;
  });
}

// ============================================================
// 6. UTILITAIRES POUR LE STORE
// ============================================================

export function isValidSequence(
  sequence: UneCase[] | null | undefined
): boolean {
  if (!sequence || !Array.isArray(sequence)) return false;
  return sequence.length >= 3 && sequence.length % 2 !== 0;
}

export function getPlacedPions(
  flatGrid: UneCase[] | null | undefined
): UneCase[] {
  if (!flatGrid || !Array.isArray(flatGrid)) return [];
  return flatGrid.filter(
    (c) => c.etat === StateCase.Pla || c.etat === StateCase.Choi
  );
}

export function getLockedPions(
  flatGrid: UneCase[] | null | undefined
): UneCase[] {
  if (!flatGrid || !Array.isArray(flatGrid)) return [];
  return flatGrid.filter((c) => c.etat === StateCase.Lo);
}

export function hasLockedPionInSequence(
  sequence: UneCase[] | null | undefined
): boolean {
  if (!sequence || !Array.isArray(sequence)) return false;
  return sequence.some((c) => c.etat === StateCase.Lo);
}

export const isStartCaseCovered = (
  flatGrid: UneCase[] | null | undefined
): boolean => {
  if (!flatGrid || !Array.isArray(flatGrid)) return false;
  const start = flatGrid.find((c) => c.ncase === START_CASE_INDEX);
  if (!start) return false;
  return (
    start.etat === StateCase.Pla ||
    start.etat === StateCase.Choi ||
    start.etat === StateCase.Lo
  );
};

// ============================================================
// 7. ÉVALUATEUR D'EXPRESSION SÛR
// ============================================================

/**
 * Évalue une expression arithmétique simple : nombres entiers, `+ - * /`.
 * Gère la priorité des opérations.
 * Ne gère PAS les parenthèses (le jeu n'en produit pas).
 */
export function evaluateExpression(expr: string): number {
  if (!expr) return NaN;

  const tokens: (number | string)[] = [];
  let i = 0;
  while (i < expr.length) {
    const c = expr[i];
    if (c === ' ') {
      i++;
      continue;
    }
    if (/[0-9]/.test(c)) {
      let num = '';
      while (i < expr.length && /[0-9]/.test(expr[i])) {
        num += expr[i];
        i++;
      }
      tokens.push(parseInt(num, 10));
      continue;
    }
    if ('+-*/'.includes(c)) {
      tokens.push(c);
      i++;
      continue;
    }
    return NaN;
  }

  if (tokens.length === 0) return NaN;

  // Passe 1 : * et /
  const pass1: (number | string)[] = [];
  let idx = 0;
  while (idx < tokens.length) {
    const tok = tokens[idx];
    if (tok === '*' || tok === '/') {
      const left = pass1.pop();
      const right = tokens[idx + 1];
      if (typeof left !== 'number' || typeof right !== 'number') return NaN;
      const res = tok === '*' ? left * right : left / right;
      pass1.push(res);
      idx += 2;
    } else {
      pass1.push(tok);
      idx++;
    }
  }

  // Passe 2 : + et -
  if (typeof pass1[0] !== 'number') return NaN;
  let acc = pass1[0];
  idx = 1;
  while (idx < pass1.length) {
    const op = pass1[idx];
    const right = pass1[idx + 1];
    if ((op !== '+' && op !== '-') || typeof right !== 'number') return NaN;
    acc = op === '+' ? acc + right : acc - right;
    idx += 2;
  }

  return acc;
}

// ============================================================
// 8. CALCUL DU RÉSULTAT
// ============================================================

export function calculateGameResult(
  targetCase: UneCase,
  sequence: UneCase[],
  placedPions: UneCase[],
  niveau: Dtfil
): GameResult {
  const targetValue = parseInt(targetCase.itxt || targetCase.txt, 10) || 0;

  const game: GameResult = {
    nbreatind: targetValue,
    result: 0,
    notedbase: 0,
    bonus: 0,
    notedjeu: 0,
    combine: sequence.map((c) => c.txt).join(''),
    targetCase,
    sequenceNcases: sequence.map((c) => c.ncase),
  };

  if (!sequence || sequence.length === 0) return game;

  const sanitized = sequence
    .map((c) => c.txt)
    .join('')
    .replace(/×/g, '*')
    .replace(/÷/g, '/');

  const calculated = evaluateExpression(sanitized);
  game.result = Number.isFinite(calculated) ? calculated : 0;

  if (game.nbreatind === game.result) {
    game.notedbase = 5;
  } else {
    game.notedbase = -Math.abs(game.result - game.nbreatind);
  }

  if (game.nbreatind === game.result) {
    let bonus = 0;

    if (niveau === Dtfil.Min && game.nbreatind >= 30) bonus += 1;
    if (niveau === Dtfil.Cad && game.nbreatind >= 100) bonus += 1;
    if (niveau === Dtfil.Jun && game.nbreatind >= 200) bonus += 1;
    if (niveau === Dtfil.Sen && game.nbreatind >= 300) bonus += 1;

    if (placedPions.length > 6) {
      bonus += placedPions.length - 6;
    }

    for (const p of placedPions) {
      if (p.txt === '*' || p.txt === '/' || p.txt === '×' || p.txt === '÷') {
        bonus += 1;
      }
    }

    game.bonus = bonus;
  } else {
    game.bonus = 0;
  }

  game.notedjeu = game.notedbase + game.bonus;
  return game;
}