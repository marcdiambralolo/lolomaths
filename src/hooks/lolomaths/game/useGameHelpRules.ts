'use client';

import { useMemo } from 'react';
import { UneCase } from '@/lib/interfaces';

interface HelpContext {
  isStartCovered: boolean;
  placedPions: UneCase[];
  isFirstGame: boolean;
  hasLockedPion: boolean;
  hasAvailablePions: boolean;
  isMatchOver: boolean;
  directionsValid: {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
  };
}

export const useGameHelpRules = ({
  isStartCovered,
  placedPions,
  isFirstGame,
  hasLockedPion,
  hasAvailablePions,
  isMatchOver,
  directionsValid,
}: HelpContext): string[] => {
  return useMemo(() => {
    const messages: string[] = [];
    const placedCount = placedPions.length;

    // ============================================================
    // 1. Match terminé → message prioritaire unique
    // ============================================================
    if (isMatchOver) {
      messages.push(
        '🏁 Match terminé ! Consultez le résumé ou recommencez un nouveau match.'
      );
      return messages;
    }

    // ============================================================
    // 2. Plus de pions disponibles dans le rack
    // ============================================================
    if (!hasAvailablePions && isStartCovered) {
      messages.push(
        '📦 Plus de pions disponibles dans le porte-pions. Le match va se terminer.'
      );
    }

    // ============================================================
    // 3. Case de départ non couverte
    // ============================================================
    if (!isStartCovered) {
      messages.push(
        '🎯 Placez un pion sur la case de départ (★) pour commencer'
      );
    }

    // ============================================================
    // 4. Case de départ couverte mais aucun pion posé
    // ============================================================
    if (isStartCovered && placedCount === 0) {
      messages.push(
        '🧩 Sélectionnez un pion dans le porte-pions et placez-le sur le plateau'
      );
    }

    // ============================================================
    // 5. Combinaison trop courte
    // ============================================================
    if (placedCount > 0 && placedCount < 3) {
      messages.push(
        '📐 Une combinaison valide doit contenir au moins 3 pions (nombre-opérateur-nombre)'
      );
    }

    // ============================================================
    // 6. Pas de pion verrouillé utilisé (hors premier jeu)
    // ============================================================
    if (placedCount > 0 && !isFirstGame && !hasLockedPion) {
      messages.push(
        "🔗 Vous devez utiliser au moins un pion verrouillé pour l'enchaînement"
      );
    }

    // ============================================================
    // 7. Combinaison posée mais aucune direction valide
    // ============================================================
    if (hasAvailablePions && isStartCovered && placedCount >= 3) {
      const hasValidDirection =
        directionsValid.left ||
        directionsValid.right ||
        directionsValid.up ||
        directionsValid.down;

      if (!hasValidDirection) {
        messages.push(
          "⚠️ La combinaison actuelle n'est pas valide. Vérifiez l'alternance et la fermeture."
        );
      }
    }

    return messages;
  }, [
    isStartCovered,
    placedPions,
    isFirstGame,
    hasLockedPion,
    hasAvailablePions,
    isMatchOver,
    directionsValid,
  ]);
};