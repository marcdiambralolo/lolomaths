'use client';

import { motion } from 'framer-motion';
import { RotateCcw, Share2, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useHistoryStore } from '@/lib/store/useHistoryStore';
import { useMemo } from 'react';

export function ResultActions() {
  const router = useRouter();
  const tournaments = useHistoryStore((s) => s.tournaments);
  const lastTournamentId = useHistoryStore((s) => s.lastTournamentId);

  const lastTournament = useMemo(() => {
    if (lastTournamentId) {
      const found = tournaments.find((t) => t.id === lastTournamentId);
      if (found) return found;
    }
    return tournaments[tournaments.length - 1];
  }, [tournaments, lastTournamentId]);

  const scoreTotal = lastTournament?.score ?? 0;

  const handleReplay = () => router.push('/star/profil');
  const handleHome = () => router.push('/');

  const handleShare = async () => {
    const text = `J'ai marqué ${scoreTotal.toFixed(2)} points à Lolomaths ! 🎯`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Mon score Lolomaths',
          text,
          url: window.location.href,
        });
      } catch {
        // Annulé
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${text} ${window.location.href}`);
        alert('Score copié dans le presse-papier !');
      } catch {
        alert('Impossible de copier le lien.');
      }
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="space-y-3"
    >
      {/* Bouton principal : Rejouer */}
      <motion.button
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
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShare}
          className="py-3 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold flex items-center justify-center gap-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
        >
          <Share2 className="w-4 h-4" />
          Partager
        </motion.button>
        <motion.button
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