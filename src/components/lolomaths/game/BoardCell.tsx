// components/game/BoardCell.tsx
'use client';

import { CellState } from '@/lib/interfaces';
import React from 'react';
 
export interface BoardCellProps {
  cellIndex: number;          // ncase
  rowIndex: number;           // indi
  colIndex: number;           // indj
  text?: string;              // txt (ex: "5", "+", "*")
  cellType: 1 | 2 | 3;        // tca (1 = plateau, 2/3 = pion/opérateur)
  state: CellState;           // etat (EMPTY, LOCKED, SELECTED, PLACED)
  isHighlighted?: boolean;    // isbou
  backgroundColor?: string;   // fond
  borderColor?: string;       // bord
  backgroundImageUrl?: string;// imgf
  onClick?: (cellIndex: number, rowIndex: number, colIndex: number) => void;
  className?: string;
}

export const BoardCell: React.FC<BoardCellProps> = ({
  cellIndex,
  rowIndex,
  colIndex,
  text = '',
  cellType,
  state,
  isHighlighted = false,
  backgroundColor,
  borderColor,
  backgroundImageUrl,
  onClick,
  className = '',
}) => {
  const isPlaceable = state === CellState.EMPTY;
  const isSelected = state === CellState.SELECTED;
  const isLocked = state === CellState.LOCKED;

  const handleClick = () => {
    if (onClick) {
      onClick(cellIndex, rowIndex, colIndex);
    }
  };

  // Styles dynamiques basés sur le thème ou les props
  const customStyles: React.CSSProperties = {
    backgroundColor: backgroundColor || undefined,
    borderColor: borderColor || undefined,
    backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : undefined,
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLocked && cellType === 1 && !text}
      style={customStyles}
      data-row={rowIndex}
      data-col={colIndex}
      data-state={state}
      aria-label={`Case ${rowIndex},${colIndex} : ${text || 'vide'}`}
      className={`
        relative aspect-square w-full h-full flex items-center justify-center
        font-bold text-base sm:text-lg md:text-xl rounded-md transition-all duration-150
        border-2 select-none focus:outline-none focus:ring-2 focus:ring-indigo-500
        
        ${/* Styles par défaut si non surchargés par le thème */ ''}
        ${
          isSelected
            ? 'border-yellow-400 bg-yellow-100 dark:bg-yellow-900/50 shadow-lg scale-105 z-10'
            : isPlaceable
            ? 'border-blue-300 bg-blue-50/50 hover:bg-blue-100 cursor-pointer'
            : isLocked
            ? 'border-slate-300 bg-slate-200/60 dark:bg-slate-700 text-slate-500'
            : 'border-slate-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-white'
        }

        ${
          isHighlighted
            ? 'ring-4 ring-yellow-400 border-yellow-500 shadow-yellow-500/30 shadow-md animate-pulse'
            : ''
        }
        
        ${className}
      `}
    >
      {/* Texture d'arrière-plan si configurée */}
      {backgroundImageUrl && (
        <span 
          className="absolute inset-0 bg-cover bg-center opacity-40 rounded-sm pointer-events-none" 
          aria-hidden="true"
        />
      )}

      {/* Texte de la case (Nombre ou Opérateur) */}
      <span className="relative z-10 drop-shadow-sm">
        {text}
      </span>
    </button>
  );
};