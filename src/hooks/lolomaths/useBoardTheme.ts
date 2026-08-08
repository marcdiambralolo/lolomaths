// hooks/useBoardTheme.ts
import { BoardTheme } from '@/lib/interfaces';
import { CSSProperties } from 'react';
 

export function useBoardTheme(theme?: BoardTheme): CSSProperties {
  if (!theme) return {};

  return {
    '--cell-bg': theme.cellBgColor,
    '--cell-locked-bg': theme.lockedCellBgColor,
    '--pawn-placed-bg': theme.placedPawnBgColor,
    '--cell-start-bg': theme.startCellBgColor,
    '--cell-selected-bg': theme.selectedCellBgColor,
    '--cell-border': theme.cellBorderColor,
    '--pawn-normal-bg': theme.normalPawnBgColor,
    '--pawn-hover-bg': theme.hoverPawnBgColor,
  } as CSSProperties;
}