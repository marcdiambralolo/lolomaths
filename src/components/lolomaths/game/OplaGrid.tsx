'use client';

import React, { memo, useCallback } from 'react';
import { UneCase } from '@/lib/interfaces';
import { useCompetitionStore } from '@/lib/store/useCompetitionStore';
import { useBoardTheme } from '@/lib/theme/useBoardTheme';
import { GridCell } from './GridCell';
import { GRID_COLS, GRID_ROWS } from './competitionEngine';
import { useHistoryStore } from '@/lib/store/useHistoryStore';
import { useGameStore } from '@/lib/store/useGameStore';

// ============================================================
// COMPOSANT : OplaGrid (Plateau 17 lignes x 13 colonnes)
// ============================================================

export const OplaGrid: React.FC = memo(() => {
  const grid = useGameStore ((state) => state.grid);
  const handleCaseClick = useGameStore((state) => state.handleCaseClick);
  const theme = useBoardTheme();

  // Stabilisation de la fonction de clic pour optimiser les performances de rendu des 221 cases (17 x 13)
  const onCellClick = useCallback(
    (cell: UneCase) => {
      handleCaseClick(cell);
    },
    [handleCaseClick]
  );

  if (!grid || grid.length === 0) {
    return null;
  }

  return (
    <div
      id="opla"
      className="w-full mx-auto max-w-full bg-slate-950 p-1.5 rounded-xl border border-slate-800 shadow-2xl overflow-hidden select-none"
    >
      <div
        className="w-full grid"
        role="grid"
        aria-label="Plateau de jeu Lolomaths"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${GRID_ROWS}, minmax(0, 1fr))`,
          aspectRatio: `${GRID_COLS} / ${GRID_ROWS}`,
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <GridCell
              key={`cell-${cell.indj ?? rowIndex}-${cell.indi ?? colIndex}`}
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