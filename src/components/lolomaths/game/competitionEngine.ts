import { UneCase, StateCase, Sens, Dtfil, GameResult } from "@/lib/interfaces";

export const GRID_ROWS = 17;
export const GRID_COLS = 13;
export const START_CASE_INDEX = 110; // Case de départ centrale (Ligne 8, Col 6)
/**
 * Mélange déterministe d'une liste (pioche de jetons / tirage initial)
 * Transposition stricte de radlist(list, seed) Kotlin.
 *
 * @param list - Liste initiale des jetons à mélanger
 * @param seed - Numéro de match (numeromat) ou graine de tirage
 * @returns La liste mélangée de façon déterministe
 */
export function radlist(list: string[], seed: number | string): string[] {
  if (!list || list.length === 0) return [];

  const numericSeed = typeof seed === 'string' ? parseInt(seed, 10) || 12345 : seed;
  const rng = new JavaRandom(numericSeed);
  
  const use = new Array(list.length).fill(false);
  const lra: string[] = [];

  // Reconstitution exacte de la boucle while / break de Kotlin
  while (lra.length < list.length) {
    while (true) {
      const compteur = Math.round(rng.nextDouble() * (list.length - 1));
      
      // Si la position a déjà été piochée, on casse la boucle interne pour re-tirer
      if (use[compteur]) break;

      if (compteur !== list.length) {
        use[compteur] = true;
        lra.push(list[compteur]);
      }
    }
  }

  return lra;
}

/**
 * Distribution initiale de la main du joueur (ex: 7 jetons)
 */
export function generateInitialRack(fullPool: string[], numeromat: string, count: number = 7): {
  rack: string[];
  remainingPool: string[];
} {
  const shuffledPool = radlist(fullPool, numeromat);
  const rack = shuffledPool.slice(0, count);
  const remainingPool = shuffledPool.slice(count);

  return {
    rack,
    remainingPool
  };
}
// ============================================================
// 1. GENERATEUR PSEUDO-ALEATOIRE DÉTERMINISTE (JavaRandom LCG 48-bit)
// ============================================================

export class JavaRandom {
  private seed: number;

  constructor(seed: number) {
    // JavaRandom utilise un masque 48-bit
    const multiplier = 0x5DEECE66D;
    const addend = 0xB;
    const mask = 0xFFFFFFFFFFFF; // 2^48 - 1
    
    // Simulation du XOR avec le multiplier en utilisant des opérations 64-bit
    // On utilise des nombres JavaScript (double 64-bit) avec des précautions
    this.seed = (seed ^ multiplier) & mask;
  }

  private next(bits: number): number {
    const multiplier = 0x5DEECE66D;
    const addend = 0xB;
    const mask = 0xFFFFFFFFFFFF; // 2^48 - 1
    
    // Simulation 64-bit de: seed = (seed * multiplier + addend) & mask
    // En JavaScript, on doit simuler manuellement pour éviter les problèmes de précision
    const high = Math.floor(this.seed / 0x100000000);
    const low = this.seed & 0xFFFFFFFF;
    
    // Multiplication 64-bit simulée
    const multHigh = Math.floor(multiplier / 0x100000000);
    const multLow = multiplier & 0xFFFFFFFF;
    
    const resultLow = low * multLow;
    const resultHigh = high * multLow + low * multHigh + Math.floor(resultLow / 0x100000000);
    const result = ((resultHigh & 0xFFFF) * 0x100000000 + (resultLow & 0xFFFFFFFF)) + addend;
    
    this.seed = (result & mask) >>> 0;
    return this.seed >>> (48 - bits);
  }

  public nextDouble(): number {
    const high = this.next(26);
    const low = this.next(27);
    const combined = (high << 27) + low;
    return combined / 9007199254740992; // 2^53
  }
}

// Version simplifiée utilisant BigInt (pour ES2020+)
// Si vous pouvez utiliser ES2020+, décommentez ceci et commentez la version ci-dessus
/*
export class JavaRandom {
  private seed: bigint;

  constructor(seed: number) {
    const multiplier = 0x5DEECE66Dn;
    const addend = 0xBn;
    const mask = (1n << 48n) - 1n;
    this.seed = (BigInt(seed) ^ multiplier) & mask;
  }

  private next(bits: number): number {
    const multiplier = 0x5DEECE66Dn;
    const addend = 0xBn;
    const mask = (1n << 48n) - 1n;
    this.seed = (this.seed * multiplier + addend) & mask;
    return Number(this.seed >> BigInt(48 - bits));
  }

  public nextDouble(): number {
    const high = BigInt(this.next(26));
    const low = BigInt(this.next(27));
    const combined = (high << 27n) + low;
    return Number(combined) / Math.pow(2, 53);
  }
}
*/

export function isOperateur(txt: string): boolean {
  return ['+', '-', '*', '/'].includes(txt);
}

/**
 * Vérifie si la case de départ (index 110) est couverte par un pion
 */
export function isStartCaseCovered(flatGrid: UneCase[]): boolean {
  const startCase = flatGrid.find((c) => c.ncase === START_CASE_INDEX);
  if (!startCase) return false;
  return (
    startCase.etat === StateCase.Pla ||
    startCase.etat === StateCase.Choi ||
    startCase.etat === StateCase.Lo
  );
}

/**
 * Génère un nombre aléatoire (Fallback non déterministe)
 */
export function getRandomBoardNumber(): string {
  return Math.floor(Math.random() * 640).toString();
}

/**
 * Version simplifiée de la génération aléatoire sans BigInt
 */
function generateShuffledList(seed: number, referenceList: string[]): string[] {
  const result: string[] = [];
  const used = new Array(referenceList.length).fill(false);
  let currentSeed = seed;

  // Simple générateur aléatoire basé sur un LCG pour éviter BigInt
  function nextRandom(): number {
    // Multiplicateur et incrément pour un LCG 32-bit
    const a = 1103515245;
    const c = 12345;
    const m = 0x7FFFFFFF;
    currentSeed = (currentSeed * a + c) & m;
    return currentSeed / m;
  }

  while (result.length < referenceList.length) {
    const randomIndex = Math.floor(nextRandom() * referenceList.length);
    if (!used[randomIndex]) {
      used[randomIndex] = true;
      result.push(referenceList[randomIndex]);
    }
  }

  return result;
}

/**
 * Crée la grille initiale de 17 lignes x 13 colonnes
 * Si un numeromat (seed) et listecaseRef sont fournis, la grille est générée de façon
 * 100% déterministe.
 */
export function createInitialGrid(numeromat?: string, listecaseRef?: string[]): UneCase[][] {
  let lcases: string[] = [];

  if (numeromat && listecaseRef && listecaseRef.length >= GRID_ROWS * GRID_COLS) {
    const seed = parseInt(numeromat, 10) || 12345;
    const wl = [...listecaseRef];
    
    // Version simplifiée sans BigInt
    lcases = generateShuffledList(seed, wl);

    // Permutation forcée de la case 'depart' vers l'index central 110
    const indp = lcases.indexOf('depart');
    if (indp !== -1) {
      const tdep = lcases[START_CASE_INDEX];
      lcases[START_CASE_INDEX] = lcases[indp];
      lcases[indp] = tdep;
    }
  } else {
    // Fallback de secours si aucune liste de référence n'est fournie
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

/**
 * Vérifie si deux cases sont de même type (nombre/opérateur)
 * Équivalent de "justapo" en Kotlin
 */
export function sontDeMemeType(cellA: UneCase, cellB: UneCase): boolean {
  return isOperateur(cellA.txt) === isOperateur(cellB.txt);
}

/**
 * Vérifie l'alternance stricte des pions dans une séquence
 */
export function validateAlternance(sequence: UneCase[]): boolean {
  if (sequence.length < 3) return false;

  // Doit commencer et finir par un nombre (Fermeture propre)
  if (isOperateur(sequence[0].txt) || isOperateur(sequence[sequence.length - 1].txt)) {
    return false;
  }

  // Vérifie l'alternance
  for (let i = 0; i < sequence.length - 1; i++) {
    if (sontDeMemeType(sequence[i], sequence[i + 1])) {
      return false;
    }
  }

  return true;
}

/**
 * Vérifie qu'il n'y a pas de superposition (Règle d'emplacement unique)
 */
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

/**
 * Vérifie la règle d'enchaînement (après le premier jeu)
 */
export function validateEnchainement(sequence: UneCase[], cnbjeu: number): boolean {
  if (cnbjeu === 0) return true;
  return sequence.some((cell) => cell.etat === StateCase.Lo);
}

const isOccupied = (c: UneCase | null): boolean => {
  if (!c) return false;
  return c.etat !== StateCase.Cre;
};

/**
 * Transposition exacte de encadre(a, b) Kotlin :
 * Deux voisins opposés d'un opérateur doivent être TOUS LES DEUX occupés ou TOUS LES DEUX vides.
 */
export function encadre(a: UneCase | null, b: UneCase | null): boolean {
  const occupiedA = isOccupied(a);
  const occupiedB = isOccupied(b);
  return occupiedA === occupiedB;
}

/**
 * Transposition de tpencadre() Kotlin :
 * Vérifie qu'AUCUN opérateur présent sur le plateau ne viole la règle d'encadrement.
 */
export function validateOperateursEncadres(sequence: UneCase[], grid: UneCase[][]): boolean {
  for (let j = 0; j < GRID_ROWS; j++) {
    for (let i = 0; i < GRID_COLS; i++) {
      const cell = grid[j][i];
      if (cell.etat !== StateCase.Cre && isOperateur(cell.txt)) {
        const left = i > 0 ? grid[j][i - 1] : null;
        const right = i < GRID_COLS - 1 ? grid[j][i + 1] : null;
        const up = j > 0 ? grid[j - 1][i] : null;
        const down = j < GRID_ROWS - 1 ? grid[j + 1][i] : null;

        const horizValid = encadre(left, right);
        const vertValid = encadre(up, down);

        if (!horizValid || !vertValid) {
          return false;
        }
      }
    }
  }
  return true;
}

/**
 * Validation complète d'une combinaison
 */
export function validateCombination(
  sequence: UneCase[],
  placedPions: UneCase[],
  cnbjeu: number,
  grid: UneCase[][]
): { valid: boolean; reason?: string } {
  // Règle 1, 2 & 3: Alternance et fermeture propre
  if (!validateAlternance(sequence)) {
    return { valid: false, reason: 'Alternance incorrecte ou fermeture non propre' };
  }

  // Règle 4: Emplacement unique
  if (!validateNoSuperposition(sequence, placedPions)) {
    return { valid: false, reason: 'Superposition détectée' };
  }

  // Règle 5: Enchaînement (après le premier jeu)
  if (!validateEnchainement(sequence, cnbjeu)) {
    return { valid: false, reason: 'Aucun pion verrouillé utilisé (enchaînement requis)' };
  }

  // Règle 6: Encadrement global des opérateurs
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

  let oppositeDirection: Sens;
  switch (direction) {
    case Sens.Up: oppositeDirection = Sens.Down; break;
    case Sens.Down: oppositeDirection = Sens.Up; break;
    case Sens.Left: oppositeDirection = Sens.Right; break;
    case Sens.Right: oppositeDirection = Sens.Left; break;
    default: oppositeDirection = Sens.Right;
  }

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

export function calculateGameResult(
  boutCase: UneCase,
  sequence: UneCase[],
  placedPions: UneCase[],
  niveau: Dtfil,
  hasUsedMultiplicationOrDivision: boolean = false
): GameResult {
  const game: GameResult = {
    nbreatind: parseInt(boutCase.txt, 10) || 0,
    result: 0,
    notedbase: 0,
    bonus: 0,
    notedjeu: 0,
    combine: sequence.reduce((acc, c) => acc + c.txt, '') + boutCase.txt
  };

  const copySeq = [...sequence];
  if (copySeq.length === 0) return game;

  let currentVal = parseFloat(copySeq.shift()!.txt) || 0;

  while (copySeq.length >= 2) {
    const operator = copySeq.shift()!.txt;
    const operand = parseInt(copySeq.shift()!.txt, 10) || 0;

    switch (operator) {
      case '/': 
        if (operand !== 0) currentVal /= operand; 
        break;
      case '*': 
        currentVal *= operand; 
        break;
      case '+': 
        currentVal += operand; 
        break;
      case '-': 
        currentVal -= operand; 
        break;
      default:
        // Opérateur inconnu, ignore
        break;
    }
  }

  game.result = currentVal;

  const diff = Math.abs(game.result - game.nbreatind);
  game.notedbase = game.result === game.nbreatind ? 5 : -diff;

  let totalBonus = 0;

  const totalPionsUsed = sequence.length;
  if (totalPionsUsed >= 7 && totalPionsUsed <= 10) {
    totalBonus += totalPionsUsed - 6;
  }

  if (niveau === Dtfil.Min && game.nbreatind >= 30) totalBonus += 1;
  if (niveau === Dtfil.Cad && game.nbreatind >= 100) totalBonus += 1;
  if (niveau === Dtfil.Jun && game.nbreatind >= 200) totalBonus += 1;
  if (niveau === Dtfil.Sen && game.nbreatind >= 300) totalBonus += 1;

  const hasMultiplicationOrDivision = sequence.some(
    (cell) => cell.txt === '*' || cell.txt === '/'
  );
  if (hasMultiplicationOrDivision && !hasUsedMultiplicationOrDivision) {
    totalBonus += 1;
  }

  game.bonus = totalBonus;
  game.notedjeu = game.notedbase + game.bonus;

  return game;
}

// ============================================================
// 4. FONCTIONS UTILITAIRES POUR LE STORE ZUSTAND
// ============================================================

export function isValidSequence(sequence: UneCase[]): boolean {
  if (sequence.length < 3) return false;
  if (sequence.length % 2 === 0) return false;
  return true;
}

export function getPlacedPions(flatGrid: UneCase[]): UneCase[] {
  return flatGrid.filter(
    (c) => c.etat === StateCase.Pla || c.etat === StateCase.Choi
  );
}

export function getLockedPions(flatGrid: UneCase[]): UneCase[] {
  return flatGrid.filter((c) => c.etat === StateCase.Lo);
}

export function hasLockedPionInSequence(sequence: UneCase[]): boolean {
  return sequence.some((cell) => cell.etat === StateCase.Lo);
}