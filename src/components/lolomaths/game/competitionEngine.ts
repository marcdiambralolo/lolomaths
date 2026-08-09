import { UneCase, StateCase, Sens, Dtfil, GameResult } from "@/lib/interfaces";

export const GRID_ROWS = 17;
export const GRID_COLS = 13;
export const START_CASE_INDEX = 110; // Case de départ centrale

export function isOperateur(txt: string): boolean {
  return ['+', '-', '*', '/'].includes(txt);
}

/**
 * Vérifie si la case de départ (index 110) est couverte par un pion
 */
export function isStartCaseCovered(flatGrid: UneCase[]): boolean {
  const startCase = flatGrid.find((c) => c.ncase === START_CASE_INDEX);
  if (!startCase) return false;
  // La case de départ est couverte s'il y a un pion actif (Pla/Choi) ou déjà verrouillé (Lo)
  return startCase.etat === StateCase.Pla || startCase.etat === StateCase.Choi || startCase.etat === StateCase.Lo;
}

/**
 * Génère un nombre aléatoire entre 0 et 639 inclus
 */
export function getRandomBoardNumber(): string {
  return Math.floor(Math.random() * 640).toString();
}

/**
 * Crée la grille initiale de 17 lignes x 13 colonnes
 * Chaque case contient un chiffre aléatoire de 0 à 639, sauf la case de départ (index 110)
 */
export function createInitialGrid(): UneCase[][] {
  const grid: UneCase[][] = [];
  let count = 0;
  for (let j = 0; j < GRID_ROWS; j++) {
    const row: UneCase[] = [];
    for (let i = 0; i < GRID_COLS; i++) {
      const isStart = count === START_CASE_INDEX;
      const initialValue = isStart ? '' : getRandomBoardNumber();

      row.push({
        ncase: count,
        indi: i,
        indj: j,
        txt: initialValue,
        itxt: initialValue,
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
  }
}

// ============================================================
// NOUVELLES FONCTIONS DE VALIDATION (inspirées du Kotlin)
// ============================================================

/**
 * Vérifie si deux cases sont de même type (nombre/opérateur)
 * Équivalent de "justapo" en Kotlin
 */
export function sontDeMemeType(cellA: UneCase, cellB: UneCase): boolean {
  const aIsOp = isOperateur(cellA.txt);
  const bIsOp = isOperateur(cellB.txt);
  return aIsOp === bIsOp;
}

/**
 * Vérifie l'alternance stricte des pions dans une séquence
 * Règle 1: Pas de deux nombres juxtaposés
 * Règle 2: Pas de deux opérateurs juxtaposés
 * Règle 3: La combinaison doit commencer et finir par un nombre (Fermeture propre)
 */
export function validateAlternance(sequence: UneCase[]): boolean {
  if (sequence.length < 3) return false;
  
  // Doit commencer et finir par un nombre (Fermeture propre)
  if (isOperateur(sequence[0].txt) || isOperateur(sequence[sequence.length - 1].txt)) {
    return false;
  }
  
  // Vérifie l'alternance
  for (let i = 0; i < sequence.length - 1; i++) {
    // Pas de deux nombres ou deux opérateurs consécutifs
    if (sontDeMemeType(sequence[i], sequence[i + 1])) {
      return false;
    }
  }
  
  return true;
}

/**
 * Vérifie qu'il n'y a pas de superposition (Règle d'emplacement unique)
 * Équivalent de "!pions.filter(Unecase::place).none { !vt.contains(pioncase(it.indj, it.indi)) }"
 */
export function validateNoSuperposition(sequence: UneCase[], placedPions: UneCase[]): boolean {
  const usedCells = new Set<number>();
  for (const cell of sequence) {
    if (usedCells.has(cell.ncase)) return false;
    usedCells.add(cell.ncase);
  }
  
  // Vérifie qu'aucun pion placé n'est en dehors de la séquence
  // (tous les pions placés doivent être dans la séquence)
  for (const pion of placedPions) {
    if (pion.etat === StateCase.Pla || pion.etat === StateCase.Choi) {
      if (!sequence.some(cell => cell.ncase === pion.ncase)) {
        return false;
      }
    }
  }
  
  return true;
}

/**
 * Vérifie la règle d'enchaînement
 * Après le premier jeu, tous les coups suivants doivent comporter au moins un pion Lo
 * Équivalent de "cnbjeu != 0 && !vh.any { it.etat == Lo }"
 */
export function validateEnchainement(sequence: UneCase[], cnbjeu: number): boolean {
  if (cnbjeu === 0) return true; // Premier jeu : pas de restriction
  return sequence.some(cell => cell.etat === StateCase.Lo);
}

/**
 * Vérifie que les opérateurs sont encadrés par des nombres
 * Équivalent de "tpencadre()" en Kotlin
 */
export function validateOperateursEncadres(sequence: UneCase[], grid: UneCase[][]): boolean {
  for (let i = 0; i < sequence.length; i++) {
    const cell = sequence[i];
    if (isOperateur(cell.txt)) {
      // Vérifie l'encadrement à droite et à gauche (horizontal)
      const right = getNextCase(grid, cell, Sens.Right);
      const left = getNextCase(grid, cell, Sens.Left);
      const rightIsNumber = right && !isOperateur(right.txt) && right.etat !== StateCase.Cre;
      const leftIsNumber = left && !isOperateur(left.txt) && left.etat !== StateCase.Cre;
      
      // Vérifie l'encadrement en haut et en bas (vertical)
      const up = getNextCase(grid, cell, Sens.Up);
      const down = getNextCase(grid, cell, Sens.Down);
      const upIsNumber = up && !isOperateur(up.txt) && up.etat !== StateCase.Cre;
      const downIsNumber = down && !isOperateur(down.txt) && down.etat !== StateCase.Cre;
      
      // L'opérateur doit être encadré soit horizontalement, soit verticalement
      const encadreHorizontal = (rightIsNumber && leftIsNumber);
      const encadreVertical = (upIsNumber && downIsNumber);
      
      if (!encadreHorizontal && !encadreVertical) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Validation complète d'une combinaison
 * Combine toutes les règles du jeu
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
  
  // Règle 4: Emplacement unique (pas de superposition)
  if (!validateNoSuperposition(sequence, placedPions)) {
    return { valid: false, reason: 'Superposition détectée' };
  }
  
  // Règle 5: Enchaînement (après le premier jeu)
  if (!validateEnchainement(sequence, cnbjeu)) {
    return { valid: false, reason: 'Aucun pion verrouillé utilisé (enchaînement requis)' };
  }
  
  // Vérification supplémentaire : les opérateurs doivent être encadrés
  if (!validateOperateursEncadres(sequence, grid)) {
    return { valid: false, reason: 'Opérateur non encadré par des nombres' };
  }
  
  return { valid: true };
}

// ============================================================
// FONCTIONS DE COLLECTE DE SÉQUENCE (inspirées du Kotlin)
// ============================================================

/**
 * Collecte une séquence de cases dans une direction donnée
 * Équivalent de "cpver" et "cphor" en Kotlin
 */
export function collectSequence(
  grid: UneCase[][],
  startCase: UneCase,
  direction: Sens
): { sequence: UneCase[]; hasLoPion: boolean } {
  const sequence: UneCase[] = [];
  let hasLoPion = false;
  
  // Aller dans la direction positive
  let current: UneCase | null = startCase;
  while (current && current.txt !== '') {
    sequence.push(current);
    if (current.etat === StateCase.Lo) hasLoPion = true;
    // S'arrêter si on rencontre une case vide (Cre)
    const next = getNextCase(grid, current, direction);
    if (next && next.etat === StateCase.Cre) break;
    current = next;
  }
  
  // Aller dans la direction opposée (pour la séquence complète)
  let oppositeDirection: Sens;
  switch (direction) {
    case Sens.Up: oppositeDirection = Sens.Down; break;
    case Sens.Down: oppositeDirection = Sens.Up; break;
    case Sens.Left: oppositeDirection = Sens.Right; break;
    case Sens.Right: oppositeDirection = Sens.Left; break;
  }
  
  // Commencer depuis le voisin opposé
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

/**
 * Trie une séquence par indices (horizontal ou vertical)
 * Équivalent de "trita" en Kotlin
 */
export function sortSequence(
  sequence: UneCase[],
  direction: Sens
): UneCase[] {
  const isHorizontal = direction === Sens.Left || direction === Sens.Right;
  
  return [...sequence].sort((a, b) => {
    const aIndex = isHorizontal ? a.indi : a.indj;
    const bIndex = isHorizontal ? b.indi : b.indj;
    return aIndex - bIndex;
  });
}

// ============================================================
// FONCTION DE CALCUL CORRIGÉE
// ============================================================

/**
 * Évalue la séquence mathématique formée et calcule les points selon le barème officiel
 * Corrigé pour correspondre au comportement Kotlin
 */
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
        currentVal /= operand;
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
    }
  }

  game.result = currentVal;

  // Note de base (comme dans Kotlin)
  const diff = Math.abs(game.result - game.nbreatind);
  game.notedbase = game.result === game.nbreatind ? 5 : -diff;

  let totalBonus = 0;

  // 1. Égalité parfaite (déjà inclus dans notedbase, mais Kotlin l'ajoute aussi en bonus)
  // En réalité, le Kotlin ne double pas le bonus, donc on ne le remet pas ici
  // (le +5 est déjà dans notedbase)

  // 2. Nombre de pions utilisés (7 -> +1, 8 -> +2, 9 -> +3, 10 -> +4)
  const totalPionsUsed = sequence.length;
  if (totalPionsUsed >= 7 && totalPionsUsed <= 10) {
    totalBonus += totalPionsUsed - 6;
  }

  // 3. Niveau de difficulté
  if (niveau === Dtfil.Min && game.nbreatind >= 30) totalBonus += 1;
  if (niveau === Dtfil.Cad && game.nbreatind >= 100) totalBonus += 1;
  if (niveau === Dtfil.Jun && game.nbreatind >= 200) totalBonus += 1;
  if (niveau === Dtfil.Sen && game.nbreatind >= 300) totalBonus += 1;

  // 4. Première utilisation de × ou ÷ (comme dans Kotlin)
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
// FONCTIONS UTILITAIRES POUR LE STORE
// ============================================================

/**
 * Vérifie si une séquence est valide (longueur impaire, etc.)
 * Utilisé pour le calcul des directions
 */
export function isValidSequence(sequence: UneCase[]): boolean {
  if (sequence.length < 3) return false;
  if (sequence.length % 2 === 0) return false;
  return true;
}

/**
 * Récupère les pions placés sur le plateau (Pla ou Choi)
 */
export function getPlacedPions(flatGrid: UneCase[]): UneCase[] {
  return flatGrid.filter(
    c => c.etat === StateCase.Pla || c.etat === StateCase.Choi
  );
}

/**
 * Récupère les pions verrouillés (Lo) sur le plateau
 */
export function getLockedPions(flatGrid: UneCase[]): UneCase[] {
  return flatGrid.filter(c => c.etat === StateCase.Lo);
}

/**
 * Vérifie s'il y a au moins un pion Lo dans une séquence
 */
export function hasLockedPionInSequence(sequence: UneCase[]): boolean {
  return sequence.some(cell => cell.etat === StateCase.Lo);
}