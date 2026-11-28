'use client';

import { motion } from 'framer-motion';
import { RotateCcw, Share2, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useHistoryStore } from '@/lib/store/useHistoryStore';
import { useCallback, useMemo } from 'react';

function formatScoreForShare(rawScore: unknown): string {
  if (typeof rawScore !== 'number' || !Number.isFinite(rawScore)) {
    return '0.00';
  }
  const rounded = Number(rawScore.toFixed(2));
  const normalized = Object.is(rounded, -0) ? 0 : rounded;
  return normalized.toFixed(2);
}

export function ResultActions() {
  const router = useRouter();
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

  const formattedScore = useMemo(
    () => formatScoreForShare(lastTournament?.score),
    [lastTournament?.score]
  );

  const handleReplay = useCallback(() => {
    router.push('/star/profil');
  }, [router]);

  const handleHome = useCallback(() => {
    router.push('/');
  }, [router]);

  const handleShare = useCallback(async () => {
    const text = `J'ai marqué ${formattedScore} points à Lolomaths ! 🎯`;
    const shareUrl =
      typeof window !== 'undefined' ? window.location.href : undefined;

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: 'Mon score Lolomaths',
          text,
          url: shareUrl,
        });
        return;
      } catch {
        // Annulé par l'utilisateur ou non supporté dans ce contexte
      }
    }

    if (
      typeof navigator !== 'undefined' &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === 'function'
    ) {
      try {
        const payload = shareUrl ? `${text} ${shareUrl}` : text;
        await navigator.clipboard.writeText(payload);
        alert('Score copié dans le presse-papier !');
        return;
      } catch {
        // Repli si l'accès presse-papier est refusé
      }
    }

    alert(text);
  }, [formattedScore]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="space-y-3"
    >
      {/* Bouton principal : Rejouer */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleReplay}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
      >
        <RotateCcw className="w-5 h-5" />
        Rejouer
      </motion.button>

      {/* Boutons secondaires */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShare}
          className="py-3 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold flex items-center justify-center gap-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
        >
          <Share2 className="w-4 h-4" />
          Partager
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleHome}
          className="py-3 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold flex items-center justify-center gap-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
        >
          <Home className="w-4 h-4" />
          Accueil
        </motion.button>
      </div>
    </motion.section>
  );
}