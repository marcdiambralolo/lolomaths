'use client';

import React, { memo, useCallback, useMemo } from 'react';
import { BoardTheme, StateCase, UneCase } from '@/lib/interfaces';
import { useCellStyle } from './useCellStyle';

export interface GridCellProps {
  cell: UneCase;
  rowIndex: number;
  colIndex: number;
  theme: BoardTheme;
  onClick: (cell: UneCase) => void;
}

function getMobileFontSize(content: string | number | null | undefined): string {
  const length = String(content ?? '').trim().length;
  if (length >= 3) return '12px';
  if (length === 2) return '14px';
  return '15.5px';
}

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
  // Détecte si un pion est posé sur la cellule
  const hasPlacedPion = cell.etat === StateCase.Choi || Boolean(cell.placep);

  const mobileFontSize = useMemo(() => getMobileFontSize(content), [content]);

  const mergedStyle = useMemo<React.CSSProperties>(() => {
    if (!hasPlacedPion) {
      return {
        ...style,
        '--mobile-font-size': mobileFontSize,
      } as React.CSSProperties;
    }

    // Effet 3D biseauté/bombé quand un pion est posé dans la cellule
    const existingShadow = style.boxShadow ? `${style.boxShadow}, ` : '';
    const existingBgImage = style.backgroundImage ? `${style.backgroundImage}, ` : '';

    return {
      ...style,
      '--mobile-font-size': mobileFontSize,
      zIndex: 2,
      backgroundImage: `${existingBgImage}linear-gradient(165deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.06) 45%, rgba(0,0,0,0.32) 100%)`,
      boxShadow: `${existingShadow}inset 0 2px 1px rgba(255, 255, 255, 0.55), inset 0 -3px 2px rgba(0, 0, 0, 0.55), inset 1.5px 0 1px rgba(255, 255, 255, 0.2), inset -1.5px 0 1px rgba(0, 0, 0, 0.35), 0 2px 5px rgba(0, 0, 0, 0.6)`,
    } as React.CSSProperties;
  }, [style, hasPlacedPion, mobileFontSize]);

  const title = useMemo(
    () =>
      [
        `Case (${colIndex}, ${rowIndex})`,
        `ID: ${cell.ncase}`,
        `Valeur: ${content || 'vide'}`,
        isStart ? 'Départ' : null,
        isTarget ? 'Cible' : null,
      ]
        .filter(Boolean)
        .join(' — '),
    [colIndex, rowIndex, cell.ncase, content, isStart, isTarget]
  );

  const ariaLabel = useMemo(
    () =>
      [
        `Case ${cell.ncase}`,
        `valeur ${content || 'vide'}`,
        `état ${cell.etat}`,
        isTarget ? 'cible' : null,
      ]
        .filter(Boolean)
        .join(', '),
    [cell.ncase, content, cell.etat, isTarget]
  );

  return (
    <div
      role="gridcell"
      tabIndex={isDisabled ? -1 : 0}
      aria-label={ariaLabel}
      aria-disabled={isDisabled}
      aria-pressed={cell.etat === StateCase.Choi}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`mobile-cell-scale relative flex items-center justify-center border-[0.5px] sm:border rounded-sm select-none transition-all duration-100 box-border font-black tabular-nums leading-none m-0 p-0 tracking-tighter overflow-hidden ${
        hasPlacedPion ? 'ring-1 ring-white/40 scale-[1.03]' : ''
      }`}
      style={mergedStyle}
      title={title}
      data-row={rowIndex}
      data-col={colIndex}
      data-ncase={cell.ncase}
      data-state={cell.etat}
      data-target={isTarget ? 'true' : undefined}
      data-start={isStart ? 'true' : undefined}
      data-placed={hasPlacedPion ? 'true' : undefined}
    >
      <span
        className="pointer-events-none leading-none"
        style={
          hasPlacedPion
            ? {
                textShadow:
                  '0 1px 0 rgba(255, 255, 255, 0.25), 0 -1px 1px rgba(0, 0, 0, 0.65)',
              }
            : undefined
        }
      >
        {content}
      </span>
    </div>
  );
};

GridCellBase.displayName = 'GridCellBase';

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

export const GridCell = memo(GridCellBase, arePropsEqual);
GridCell.displayName = 'GridCell';