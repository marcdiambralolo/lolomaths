'use client';

import { useMemo } from 'react';
import { UneCase } from '@/lib/interfaces';

interface DirectionsValid {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
}

interface HelpContext {
  isStartCovered: boolean;
  placedPions: UneCase[];
  isFirstGame: boolean;
  hasLockedPion: boolean;
  hasAvailablePions: boolean;
  isMatchOver: boolean;
  directionsValid: DirectionsValid;
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
  const placedCount = placedPions.length;

  return useMemo(() => {
    const messages: string[] = [];

    // 1. Match terminé → message unique prioritaire
    if (isMatchOver) {
      return [
        '🏁 Match terminé ! Consultez le résumé ou recommencez un nouveau match.',
      ];
    }

    // 2. Plus aucun pion disponible et aucun pion posé
    if (!hasAvailablePions && placedCount === 0) {
      return ['📦 Plus de pions disponibles dans le porte-pions.'];
    }

    // 3. Premier coup : couverture de la case de départ requise
    if (isFirstGame && !isStartCovered) {
      messages.push(
        '🎯 Placez un pion sur la case de départ (★) pour commencer.'
      );
    }

    // 4. Aucun pion posé sur le plateau
    if (placedCount === 0 && (!isFirstGame || isStartCovered)) {
      messages.push(
        '🧩 Sélectionnez un pion dans le porte-pions et placez-le sur le plateau.'
      );
    }

    // 5. Combinaison trop courte (< 3 pions)
    if (placedCount > 0 && placedCount < 3) {
      messages.push(
        '📐 Une combinaison valide doit contenir au moins 3 pions (nombre - opérateur - nombre).'
      );
    }

    // 6. Enchaînement requis à partir du 2e coup
    if (placedCount > 0 && !isFirstGame && !hasLockedPion) {
      messages.push(
        "🔗 Vous devez relier votre combinaison à au moins un pion verrouillé."
      );
    }

    // 7. Combinaison >= 3 pions sans aucune direction valide
    if (placedCount >= 3) {
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
    isMatchOver,
    hasAvailablePions,
    placedCount,
    isFirstGame,
    isStartCovered,
    hasLockedPion,
    directionsValid.left,
    directionsValid.right,
    directionsValid.up,
    directionsValid.down,
  ]);
};