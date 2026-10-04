'use client';

import React, { memo, useCallback } from 'react';
import { BoardTheme, StateCase, UneCase } from '@/lib/interfaces';
import { useCellStyle } from './useCellStyle';

// ============================================================
// TYPES
// ============================================================

export interface GridCellProps {
  cell: UneCase;
  rowIndex: number;
  colIndex: number;
  theme: BoardTheme;
  onClick: (cell: UneCase) => void;
}

// ============================================================
// COMPOSANT DE BASE
// ============================================================

export const GridCellBase: React.FC<GridCellProps> = ({
  cell,
  rowIndex,
  colIndex,
  theme,
  onClick,
}) => {
  const { content, isStart, isTarget, style } = useCellStyle(cell, theme);

  const handleClick = useCallback(() => {
    onClick(cell);
  }, [onClick, cell]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  const isDisabled = cell.etat === StateCase.Lo;

  const title = [
    `Case (${colIndex}, ${rowIndex})`,
    `ID: ${cell.ncase}`,
    `Valeur: ${content || 'vide'}`,
    isStart ? 'Départ' : null,
    isTarget ? 'Cible' : null,
  ]
    .filter(Boolean)
    .join(' — ');

  const ariaLabel = [
    `Case ${cell.ncase}`,
    `valeur ${content || 'vide'}`,
    `état ${cell.etat}`,
    isTarget ? 'cible' : null,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div
      role="gridcell"
      tabIndex={isDisabled ? -1 : 0}
      aria-label={ariaLabel}
      aria-disabled={isDisabled}
      aria-pressed={cell.etat === StateCase.Choi}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="relative flex items-center justify-center border rounded-sm select-none transition-colors duration-100"
      style={style}
      title={title}
      data-row={rowIndex}
      data-col={colIndex}
      data-ncase={cell.ncase}
      data-state={cell.etat}
      data-target={isTarget ? 'true' : undefined}
      data-start={isStart ? 'true' : undefined}
    >
      {content}
    </div>
  );
};

GridCellBase.displayName = 'GridCellBase';

// ============================================================
// COMPARATEUR MEMO
// ============================================================

function arePropsEqual(prev: GridCellProps, next: GridCellProps): boolean {
  const a = prev.cell;
  const b = next.cell;

  return (
    a.ncase === b.ncase &&
    a.txt === b.txt &&
    a.itxt === b.itxt &&
    a.etat === b.etat &&
    a.placep === b.placep &&
    a.isTarget === b.isTarget &&
    a.tca === b.tca &&
    a.indi === b.indi &&
    a.indj === b.indj &&
    prev.theme === next.theme &&
    prev.onClick === next.onClick &&
    prev.rowIndex === next.rowIndex &&
    prev.colIndex === next.colIndex
  );
}

// ============================================================
// EXPORT MEMOÏSÉ
// ============================================================

export const GridCell = memo(GridCellBase, arePropsEqual);
GridCell.displayName = 'GridCell';