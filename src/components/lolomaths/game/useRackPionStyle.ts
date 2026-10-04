import { useMemo } from 'react';
import { BoardTheme, UneCase } from '@/lib/interfaces';
import {
  computeRackPionStyle,
  isRackPionSelected,
  isRackPionUsed,
} from './portepions/rackStyles';

export interface UseRackPionStyleResult {
  isSelected: boolean;
  isUsed: boolean;
  style: React.CSSProperties;
}

/**
 * Hook qui calcule le style d'un pion du rack.
 *
 * Mémoïse le style en fonction de :
 *  - l'état du pion (Pla / Choi / Cre)
 *  - le thème
 *  - le type (chiffre ou opérateur)
 */
export function useRackPionStyle(
  pion: UneCase,
  theme: BoardTheme
): UseRackPionStyleResult {
  const isSelected = isRackPionSelected(pion);
  const isUsed = isRackPionUsed(pion);

  const style = useMemo(
    () => computeRackPionStyle({ pion, theme, isSelected, isUsed }),
    [pion, theme, isSelected, isUsed]
  );

  return { isSelected, isUsed, style };
}