'use client';

import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '@/lib/store/useGameStore';

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
    if (cnbjeu === 0 && !lastConfirmedResult) {
      processedGamesRef.current = 0;
      setGameHistory([]);
      return;
    }

    if (!lastConfirmedResult) return;
    if (cnbjeu <= processedGamesRef.current) return;

    const numericScore =
      typeof lastConfirmedResult.notedjeu === 'number' &&
      Number.isFinite(lastConfirmedResult.notedjeu)
        ? lastConfirmedResult.notedjeu
        : 0;

    setGameHistory((prev) => [
      ...prev,
      {
        score: numericScore,
        combination: lastConfirmedResult.combine || 'N/A',
      },
    ]);

    processedGamesRef.current = cnbjeu;
  }, [cnbjeu, lastConfirmedResult]);

  return { gameHistory };
};