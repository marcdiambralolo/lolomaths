'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { useGameHistory } from '@/hooks/lolomaths/game/useGameHistory';

export const GameHistoryList: React.FC = () => {
  const { gameHistory } = useGameHistory();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll vers le bas à l'ajout d'un nouveau jeu
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [gameHistory.length]);

  // Mémoïsation des 5 derniers jeux + offset
  const { visibleGames, offset } = useMemo(() => {
    const visible = gameHistory.slice(-5);
    return {
      visibleGames: visible,
      offset: gameHistory.length - visible.length,
    };
  }, [gameHistory]);

  if (gameHistory.length === 0) return null;

  return (
    <div
      ref={scrollRef}
      className="bg-slate-900/50 border border-slate-800 rounded-xl p-2 max-h-16 overflow-y-auto scroll-smooth"
      role="list"
      aria-label="Historique des jeux"
    >
      <div className="flex flex-wrap gap-1 text-[10px] text-slate-400">
        {visibleGames.map((g, idx) => {
          const realIndex = offset + idx + 1;
          const scoreLabel =
            g.score >= 0 ? `+${g.score}` : `${g.score}`;
          return (
            <span
              key={realIndex}
              role="listitem"
              className={`px-2 py-0.5 rounded ${
                g.score >= 0
                  ? 'bg-emerald-900/40 text-emerald-300'
                  : 'bg-rose-900/40 text-rose-300'
              }`}
              title={`Jeu ${realIndex} — ${g.combination} — ${scoreLabel} pts`}
            >
              J{realIndex}: {g.score}pts
            </span>
          );
        })}
      </div>
    </div>
  );
};