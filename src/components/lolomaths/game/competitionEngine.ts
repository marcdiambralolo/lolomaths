import {
  Dtfil,
  GameResult,
  Sens,
  StateCase,
  TypeCase,
  UneCase,
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

const FLOAT_EPSILON = 1e-9;

const OPERATORS_SET: ReadonlySet<string> = new Set([
  '+',
  '-',
  '*',
  '/',
  '×',
  '÷',
]);

const MULTIPLY_DIVIDE_SET: ReadonlySet<string> = new Set([
  '*',
  '/',
  '×',
  '÷',
]);

const OPPOSITE_DIRECTION: Record<Sens, Sens> = {
  [Sens.Up]: Sens.Down,
  [Sens.Down]: Sens.Up,
  [Sens.Left]: Sens.Right,
  [Sens.Right]: Sens.Left,
};

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

function toNumericSeed(seed: number | string | undefined): number {
  if (typeof seed === 'number' && Number.isFinite(seed)) return seed;
  if (typeof seed === 'string') {
    const parsed = parseInt(seed, 10);
    if (Number.isFinite(parsed)) return parsed;
  }
  return 12345;
}

export function radlist(list: string[], seed: number | string): string[] {
  if (!Array.isArray(list) || list.length === 0) return [];

  const rng = new JavaRandom(toNumericSeed(seed));
  const lra: string[] = [];
  const use = new Array<boolean>(list.length).fill(false);

  const maxIterations = list.length * 1000;
  let iterations = 0;

  while (lra.length < list.length && ++iterations <= maxIterations) {
    const compteur = Math.round(rng.nextDouble() * (list.length - 1));
    if (compteur < 0 || compteur >= list.length || use[compteur]) continue;

    use[compteur] = true;
    lra.push(list[compteur]);
  }

  for (let i = 0; i < list.length; i++) {
    if (!use[i]) lra.push(list[i]);
  }

  return lra;
}

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

export function getRandomBoardNumber(rng?: JavaRandom): string {
  const value = rng ? rng.nextDouble() : Math.random();
  return Math.floor(value * 640).toString();
}

export function createInitialGrid(
  numeromat?: string,
  listecaseRef?: string[]
): UneCase[][] {
  const totalCells = GRID_ROWS * GRID_COLS;
  let lcases: string[] = [];

  if (
    numeromat &&
    Array.isArray(listecaseRef) &&
    listecaseRef.length >= totalCells
  ) {
    lcases = malisteca(numeromat, listecaseRef);
  } else {
    const rng = new JavaRandom(toNumericSeed(numeromat));
    for (let i = 0; i < totalCells; i++) {
      lcases.push(
        i === START_CASE_INDEX ? DEPART_SYMBOL : getRandomBoardNumber(rng)
      );
    }
  }

  const grid: UneCase[][] = [];
  let count = 0;

  for (let j = 0; j < GRID_ROWS; j++) {
    const row: UneCase[] = [];
    for (let i = 0; i < GRID_COLS; i++) {
      const val = lcases[count] || '';
      const cleanVal = val === DEPART_SYMBOL ? '' : val;
      row.push({
        ncase: count,
        indi: i,
        indj: j,
        txt: cleanVal,
        itxt: cleanVal,
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
  if (!Array.isArray(sequence) || sequence.length < 3) return false;
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
  const sequenceIds = new Set<number>();
  for (const c of sequence) {
    if (sequenceIds.has(c.ncase)) return false;
    sequenceIds.add(c.ncase);
  }

  for (const p of placedPions) {
    if (
      (p.etat === StateCase.Pla || p.etat === StateCase.Choi) &&
      !sequenceIds.has(p.ncase)
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
  if (a === null) return b === null || b.etat === StateCase.Cre;
  if (b === null) return a.etat === StateCase.Cre;
  if (a.etat !== StateCase.Cre && b.etat === StateCase.Cre) return false;
  if (b.etat !== StateCase.Cre && a.etat === StateCase.Cre) return false;
  return true;
}

export function tpencadre(grid: UneCase[][]): boolean {
  for (let j = 0; j < GRID_ROWS; j++) {
    for (let i = 0; i < GRID_COLS; i++) {
      const cell = grid[j]?.[i];
      if (!cell || cell.etat === StateCase.Cre || !isOperateur(cell.txt)) {
        continue;
      }

      const left = i > 0 ? grid[j][i - 1] : null;
      const right = i < GRID_COLS - 1 ? grid[j][i + 1] : null;
      const up = j > 0 ? grid[j - 1][i] : null;
      const down = j < GRID_ROWS - 1 ? grid[j + 1][i] : null;

      if (!encadre(right, left) || !encadre(down, up)) {
        return true;
      }
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
    if (!next || next.etat === StateCase.Cre || next.txt === '') break;
    current = next;
  }

  let prev = getNextCase(grid, startCase, OPPOSITE_DIRECTION[direction]);
  while (prev && prev.txt !== '' && prev.etat !== StateCase.Cre) {
    sequence.unshift(prev);
    if (prev.etat === StateCase.Lo) hasLoPion = true;
    const next = getNextCase(grid, prev, OPPOSITE_DIRECTION[direction]);
    if (!next || next.etat === StateCase.Cre || next.txt === '') break;
    prev = next;
  }

  return { sequence, hasLoPion };
}

export function collectLineSequence(
  grid: UneCase[][],
  anchorCase: UneCase,
  orientation: 'horizontal' | 'vertical'
): { sequence: UneCase[]; hasLoPion: boolean } {
  const forwardDir = orientation === 'horizontal' ? Sens.Right : Sens.Down;
  const backwardDir = orientation === 'horizontal' ? Sens.Left : Sens.Up;

  const sequence: UneCase[] = [];
  let hasLoPion = false;

  let current: UneCase | null = anchorCase;
  while (current && current.txt !== '' && current.etat !== StateCase.Cre) {
    sequence.push(current);
    if (current.etat === StateCase.Lo) hasLoPion = true;
    const next = getNextCase(grid, current, forwardDir);
    if (!next || next.etat === StateCase.Cre || next.txt === '') break;
    current = next;
  }

  let prev = getNextCase(grid, anchorCase, backwardDir);
  while (prev && prev.txt !== '' && prev.etat !== StateCase.Cre) {
    sequence.unshift(prev);
    if (prev.etat === StateCase.Lo) hasLoPion = true;
    const next = getNextCase(grid, prev, backwardDir);
    if (!next || next.etat === StateCase.Cre || next.txt === '') break;
    prev = next;
  }

  return { sequence, hasLoPion };
}

export function sortSequence(sequence: UneCase[], direction: Sens): UneCase[] {
  const isHorizontal = direction === Sens.Left || direction === Sens.Right;
  const sorted = [...sequence].sort((a, b) =>
    isHorizontal ? a.indi - b.indi : a.indj - b.indj
  );

  // Fidèle au Kotlin (`f.reverse()` pour Sens.Up et Sens.Left) :
  // Lecture du bout opposé vers la case cible.
  if (direction === Sens.Up || direction === Sens.Left) {
    sorted.reverse();
  }

  return sorted;
}

// ============================================================
// 6. UTILITAIRES POUR LE STORE
// ============================================================

export function isValidSequence(
  sequence: UneCase[] | null | undefined
): boolean {
  return (
    Array.isArray(sequence) &&
    sequence.length >= 3 &&
    sequence.length % 2 !== 0
  );
}

export function getPlacedPions(
  flatGrid: UneCase[] | null | undefined
): UneCase[] {
  if (!Array.isArray(flatGrid)) return [];
  return flatGrid.filter(
    (c) => c.etat === StateCase.Pla || c.etat === StateCase.Choi
  );
}

export function getLockedPions(
  flatGrid: UneCase[] | null | undefined
): UneCase[] {
  if (!Array.isArray(flatGrid)) return [];
  return flatGrid.filter((c) => c.etat === StateCase.Lo);
}

export function hasLockedPionInSequence(
  sequence: UneCase[] | null | undefined
): boolean {
  if (!Array.isArray(sequence)) return false;
  return sequence.some((c) => c.etat === StateCase.Lo);
}

export function isStartCaseCovered(
  flatGrid: UneCase[] | null | undefined
): boolean {
  if (!Array.isArray(flatGrid)) return false;
  const start = flatGrid.find((c) => c.ncase === START_CASE_INDEX);
  if (!start) return false;
  return (
    start.etat === StateCase.Pla ||
    start.etat === StateCase.Choi ||
    start.etat === StateCase.Lo
  );
}

// ============================================================
// 7. ÉVALUATEUR DE CALCUL SEQUENTIEL (GAUCHE À DROITE)
// ============================================================

function parseNumberSafe(raw: string): number {
  const parsed = parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function evaluateSequentialSequence(sequence: UneCase[]): number {
  if (!Array.isArray(sequence) || sequence.length < 3) return 0;

  let res = parseNumberSafe(sequence[0].txt);

  for (let i = 1; i + 1 < sequence.length; i += 2) {
    const operateur = sequence[i].txt;
    const operand = parseNumberSafe(sequence[i + 1].txt);

    switch (operateur) {
      case '/':
      case '÷':
        if (operand !== 0) res /= operand;
        break;
      case '*':
      case '×':
        res *= operand;
        break;
      case '+':
        res += operand;
        break;
      case '-':
        res -= operand;
        break;
    }
  }

  return res;
}

export type NiveauLabel = 'Min' | 'Cad' | 'Jun' | 'Sen';

function formatNiveauLabel(niveau: Dtfil): NiveauLabel {
  switch (niveau) {
    case Dtfil.Min:
      return 'Min';
    case Dtfil.Cad:
      return 'Cad';
    case Dtfil.Jun:
      return 'Jun';
    default:
      return 'Sen';
  }
}

// ============================================================
// 8. CALCUL DU RÉSULTAT DU JEU
// ============================================================

function getLevelTargetThreshold(niveau: Dtfil): number {
  switch (niveau) {
    case Dtfil.Min:
      return 30;
    case Dtfil.Cad:
      return 100;
    case Dtfil.Jun:
      return 200;
    default:
      return 300;
  }
}

export function calculateGameResult(
  targetCase: UneCase,
  sequence: UneCase[],
  placedPions: UneCase[],
  niveau: Dtfil
): GameResult {
  const targetValue = parseInt(targetCase.itxt || targetCase.txt, 10) || 0;
  const now = new Date().toISOString();

  const game: GameResult = {
    nbreatind: targetValue,
    result: 0,
    notedbase: 0,
    bonus: 0,
    notedjeu: 0,
    combine: Array.isArray(sequence)
      ? sequence.map((c) => c.txt).join('')
      : '',
    targetCase,
    sequenceNcases: Array.isArray(sequence)
      ? sequence.map((c) => c.ncase)
      : [],
    _id: '',
    userId: '',
    scoreTotal: 0,
    nombreDeJeux: 0,
    niveau: formatNiveauLabel(niveau),
    duree: '',
    date: now,
    idjeu: '',
    createdAt: now,
    updatedAt: now,
    timeSpent: '0',
    score: 0,
    nombredevues: 0,
  };

  if (!Array.isArray(sequence) || sequence.length === 0) return game;

  const rawResult = evaluateSequentialSequence(sequence);
  const diffFromTarget = Math.abs(rawResult - targetValue);
  const isExactMatch = diffFromTarget < FLOAT_EPSILON;

  game.result = isExactMatch ? targetValue : rawResult;
  game.notedbase = isExactMatch ? 5 : -diffFromTarget;

  // Fidèle au Kotlin : le bonus est toujours calculé.
  let bonus = 0;

  if (game.nbreatind >= getLevelTargetThreshold(niveau)) {
    bonus += 1;
  }

  if (placedPions.length > 6) {
    bonus += placedPions.length - 6;
  }

  for (const p of placedPions) {
    if (MULTIPLY_DIVIDE_SET.has(p.txt)) {
      bonus += 1;
    }
  }

  game.bonus = bonus;
  game.notedjeu = game.notedbase + game.bonus;

  return game;
}