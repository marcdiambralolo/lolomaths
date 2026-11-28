'use client';

import { GameResult } from '@/lib/interfaces';
import { motion } from 'framer-motion';
import { Timer, Trophy, Star } from 'lucide-react';
import EmptyState from './EmptyState';

interface ConsultationListProps {
  hasConsultations: boolean;
  rankedConsultations: GameResult[];
  duplicateMap: Map<string, { isDuplicate: boolean; count: number }>;
}

function formatDuration(value: string | number | undefined): string {
  const safe = Math.max(0, Math.floor(Number(value) || 0));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return m > 0 ? `${m}m${s.toString().padStart(2, '0')}s` : `${s}s`;
}

const MEDALS = ['🥇', '🥈', '🥉'];

export function ConsultationList({
  hasConsultations,
  rankedConsultations,
  duplicateMap,
}: ConsultationListProps) {
  if (!hasConsultations) {
    return (
      <EmptyState
        icon="📚"
        message="Aucune consultation pour le moment."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6">
      {rankedConsultations.map((consultation, index) => {
        const rank = index + 1;
        const medal = MEDALS[index] ?? `#${rank}`;
        const isPerfect = consultation.notedbase === 5;
        const hasBonus = (consultation.bonus ?? 0) > 0;
        const ecart = Math.abs(
          (consultation.nbreatind ?? 0) - (consultation.result ?? 0)
        );
        const combine = consultation.combine ?? '';
        const duplicateInfo = duplicateMap.get(combine);
        const isDuplicate = duplicateInfo?.isDuplicate ?? false;
        const duplicateCount = duplicateInfo?.count ?? 0;

        return (
          <motion.div
            key={consultation._id ?? index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between gap-3">
              {/* Rang */}
              <div className="text-2xl font-black text-slate-400 dark:text-slate-500 min-w-[48px] text-center">
                {medal}
              </div>

              {/* Infos joueur + combinaison */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                    {consultation.clientId?.username ?? 'Anonyme'}
                  </span>
                  {isPerfect && <Trophy className="w-4 h-4 text-amber-500" />}
                  {hasBonus && !isPerfect && (
                    <Star className="w-4 h-4 text-purple-500" />
                  )}
                  {isDuplicate && (
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold">
                      ×{duplicateCount}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                  <span className="font-mono">{combine || '—'}</span>
                  <span>→ {consultation.result?.toFixed(2) ?? '0.00'}</span>
                  <span
                    className={
                      isPerfect
                        ? 'text-emerald-600 font-bold'
                        : 'text-amber-600 font-bold'
                    }
                  >
                    écart: {ecart.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Score + durée */}
              <div className="text-right">
                <div
                  className={`text-lg font-black ${
                    (consultation.notedjeu ?? 0) >= 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {(consultation.notedjeu ?? 0) >= 0 ? '+' : ''}
                  {(consultation.notedjeu ?? 0).toFixed(2)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 justify-end">
                  <Timer className="w-3 h-3" />
                  {formatDuration(consultation.timeSpent)}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}