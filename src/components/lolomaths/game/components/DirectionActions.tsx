"use client";

import React from "react";
import { useCompetitionStore } from "@/lib/store/useCompetitionStore";

interface DirectionActionsProps {
  onSelectDirection: (resultIndex: number) => void;
}

// Ordre correspondant exactement à la boucle d'évaluation dans calculateScores (Up, Down, Left, Right)
const DIRECTION_CONFIG = [
  { key: "up", label: "↑ Haut" },
  { key: "down", label: "↓ Bas" },
  { key: "left", label: "← Gauche" },
  { key: "right", label: "→ Droite" },
] as const;

export const DirectionActions: React.FC<DirectionActionsProps> = ({ onSelectDirection }) => {
  const directionsValid = useCompetitionStore((state) => state.directionsValid);
  const gameResults = useCompetitionStore((state) => state.gameResults);

  // Associer les directions valides à leurs résultats correspondants dans gameResults
  let currentResultIndex = 0;
  const activeDirections = DIRECTION_CONFIG.map((dir) => {
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
  }).filter(Boolean);

  if (activeDirections.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl animate-pulse">
      {activeDirections.map((item) => {
        if (!item) return null;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onSelectDirection(item.resultIndex)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-md hover:scale-105 active:scale-95"
          >
            {item.label} ({item.score.toFixed(1)} pts)
          </button>
        );
      })}
    </div>
  );
};