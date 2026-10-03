'use client';

import React, { memo, useCallback, useMemo } from 'react';
import { START_CASE_INDEX, isOperateur } from './competitionEngine';
import { BoardTheme, UneCase, StateCase } from '@/lib/interfaces';
import { useCompetitionStore } from '@/lib/store/useCompetitionStore';
import { useBoardTheme } from '@/lib/theme/useBoardTheme';

interface GridCellProps {
  cell: UneCase;
  rowIndex: number;
  colIndex: number;
  theme: BoardTheme;
  onClick: (cell: UneCase) => void;
}

const GridCellBase: React.FC<GridCellProps> = ({
  cell,
  rowIndex,
  colIndex,
  theme,
  onClick,
}) => {
  const isStart = cell.ncase === START_CASE_INDEX;

  const content = useMemo(() => {
    if (cell.txt !== '') return cell.txt;
    if (cell.itxt !== '') return cell.itxt;
    return '';
  }, [cell.txt, cell.itxt]);

  const cellStyle = useMemo<React.CSSProperties>(() => {
    if (cell.etat === StateCase.Lo) {
      return {
        backgroundColor: theme.lockedCellBgColor,
        color: '#ffffff',
        borderColor: theme.cellBorderColor,
        fontWeight: 700,
        cursor: 'not-allowed',
      };
    }
    if (cell.etat === StateCase.Choi) {
      return {
        backgroundColor: theme.selectedCellBgColor,
        color: '#ffffff',
        borderColor: theme.cellBorderColor,
        fontWeight: 800,
        cursor: 'pointer',
      };
    }
    if (cell.etat === StateCase.Pla) {
      return {
        backgroundColor: theme.placedPawnBgColor,
        color: '#ffffff',
        borderColor: theme.cellBorderColor,
        fontWeight: 800,
        cursor: 'pointer',
      };
    }
    if (isStart) {
      return {
        backgroundColor: theme.startCellBgColor,
        color: '#ffffff',
        borderColor: theme.cellBorderColor,
        fontWeight: 700,
        cursor: 'pointer',
      };
    }
    const isOp = isOperateur(content);
    return {
      backgroundColor: theme.cellBgColor,
      color: isOp ? '#FD010D' : '#ffffff',
      borderColor: theme.cellBorderColor,
      fontWeight: isOp ? 700 : 500,
      cursor: 'pointer',
    };
  }, [cell.etat, content, isStart, theme]);

  const handleClick = useCallback(() => {
    onClick(cell);
  }, [onClick, cell]);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      className="relative flex items-center justify-center border rounded-sm select-none"
      style={{
        ...cellStyle,
        fontSize: 'clamp(8px, 1.4vw, 14px)',
        fontFamily: 'monospace',
        borderWidth: '1px',
      }}
      title={`Case (${colIndex}, ${rowIndex}) - ID: ${cell.ncase} - Valeur: ${content || 'vide'}`}
      aria-label={`Case ${cell.ncase}, valeur ${content || 'vide'}, état ${cell.etat}`}
      data-row={rowIndex}
      data-col={colIndex}
      data-state={cell.etat}
    >
      {content}
    </div>
  );
};

/**
 * Comparateur personnalisé pour éviter les re-renders inutiles :
 * on ne compare QUE les propriétés réellement utilisées par le rendu.
 * Un `cell` recréé (via `{ ...cell }`) avec les mêmes valeurs ne re-render pas.
 */
const GridCell = memo(GridCellBase, (prev, next) => {
  return (
    prev.cell.ncase === next.cell.ncase &&
    prev.cell.txt === next.cell.txt &&
    prev.cell.itxt === next.cell.itxt &&
    prev.cell.etat === next.cell.etat &&
    prev.cell.placep === next.cell.placep &&
    prev.theme === next.theme &&
    prev.onClick === next.onClick &&
    prev.rowIndex === next.rowIndex &&
    prev.colIndex === next.colIndex
  );
});

GridCell.displayName = 'GridCell';

export const OplaGrid: React.FC = memo(() => {
  const grid = useCompetitionStore((state) => state.grid);
  const handleCaseClick = useCompetitionStore((state) => state.handleCaseClick);
  const theme = useBoardTheme();

  return (
    <div
      id="opla"
      className="w-full bg-slate-950 p-1.5 rounded-xl border border-slate-800 shadow-2xl"
    >
      <div
        className="w-full grid gap-px"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(13, minmax(0, 1fr))',
          gridTemplateRows: 'repeat(17, minmax(0, 1fr))',
          aspectRatio: '13 / 17',
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
              onClick={handleCaseClick}
            />
          ))
        )}
      </div>
    </div>
  );
});

OplaGrid.displayName = 'OplaGrid';