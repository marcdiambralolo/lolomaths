'use client';

import React, { useMemo } from 'react';
import { useCompetitionStore } from '@/lib/store/useCompetitionStore';

interface DirectionActionsProps {
  onSelectDirection: (resultIndex: number) => void;
}

// Ordre = index dans gameResults : [0]=Up, [1]=Down, [2]=Left, [3]=Right.
// Fidèle à `disen(index)` Kotlin.
const DIRECTION_CONFIG = [
  { key: 'up' as const, index: 0, label: '↑ Haut' },
  { key: 'down' as const, index: 1, label: '↓ Bas' },
  { key: 'left' as const, index: 2, label: '← Gauche' },
  { key: 'right' as const, index: 3, label: '→ Droite' },
];

export const DirectionActions: React.FC<DirectionActionsProps> = ({
  onSelectDirection,
}) => {
  const directionsValid = useCompetitionStore((state) => state.directionsValid);
  const gameResults = useCompetitionStore((state) => state.gameResults);

  // `gameResults` est un tableau de 4 éléments indexé par direction :
  //   [0] = Up, [1] = Down, [2] = Left, [3] = Right.
  // On utilise directement `dir.index` pour lire le bon résultat.
  const activeDirections = useMemo(
    () =>
      DIRECTION_CONFIG.map((dir) => {
        const isValid = directionsValid[dir.key];
        if (!isValid) return null;

        const result = gameResults[dir.index];
        if (!result) return null;

        return {
          ...dir,
          score: result.notedjeu,
        };
      }).filter((x): x is NonNullable<typeof x> => x !== null),
    [directionsValid, gameResults]
  );

  if (activeDirections.length === 0) return null;

  return (
    <div
      className="flex flex-wrap justify-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl"
      role="group"
      aria-label="Directions valides"
    >
      {activeDirections.map((item) => {
        const scoreLabel =
          item.score >= 0
            ? `+${item.score.toFixed(1)}`
            : item.score.toFixed(1);

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onSelectDirection(item.index)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-md hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-300"
            aria-label={`${item.label} — ${scoreLabel} points`}
          >
            {item.label} ({scoreLabel} pts)
          </button>
        );
      })}
    </div>
  );
};