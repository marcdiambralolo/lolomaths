'use client';

import React, { useMemo } from 'react';
import { useGameStore } from '@/lib/store/useGameStore';

interface DirectionActionsProps {
  onSelectDirection: (resultIndex: number) => void;
}

// Ordre = index dans gameResults : [0]=Up, [1]=Down, [2]=Left, [3]=Right.
// Fidèle à `disen(index)` Kotlin.
const DIRECTION_CONFIG = [
  { key: 'up' as const, index: 0, label: 'Haut' },
  { key: 'down' as const, index: 1, label: 'Bas' },
  { key: 'left' as const, index: 2, label: 'Gauche' },
  { key: 'right' as const, index: 3, label: 'Droite' },
];

function toFiniteNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Object.is(value, -0) ? 0 : value;
  }
  return fallback;
}

function formatTwoDecimals(value: unknown): string {
  const safeValue = toFiniteNumber(value, 0);
  const rounded = Number(safeValue.toFixed(2));
  const normalized = Object.is(rounded, -0) ? 0 : rounded;
  return normalized.toFixed(2);
}

export const DirectionActions: React.FC<DirectionActionsProps> = ({
  onSelectDirection,
}) => {
  const directionsValid = useGameStore((state) => state.directionsValid);
  const gameResults = useGameStore((state) => state.gameResults);

  const activeDirections = useMemo(
    () =>
      DIRECTION_CONFIG.map((dir) => {
        const isValid = Boolean(directionsValid?.[dir.key]);
        if (!isValid) return null;

        const result = gameResults?.[dir.index];
        if (!result) return null;

        const rc = toFiniteNumber(result.result, 0);
        const target = toFiniteNumber(result.nbreatind, 0);
        const df = toFiniteNumber(target - rc, 0);

        return {
          ...dir,
          rc,
          df,
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
        const formattedRc = formatTwoDecimals(item.rc);
        const formattedDf = formatTwoDecimals(item.df);

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onSelectDirection(item.index)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-lg sm:text-lg leading-tight transition shadow-md hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-300"
            aria-label={`${item.label} (rc = ${formattedRc} , df = ${formattedDf})`}
          >
            {item.label} (rc = {formattedRc} , df = {formattedDf})
          </button>
        );
      })}
    </div>
  );
};