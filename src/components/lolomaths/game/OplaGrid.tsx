'use client';

import React, { memo, useCallback, useMemo } from 'react';
import { UneCase } from '@/lib/interfaces';
import { useGameStore } from '@/lib/store/useGameStore';
import { useBoardTheme } from '@/lib/theme/useBoardTheme';
import { GridCell } from './GridCell';
import { GRID_COLS, GRID_ROWS } from './competitionEngine';

// ============================================================
// COMPOSANT : OplaGrid (Plateau 17 lignes x 13 colonnes)
// ============================================================

export const OplaGrid: React.FC = memo(() => {
  const grid = useGameStore((state) => state.grid);
  const handleCaseClick = useGameStore((state) => state.handleCaseClick);
  const theme = useBoardTheme();

  const onCellClick = useCallback(
    (cell: UneCase) => {
      handleCaseClick(cell);
    },
    [handleCaseClick]
  );

  const gridStyle = useMemo<React.CSSProperties>(
    () => ({
      gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
      gridTemplateRows: `repeat(${GRID_ROWS}, minmax(0, 1fr))`,
      aspectRatio: `${GRID_COLS} / ${GRID_ROWS}`,
    }),
    []
  );

  if (!Array.isArray(grid) || grid.length === 0) {
    return null;
  }

  return (
    <div
      id="opla"
      className="w-full bg-slate-950 p-0 rounded-none border-0 sm:border border-slate-800 shadow-none sm:shadow-2xl overflow-hidden select-none"
    >
      <div
        className="w-full grid @container"
        role="grid"
        aria-label="Plateau de jeu Lolomaths"
        style={gridStyle}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <GridCell
              key={`cell-${cell.ncase ?? `${rowIndex}-${colIndex}`}`}
              cell={cell}
              rowIndex={rowIndex}
              colIndex={colIndex}
              theme={theme}
              onClick={onCellClick}
            />
          ))
        )}
      </div>
    </div>
  );
});

OplaGrid.displayName = 'OplaGrid';