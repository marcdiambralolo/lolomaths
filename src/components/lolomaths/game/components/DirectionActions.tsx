// "use client";

// import React from "react";
// import { useCompetitionStore } from "@/lib/store/useCompetitionStore";

// interface DirectionActionsProps {
//   onSelectDirection: (resultIndex: number) => void;
// }

// // Ordre correspondant exactement à la boucle d'évaluation dans calculateScores (Up, Down, Left, Right)
// const DIRECTION_CONFIG = [
//   { key: "up", label: "↑ Haut" },
//   { key: "down", label: "↓ Bas" },
//   { key: "left", label: "← Gauche" },
//   { key: "right", label: "→ Droite" },
// ] as const;

// export const DirectionActions: React.FC<DirectionActionsProps> = ({ onSelectDirection }) => {
//   const directionsValid = useCompetitionStore((state) => state.directionsValid);
//   const gameResults = useCompetitionStore((state) => state.gameResults);

//   // Associer les directions valides à leurs résultats correspondants dans gameResults
//   let currentResultIndex = 0;
//   const activeDirections = DIRECTION_CONFIG.map((dir) => {
//     const isValid = directionsValid[dir.key];
//     if (!isValid) return null;

//     const resultIndex = currentResultIndex;
//     const result = gameResults[resultIndex];
//     currentResultIndex++;

//     return {
//       ...dir,
//       resultIndex,
//       score: result?.notedjeu ?? 0,
//     };
//   }).filter(Boolean);

//   if (activeDirections.length === 0) return null;

//   return (
//     <div className="flex flex-wrap justify-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl animate-pulse">
//       {activeDirections.map((item) => {
//         if (!item) return null;
//         return (
//           <button
//             key={item.key}
//             type="button"
//             onClick={() => onSelectDirection(item.resultIndex)}
//             className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-md hover:scale-105 active:scale-95"
//           >
//             {item.label} ({item.score.toFixed(1)} pts)
//           </button>
//         );
//       })}
//     </div>
//   );
// };

'use client';

import React, { useMemo } from 'react';
import { useCompetitionStore } from '@/lib/store/useCompetitionStore';

interface DirectionActionsProps {
  onSelectDirection: (resultIndex: number) => void;
}

// Ordre correspondant exactement à la boucle d'évaluation dans calculateScores
// (Up, Down, Left, Right) — fidèle à `disen(index)` Kotlin.
const DIRECTION_CONFIG = [
  { key: 'up' as const, label: '↑ Haut', symbol: '↑' },
  { key: 'down' as const, label: '↓ Bas', symbol: '↓' },
  { key: 'left' as const, label: '← Gauche', symbol: '←' },
  { key: 'right' as const, label: '→ Droite', symbol: '→' },
];

export const DirectionActions: React.FC<DirectionActionsProps> = ({
  onSelectDirection,
}) => {
  const directionsValid = useCompetitionStore((state) => state.directionsValid);
  const gameResults = useCompetitionStore((state) => state.gameResults);

  // Associe chaque direction valide à son résultat correspondant dans gameResults.
  // ⚠️ `gameResults` est ordonné dans le même ordre que DIRECTION_CONFIG,
  //    et `directionsValid.X` n'est mis à `true` qu'après `results.push(...)`.
  const activeDirections = useMemo(() => {
    let currentResultIndex = 0;
    return DIRECTION_CONFIG.map((dir) => {
      const isValid = directionsValid[dir.key];
      if (!isValid) return null;

      const resultIndex = currentResultIndex;
      const result = gameResults[resultIndex];
      currentResultIndex++;

      return {
        ...dir,
        resultIndex,
        score: result?.notedjeu ?? 0,
      };
    }).filter((x): x is NonNullable<typeof x> => x !== null);
  }, [directionsValid, gameResults]);

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
            onClick={() => onSelectDirection(item.resultIndex)}
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