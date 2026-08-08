import React from 'react';
 
import { GridCase } from './GridCase';
import { UneCase } from '@/lib/interfaces';

interface BoardProps {
  grid: UneCase[][];
  onCaseClick: (c: UneCase) => void;
}

export const Board: React.FC<BoardProps> = ({ grid, onCaseClick }) => {
  return (
    <div className="inline-block p-3 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-x-auto">
      <div className="flex flex-col gap-1">
        {grid.map((row, j) => (
          <div key={`row-${j}`} className="flex gap-1">
            {row.map((cell) => (
              <GridCase
                key={`case-${cell.indj}-${cell.indi}`}
                caseData={cell}
                onClick={onCaseClick}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};