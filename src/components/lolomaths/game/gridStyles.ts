import { BoardTheme, StateCase, UneCase } from '@/lib/interfaces';
import { isOperateur, START_CASE_INDEX } from './competitionEngine';

// ============================================================
// CONSTANTES VISUELLES
// ============================================================

/** Couleur jaune pour la bordure de la case cible (correspond à isbou dans Unecase.kt). */
export const TARGET_BORDER_COLOR = '#FFFF00';

/** Largeur de bordure pour la case cible. */
export const TARGET_BORDER_WIDTH = '2px';

/** Largeur de bordure par défaut. */
export const DEFAULT_BORDER_WIDTH = '1px';

/** Taille de police responsive (clamp). */
export const CELL_FONT_SIZE = 'clamp(8px, 1.4vw, 14px)';

/** Police monospace pour aligner les chiffres. */
export const CELL_FONT_FAMILY = 'monospace';

/** Couleur de texte par défaut des cases. */
export const DEFAULT_TEXT_COLOR = '#ffffff';

/** Couleur de texte des opérateurs. */
export const OPERATOR_TEXT_COLOR = '#FD010D';

// ============================================================
// CALCUL DU STYLE
// ============================================================

export interface CellStyleInput {
  cell: UneCase;
  theme: BoardTheme;
  isStart: boolean;
  isTarget: boolean;
  content: string;
}

/**
 * Calcule le style CSS d'une cellule du plateau en fonction de son état,
 * du thème et de son contenu (fidèle à `refvi` dans Competition.kt).
 */
export function computeCellStyle({
  cell,
  theme,
  isStart,
  isTarget,
  content,
}: CellStyleInput): React.CSSProperties {
  const style: React.CSSProperties = {};

  // Extraction sécurisée de la couleur de texte selon ce qui est défini dans BoardTheme
  const textColor =
    (theme as unknown as { cellTextColor?: string; coultextecase?: string }).cellTextColor ||
    (theme as unknown as { coultextecase?: string }).coultextecase ||
    DEFAULT_TEXT_COLOR;

  switch (cell.etat) {
    case StateCase.Lo:
      style.backgroundColor = theme.lockedCellBgColor;
      style.color = textColor;
      style.fontWeight = 700;
      style.cursor = 'not-allowed';
      break;

    case StateCase.Choi:
      style.backgroundColor = theme.selectedCellBgColor;
      style.color = textColor;
      style.fontWeight = 800;
      style.cursor = 'pointer';
      break;

    case StateCase.Pla:
      style.backgroundColor = theme.placedPawnBgColor;
      style.color = textColor;
      style.fontWeight = 800;
      style.cursor = 'pointer';
      break;

    default: // StateCase.Cre
      if (isStart) {
        style.backgroundColor = theme.startCellBgColor;
        style.color = textColor;
        style.fontWeight = 700;
        style.cursor = 'pointer';
      } else {
        const isOp = isOperateur(content);
        style.backgroundColor = theme.cellBgColor;
        style.color = isOp ? OPERATOR_TEXT_COLOR : textColor;
        style.fontWeight = isOp ? 700 : 500;
        style.cursor = 'pointer';
      }
      break;
  }

  // Bordure : Jaune si case cible (isbou), sinon bordure du thème
  style.borderColor = isTarget ? TARGET_BORDER_COLOR : theme.cellBorderColor;
  style.borderWidth = isTarget ? TARGET_BORDER_WIDTH : DEFAULT_BORDER_WIDTH;

  if (isTarget) {
    style.boxShadow = `inset 0 0 4px ${TARGET_BORDER_COLOR}`;
  }

  return style;
}

/**
 * Retourne le contenu à afficher dans une cellule.
 *
 * - Si `Cre` (case creuse du plateau) -> affiche `itxt` (valeur cible de la case)
 * - Si `Pla` / `Choi` / `Lo` -> affiche `txt` (valeur du pion posé)
 */
export function computeCellContent(cell: UneCase): string {
  if (cell.etat === StateCase.Cre) {
    return cell.itxt || '';
  }
  return cell.txt || cell.itxt || '';
}

/**
 * Vérifie si une cellule est verrouillée (`Lo`).
 */
export function isLocked(cell: UneCase): boolean {
  return cell.etat === StateCase.Lo;
}

/**
 * Vérifie si une cellule est sélectionnée (`Choi`).
 */
export function isSelected(cell: UneCase): boolean {
  return cell.etat === StateCase.Choi;
}

/**
 * Vérifie si une cellule contient un pion posé (`Pla`).
 */
export function isPlaced(cell: UneCase): boolean {
  return cell.etat === StateCase.Pla;
}

/**
 * Vérifie si une cellule est la case de départ (Index 110).
 */
export function isStartCell(cell: UneCase): boolean {
  return cell.ncase === START_CASE_INDEX;
}