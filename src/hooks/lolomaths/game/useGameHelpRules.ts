'use client';

import { useMemo } from 'react';
import { UneCase } from '@/lib/interfaces';

interface HelpContext {
  isStartCovered: boolean;
  placedPions: UneCase[];
  isFirstGame: boolean;
  hasLockedPion: boolean;
  hasAvailablePions: boolean;
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
  directionsValid,
}: HelpContext): string[] => {
  return useMemo(() => {
    const messages: string[] = [];
    const placedCount = placedPions.length;

    if (!isStartCovered) {
      messages.push(
        '🎯 Placez un pion sur la case de départ (★) pour commencer'
      );
    }

    if (isStartCovered && placedCount === 0) {
      messages.push(
        '🧩 Sélectionnez un pion dans le porte-pions et placez-le sur le plateau'
      );
    }

    if (placedCount > 0 && placedCount < 3) {
      messages.push(
        '📐 Une combinaison valide doit contenir au moins 3 pions (nombre-opérateur-nombre)'
      );
    }

    if (placedCount > 0 && !isFirstGame && !hasLockedPion) {
      messages.push(
        "🔗 Vous devez utiliser au moins un pion verrouillé pour l'enchaînement"
      );
    }

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
    directionsValid,
  ]);
};