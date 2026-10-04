'use client';

import { useGameStore } from '@/lib/store/useGameStore';
import { useEffect, useRef, useState } from 'react';

export interface GameHistoryItem {
  score: number;
  combination: string;
}

export const useGameHistory = () => {
  const cnbjeu = useGameStore((state) => state.cnbjeu);
  const lastConfirmedResult = useGameStore(
    (state) => state.lastConfirmedResult
  );

  const [gameHistory, setGameHistory] = useState<GameHistoryItem[]>([]);
  const processedGamesRef = useRef(0);

  useEffect(() => {
    if (!lastConfirmedResult) return;

    // On enregistre le résultat seulement quand cnbjeu a été incrémenté
    // (c.-à-d. après que `confirmCalculation` a poussé le résultat)
    if (cnbjeu <= processedGamesRef.current) return;

    setGameHistory((prev) => [
      ...prev,
      {
        score: lastConfirmedResult.notedjeu,
        combination: lastConfirmedResult.combine || 'N/A',
      },
    ]);

    processedGamesRef.current = cnbjeu;
  }, [cnbjeu, lastConfirmedResult]);

  return { gameHistory };
};