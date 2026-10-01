import { useCompetitionStore } from '@/lib/store/useCompetitionStore';
import React from 'react';

interface DirectionActionsProps {
 
  onSelectDirection: (index: number) => void;
}

const DIRECTIONS = [
  { key: 'up', label: '↑ Haut', index: 0 },
  { key: 'down', label: '↓ Bas', index: 1 },
  { key: 'left', label: '← Gauche', index: 2 },
  { key: 'right', label: '→ Droite', index: 3 },
] as const;

export const DirectionActions: React.FC<DirectionActionsProps> = ({
 
  onSelectDirection,
}) => {
  const store = useCompetitionStore();
  const validDirections = DIRECTIONS.filter(d => store.directionsValid[d.key]);

  if (validDirections.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl animate-pulse">
      {validDirections.map(({ key, label, index }) => (
        <button
          key={key}
          onClick={() => onSelectDirection(index)}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-md hover:scale-105 active:scale-95"
        >
          {label} ({store.gameResults[index]?.notedjeu?.toFixed(1) || 0} pts)
        </button>
      ))}
    </div>
  );
};