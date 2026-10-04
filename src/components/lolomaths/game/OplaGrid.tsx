'use client';

import React, { memo, useCallback } from 'react';
import { UneCase } from '@/lib/interfaces';
import { useCompetitionStore } from '@/lib/store/useCompetitionStore';
import { useBoardTheme } from '@/lib/theme/useBoardTheme';
import { GridCell } from './GridCell';
import { GRID_COLS, GRID_ROWS } from './competitionEngine';

// ============================================================
// COMPOSANT
// ============================================================

export const OplaGrid: React.FC = memo(() => {
  const grid = useCompetitionStore((state) => state.grid);
  const handleCaseClick = useCompetitionStore((state) => state.handleCaseClick);
  const theme = useBoardTheme();

  // On stabilise la référence de `handleCaseClick` pour éviter
  // que les 221 cellules se re-rendent inutilement.
  const onCellClick = useCallback(
    (cell: UneCase) => handleCaseClick(cell),
    [handleCaseClick]
  );

  return (
    <div
      id="opla"
      className="w-full bg-slate-950 p-1.5 rounded-xl border border-slate-800 shadow-2xl"
    >
      <div
        className="w-full grid gap-px"
        role="grid"
        aria-label="Plateau de jeu Lolomaths"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${GRID_ROWS}, minmax(0, 1fr))`,
          aspectRatio: `${GRID_COLS} / ${GRID_ROWS}`,
        }}
      >
        {grid.map((row, j) =>
          row.map((cell, i) => (
            <GridCell
              key={`case-${j}-${i}`}
              cell={cell}
              rowIndex={j}
              colIndex={i}
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