// components/game/BoardGrid.tsx
'use client';

import React from 'react';
import { BoardCell, BoardCellProps } from './BoardCell';

interface BoardGridProps {
  cells: BoardCellProps[];
  onCellClick?: (cellIndex: number, rowIndex: number, colIndex: number) => void;
}

export const BoardGrid: React.FC<BoardGridProps> = ({ cells, onCellClick }) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-2 bg-slate-900 rounded-xl shadow-2xl border border-slate-800">
      <div className="grid grid-cols-13 gap-1 aspect-square w-full">
        {cells.map((cell, index) => (
          <BoardCell
            key={`cell-${index}`}
            {...cell}
            onClick={onCellClick}
          />
        ))}
      </div>
    </div>
  );
};