"use client";

import { cx, formatEditionDate, getRelativeTime } from "@/lib/functions";
import type { GameResult } from "@/lib/interfaces";
import { motion } from "framer-motion";
import { Award, Calendar, Gamepad2, Star, Trophy, UserRound, Zap } from "lucide-react";
import { useState } from "react";

// On adapte la logique pour qu'elle colle aux statuts d'un match/édition de Lolomaths
const getMatchStatus = (status: string, isActive: boolean) => {
  if (isActive && status === 'active') {
    return { 
      label: 'En cours', 
      color: 'text-green-600 dark:text-green-400', 
      bg: 'bg-green-100 dark:bg-green-900/30', 
      icon: <Zap className="w-3 h-3" /> 
    };
  }
  if (status === 'ended' || status === 'completed') {
    return { 
      label: 'Terminé', 
      color: 'text-gray-600 dark:text-gray-400', 
      bg: 'bg-gray-100 dark:bg-gray-800', 
      icon: <Award className="w-3 h-3" /> 
    };
  }
  return { 
    label: 'À venir', 
    color: 'text-amber-600 dark:text-amber-400', 
    bg: 'bg-amber-100 dark:bg-amber-900/30', 
    icon: <Calendar className="w-3 h-3" /> 
  };
};

interface GameResultCardProps {
  consultation: GameResult;
  index: number;
  showDate?: boolean;
  showState?: boolean;
}

export default function GameResultCard({ 
  consultation, 
  index, 
  showDate = true, 
  showState = true 
}: GameResultCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // --- Données du joueur ---
  const nomJoueur = consultation.clientId?.username || consultation.clientId?.nom || 'Anonyme';
  
  // --- Données de la partie (adaptées de Consultation) ---
  // On suppose que le score est stocké dans 'price' ou un champ custom
  const scoreTotal = (consultation.scoreTotal ?? 0).toFixed(2);
  const nombreDeJeux = (consultation.nombreDeJeux ?? 0); // Ou un champ custom 'nombredejeu'
  const niveau = "Senior"; // À adapter selon la donnée réelle (consultation.niveau)
  const combinaison = consultation.timeSpent || '0'; // On garde le temps comme durée
  const relativeDate = consultation.createdAt ? getRelativeTime(consultation.createdAt) : 'Date inconnue';

  // --- Gestion de l'édition / Match (adaptée de idjeu) ---
  const gameEdition = typeof consultation.idjeu === 'object' ? consultation.idjeu : null;
  const editionStatus = gameEdition ? getMatchStatus(gameEdition.status as string, gameEdition.isActive as boolean) : null;
  
  const editionStartDate = gameEdition?.startgameDate ? new Date(gameEdition.startgameDate) : null;
  const editionEndDate = gameEdition?.endgameDate ? new Date(gameEdition.endgameDate) : null;
  const formattedStartDate = formatEditionDate(editionStartDate);
  const formattedEndDate = formatEditionDate(editionEndDate);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.01 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cx(
        "group relative overflow-hidden rounded-xl p-4",
        "bg-white dark:bg-gray-800",
        "border border-gray-100 dark:border-gray-700",
        "shadow-sm hover:shadow-lg",
        "transition-all duration-300"
      )}
    >
      <div className="relative z-10 space-y-3">
        {/* Ligne 1 : Date relative + Statut du match */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Trophy className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <span className="text-xs text-gray-500">{relativeDate}</span>
          </div>

          {editionStatus && showState && (
            <div className={cx(
              "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium",
              editionStatus.bg,
              editionStatus.color
            )}>
              {editionStatus.icon}
              {editionStatus.label}
            </div>
          )}
        </div>

        {/* Ligne 2 : Score et Niveau */}
        <div className="flex items-center justify-between bg-purple-50/50 dark:bg-purple-900/10 rounded-lg p-2">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Score Total</span>
            <span className="text-lg font-black text-purple-700 dark:text-purple-300">
              {scoreTotal} pts
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Niveau</span>
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-500" />
              {niveau}
            </span>
          </div>
        </div>

        {/* Ligne 3 : Joueur, jeux joués, temps */}
        <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <UserRound className="w-3 h-3" />
            <span className="truncate">{nomJoueur}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gamepad2 className="w-3 h-3" />
            <span>{nombreDeJeux} jeux</span>
          </div>         
        </div>

        {/* Ligne 4 : Dates de l'édition */}
        {editionStartDate && showDate && editionEndDate && (
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400">
              <Calendar className="w-3 h-3" />
              <span>
                {formattedStartDate} → {formattedEndDate}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Effet de survol */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-purple-500/5 to-transparent" />
      )}
    </motion.article>
  );
}