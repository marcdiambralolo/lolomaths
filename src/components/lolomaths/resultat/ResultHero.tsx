'use client';

import { motion } from 'framer-motion';
import { useHistoryStore } from '@/lib/store/useHistoryStore';
import { useMemo } from 'react';

function normalizeScore(rawScore: unknown): number {
  if (typeof rawScore !== 'number' || !Number.isFinite(rawScore)) {
    return 0;
  }
  const rounded = Number(rawScore.toFixed(2));
  return Object.is(rounded, -0) ? 0 : rounded;
}

export function ResultHero() {
  const tournaments = useHistoryStore((s) => s.tournaments);
  const lastTournamentId = useHistoryStore((s) => s.lastTournamentId);

  const lastTournament = useMemo(() => {
    const safeList = Array.isArray(tournaments) ? tournaments : [];
    if (lastTournamentId) {
      const found = safeList.find((t) => t.id === lastTournamentId);
      if (found) return found;
    }
    return safeList[safeList.length - 1];
  }, [tournaments, lastTournamentId]);

  if (!lastTournament) return null;

  const scoreTotal = normalizeScore(lastTournament.score);
  const isTournamentOver = Boolean(
    lastTournament.isGameOver ?? lastTournament.isgameover
  );

  const performance =
    scoreTotal >= 100
      ? 'excellent'
      : scoreTotal >= 50
        ? 'bon'
        : scoreTotal >= 20
          ? 'passable'
          : 'a-revoir';

  const config = {
    excellent: {
      emoji: '🏆',
      label: 'Excellent !',
      gradient: 'from-amber-400 via-yellow-500 to-orange-500',
    },
    bon: {
      emoji: '⭐',
      label: 'Bien joué !',
      gradient: 'from-blue-400 via-indigo-500 to-purple-500',
    },
    passable: {
      emoji: '👍',
      label: 'Pas mal !',
      gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
    },
    'a-revoir': {
      emoji: '💪',
      label: 'Continue !',
      gradient: 'from-slate-400 via-slate-500 to-slate-600',
    },
  }[performance];

  return (
    <motion.section
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      className={`relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br ${config.gradient} shadow-2xl`}
    >
      {/* Emoji en filigrane */}
      <div
        aria-hidden="true"
        className="absolute -right-6 -top-6 text-9xl opacity-20 pointer-events-none select-none"
      >
        {config.emoji}
      </div>

      <div className="relative z-10 text-center space-y-2">
        <div className="text-sm font-semibold text-white/90 uppercase tracking-wider">
          {isTournamentOver ? 'Tournoi terminé' : 'Jeu terminé'}
        </div>

        {/* Score */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="flex items-baseline justify-center gap-2"
        >
          <span className="text-3xl sm:text-4xl font-black text-white drop-shadow-lg">
            Score : {scoreTotal.toFixed(2)}
          </span>
        </motion.div>
      </div>
    </motion.section>
  );
}