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

/**
 * Évalue la séquence mathématique formée et calcule les points selon le barème officiel
 */
export function calculateGameResult(
  boutCase: UneCase,
  sequence: UneCase[],
  placedPions: UneCase[],
  niveau: Dtfil
): GameResult {
  const game: GameResult = {
    nbreatind: parseInt(boutCase.txt, 10) || 0,
    result: 0,
    notedbase: 0,
    bonus: 0,
    notedjeu: 0,
    combine: sequence.reduce((acc, c) => acc + c.txt, '')
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

  const diff = Math.abs(game.result - game.nbreatind);
  game.notedbase = -diff;

  let totalBonus = 0;

  if (game.result === game.nbreatind) {
    totalBonus += 5;
  }

  const totalPionsUsed = sequence.length;
  if (totalPionsUsed === 7) totalBonus += 1;
  else if (totalPionsUsed === 8) totalBonus += 2;
  else if (totalPionsUsed === 9) totalBonus += 3;
  else if (totalPionsUsed >= 10) totalBonus += 4;

  if (niveau === Dtfil.Min && game.nbreatind >= 30) totalBonus += 1;
  if (niveau === Dtfil.Cad && game.nbreatind >= 100) totalBonus += 1;
  if (niveau === Dtfil.Jun && game.nbreatind >= 200) totalBonus += 1;
  if (niveau === Dtfil.Sen && game.nbreatind >= 300) totalBonus += 1;

  const hasMultiplicationOrDivision = sequence.some(
    (cell) => cell.txt === '*' || cell.txt === '/'
  );
  if (hasMultiplicationOrDivision) {
    totalBonus += 1;
  }

  game.bonus = totalBonus;
  game.notedjeu = game.notedbase + game.bonus;

  return game;
}