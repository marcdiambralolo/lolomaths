import { BoardTheme, StateCase, TypeCase, UneCase } from '@/lib/interfaces';

// ============================================================
// CONSTANTES VISUELLES DU RACK
// ============================================================

/** Taille d'un pion (largeur et hauteur). */
export const RACK_PION_SIZE = 'clamp(32px, 8vw, 44px)';

/** Taille de la police d'un pion. */
export const RACK_PION_FONT_SIZE = 'clamp(12px, 2.4vw, 16px)';

/** Police monospace pour aligner les chiffres. */
export const RACK_PION_FONT_FAMILY = 'monospace';

/** Couleur de texte par défaut d'un pion (provenant du thème ou blanc). */
export const RACK_PION_TEXT_COLOR = '#ffffff';

/** Opacité d'un pion utilisé (retiré du rack). */
export const RACK_PION_USED_OPACITY = 0;

/** Opacité d'un pion disponible. */
export const RACK_PION_AVAILABLE_OPACITY = 1;

/** Symbole affiché pour un pion opérateur (fond légèrement renforcé). */
export const OPERATOR_BADGE_BG = 'rgba(255, 255, 255, 0.08)';

// ============================================================
// CALCUL DU STYLE
// ============================================================

export interface RackPionStyleInput {
  pion: UneCase;
  theme: BoardTheme;
  isSelected: boolean;
  isUsed: boolean;
}

/**
 * Calcule le style CSS d'un pion du rack.
 *
 * - Sélectionné (Choi) -> coulfondpionover (hoverPawnBgColor)
 * - Disponible (Pla) -> coulfondpionnormal (normalPawnBgColor)
 * - Utilisé (Cre) -> emplacement vide (opacity 0, transparent)
 */
export function computeRackPionStyle({
  pion,
  theme,
  isSelected,
  isUsed,
}: RackPionStyleInput): React.CSSProperties {
  const isOperator = pion.tca === TypeCase.PionOperateur;

  const activeColor = isSelected
    ? theme.hoverPawnBgColor
    : theme.normalPawnBgColor;

  const style: React.CSSProperties = {
    width: RACK_PION_SIZE,
    height: RACK_PION_SIZE,
    fontSize: RACK_PION_FONT_SIZE,
    fontFamily: RACK_PION_FONT_FAMILY,
    backgroundColor: isUsed ? 'transparent' : activeColor,
    borderColor: isUsed ? 'transparent' : activeColor,
    color: isUsed ? 'transparent' : RACK_PION_TEXT_COLOR,
    opacity: isUsed ? RACK_PION_USED_OPACITY : RACK_PION_AVAILABLE_OPACITY,
    cursor: isUsed ? 'not-allowed' : 'pointer',
    fontWeight: 900,
  };

  if (isOperator && !isUsed) {
    style.boxShadow = `inset 0 0 0 2px ${OPERATOR_BADGE_BG}`;
  }

  return style;
}

/**
 * Retourne le libellé accessible d'un pion.
 */
export function getRackPionAriaLabel(pion: UneCase, isSelected: boolean): string {
  const type = pion.tca === TypeCase.PionOperateur ? 'Opérateur' : 'Nombre';
  const state = isSelected ? ' sélectionné' : '';
  return `${type} ${pion.txt}${state}`;
}

/**
 * Retourne le titre (tooltip) d'un pion.
 */
export function getRackPionTitle(pion: UneCase): string {
  const type = pion.tca === TypeCase.PionOperateur ? 'Opérateur' : 'Nombre';
  return `${type} ${pion.txt}`;
}

/**
 * Vérifie si un pion est sélectionné (Choi).
 */
export function isRackPionSelected(pion: UneCase): boolean {
  return pion.etat === StateCase.Choi;
}

/**
 * Vérifie si un pion a été utilisé (placé sur la grille -> Cre).
 */
export function isRackPionUsed(pion: UneCase): boolean {
  return pion.etat === StateCase.Cre;
}