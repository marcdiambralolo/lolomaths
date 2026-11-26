import React, { useMemo } from 'react';
import { BoardTheme, UneCase } from '@/lib/interfaces';
import {
  computeRackPionStyle,
  isRackPionSelected,
  isRackPionUsed,
} from './rackStyles';

export interface UseRackPionStyleResult {
  isSelected: boolean;
  isUsed: boolean;
  style: React.CSSProperties;
}

/**
 * Hook qui calcule et mémoïse le style d'un pion du rack.
 */
export function useRackPionStyle(
  pion: UneCase,
  theme: BoardTheme
): UseRackPionStyleResult {
  const isSelected = isRackPionSelected(pion);
  const isUsed = isRackPionUsed(pion);

  const style = useMemo(
    () => computeRackPionStyle({ pion, theme, isSelected, isUsed }),
    [
      pion,
      pion.etat,
      pion.tca,
      pion.placep,
      pion.txt,
      theme,
      isSelected,
      isUsed,
    ]
  );

  return { isSelected, isUsed, style };
}