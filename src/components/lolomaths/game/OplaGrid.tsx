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

// Couleur jaune 100% pour la bordure de la case cible
const TARGET_BORDER_COLOR = '#FFFF00';
const TARGET_BORDER_WIDTH = '2px';
const DEFAULT_BORDER_WIDTH = '1px';

const GridCellBase: React.FC<GridCellProps> = ({
  cell,
  rowIndex,
  colIndex,
  theme,
  onClick,
}) => {
  const isStart = cell.ncase === START_CASE_INDEX;
  const isTarget = cell.isTarget === true;

  const content = useMemo(() => {
    if (cell.txt !== '') return cell.txt;
    if (cell.itxt !== '') return cell.itxt;
    return '';
  }, [cell.txt, cell.itxt]);

  const cellStyle = useMemo<React.CSSProperties>(() => {
    const baseStyle: React.CSSProperties = {};

    if (cell.etat === StateCase.Lo) {
      Object.assign(baseStyle, {
        backgroundColor: theme.lockedCellBgColor,
        color: '#ffffff',
        fontWeight: 700,
        cursor: 'not-allowed',
      });
    } else if (cell.etat === StateCase.Choi) {
      Object.assign(baseStyle, {
        backgroundColor: theme.selectedCellBgColor,
        color: '#ffffff',
        fontWeight: 800,
        cursor: 'pointer',
      });
    } else if (cell.etat === StateCase.Pla) {
      Object.assign(baseStyle, {
        backgroundColor: theme.placedPawnBgColor,
        color: '#ffffff',
        fontWeight: 800,
        cursor: 'pointer',
      });
    } else if (isStart) {
      Object.assign(baseStyle, {
        backgroundColor: theme.startCellBgColor,
        color: '#ffffff',
        fontWeight: 700,
        cursor: 'pointer',
      });
    } else {
      const isOp = isOperateur(content);
      Object.assign(baseStyle, {
        backgroundColor: theme.cellBgColor,
        color: isOp ? '#FD010D' : '#ffffff',
        fontWeight: isOp ? 700 : 500,
        cursor: 'pointer',
      });
    }

    // Bordure : jaune 100% et 2px si case cible, sinon bordure du thème
    baseStyle.borderColor = isTarget
      ? TARGET_BORDER_COLOR
      : theme.cellBorderColor;
    baseStyle.borderWidth = isTarget
      ? TARGET_BORDER_WIDTH
      : DEFAULT_BORDER_WIDTH;

    return baseStyle;
  }, [cell.etat, content, isStart, isTarget, theme]);

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
      }}
      title={`Case (${colIndex}, ${rowIndex}) - ID: ${cell.ncase} - Valeur: ${content || 'vide'}${isTarget ? ' — Cible' : ''}`}
      aria-label={`Case ${cell.ncase}, valeur ${content || 'vide'}, état ${cell.etat}${isTarget ? ', cible' : ''}`}
      data-row={rowIndex}
      data-col={colIndex}
      data-state={cell.etat}
      data-target={isTarget ? 'true' : undefined}
    >
      {content}
    </div>
  );
};

const GridCell = memo(GridCellBase, (prev, next) => {
  return (
    prev.cell.ncase === next.cell.ncase &&
    prev.cell.txt === next.cell.txt &&
    prev.cell.itxt === next.cell.itxt &&
    prev.cell.etat === next.cell.etat &&
    prev.cell.placep === next.cell.placep &&
    prev.cell.isTarget === next.cell.isTarget &&
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