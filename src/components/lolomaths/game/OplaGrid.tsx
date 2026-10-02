'use client';

import React, { memo, useCallback, useMemo } from 'react';
import { START_CASE_INDEX, isOperateur } from './competitionEngine';
import { UneCase, StateCase } from '@/lib/interfaces';
import { useCompetitionStore } from '@/lib/store/useCompetitionStore';

interface GridCellProps {
  cell: UneCase;
  rowIndex: number;
  colIndex: number;
  onClick: (cell: UneCase) => void;
}

const GridCell: React.FC<GridCellProps> = memo(({ cell, rowIndex, colIndex, onClick }) => {
  const isStart = cell.ncase === START_CASE_INDEX;
  const isInteractive = cell.etat !== StateCase.Lo;

  const content = useMemo(() => {
    if (cell.txt !== '') return cell.txt;
    if (cell.itxt && cell.itxt.trim() !== '') return cell.itxt;
    if (isStart) return '★';
    return '';
  }, [cell.txt, cell.itxt, isStart]);

  const cellStyles = useMemo(() => {
    const isNumeric = !isOperateur(cell.txt) && cell.txt !== '';

    // 1. Case verrouillée (pion déjà validé/bloqué)
    if (cell.etat === StateCase.Lo) {
      return 'bg-slate-700 border-slate-600 text-slate-200 font-bold shadow-inner cursor-not-allowed opacity-80';
    }

    // 2. Case sélectionnée
    if (cell.etat === StateCase.Choi) {
      return 'bg-yellow-400 border-yellow-500 text-slate-950 font-black scale-105 z-10 shadow-lg ring-2 ring-yellow-300 animate-pulse';
    }

    // 3. Pion posé temporairement par le joueur
    if (cell.etat === StateCase.Pla) {
      if (isNumeric) {
        return 'bg-gradient-to-br from-sky-500 to-sky-600 border-sky-400 text-white font-extrabold shadow-md hover:from-sky-400 hover:to-sky-500 hover:scale-105 transition-all duration-150';
      }
      return 'bg-gradient-to-br from-amber-500 to-amber-600 border-amber-400 text-slate-950 font-black shadow-md hover:from-amber-400 hover:to-amber-500 hover:scale-105 transition-all duration-150';
    }

    // 4. Case centrale de départ (vide)
    if (isStart) {
      return 'bg-amber-500/20 border-amber-500/60 text-amber-400 font-bold hover:bg-amber-500/30 hover:border-amber-400 transition-all duration-150 cursor-pointer';
    }

    // 5. Case standard de la grille
    const hasInitialText = Boolean(cell.itxt && cell.itxt.trim() !== '');
    return [
      'bg-slate-900/80 border-slate-800 hover:bg-slate-800 hover:border-slate-700 hover:text-white hover:scale-105 transition-all duration-150 cursor-pointer',
      hasInitialText ? 'text-cyan-400/80 font-bold' : 'text-slate-500 font-normal'
    ].join(' ');
  }, [cell.etat, cell.txt, cell.itxt, isStart]);

  const handleClick = useCallback(() => {
    if (isInteractive) onClick(cell);
  }, [isInteractive, onClick, cell]);

  return (
    <button
      onClick={handleClick}
      disabled={!isInteractive}
      className={`relative w-full h-full flex items-center justify-center border text-[9px] sm:text-xs md:text-sm font-mono rounded-sm transition-all duration-150 ${
        isInteractive ? 'active:scale-95' : ''
      } ${cellStyles}`}
      title={`Case (${colIndex}, ${rowIndex}) - ID: ${cell.ncase} - Valeur: ${content || 'vide'}`}
      data-row={rowIndex}
      data-col={colIndex}
      data-state={cell.etat}
    >
      {content}

      {/* Témoin visuel de case verrouillée */}
      {cell.etat === StateCase.Lo && (
        <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-slate-400 rounded-full" aria-hidden="true" />
      )}

      {/* Repère de la case départ si couverte */}
      {isStart && cell.txt !== '' && (
        <span className="absolute -bottom-0.5 -left-0.5 text-[8px] text-amber-400" aria-hidden="true">
          ★
        </span>
      )}
    </button>
  );
});

GridCell.displayName = 'GridCell';

export const OplaGrid: React.FC = () => {
  const grid = useCompetitionStore((state) => state.grid);
  const handleCaseClick = useCompetitionStore((state) => state.handleCaseClick);

  return (
    <div id="opla" className="w-full bg-slate-950 p-1 rounded-lg border border-slate-800 shadow-2xl">
      <div
        className="w-full grid gap-0.5 select-none"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(13, minmax(0, 1fr))',
          gridTemplateRows: 'repeat(17, minmax(0, 1fr))',
          aspectRatio: '13 / 17'
        }}
      >
        {grid.map((row, j) =>
          row.map((cell, i) => (
            <GridCell
              key={`case-${j}-${i}`}
              cell={cell}
              rowIndex={j}
              colIndex={i}
              onClick={handleCaseClick}
            />
          ))
        )}
      </div>
    </div>
  );
};