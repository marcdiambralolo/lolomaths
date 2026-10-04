import { useMemo } from 'react';
import { BoardTheme, UneCase } from '@/lib/interfaces';
import {
  CELL_FONT_FAMILY,
  CELL_FONT_SIZE,
  computeCellContent,
  computeCellStyle,
  isStartCell,
} from './gridStyles';

export interface UseCellStyleResult {
  content: string;
  isStart: boolean;
  isTarget: boolean;
  style: React.CSSProperties;
}

/**
 * Hook qui calcule le contenu et le style d'une cellule du plateau.
 */
export function useCellStyle(cell: UneCase, theme: BoardTheme): UseCellStyleResult {
  const isStart = isStartCell(cell);
  const isTarget = cell.isTarget === true;

  const content = useMemo(() => computeCellContent(cell), [cell.etat, cell.txt, cell.itxt]);

  const style = useMemo<React.CSSProperties>(
    () =>
      ({
        ...computeCellStyle({ cell, theme, isStart, isTarget, content }),
        fontSize: CELL_FONT_SIZE,
        fontFamily: CELL_FONT_FAMILY,
      }) as React.CSSProperties,
    [cell.etat, cell.txt, cell.itxt, cell.ncase, cell.isTarget, theme, isStart, isTarget, content]
  );

  return { content, isStart, isTarget, style };
}