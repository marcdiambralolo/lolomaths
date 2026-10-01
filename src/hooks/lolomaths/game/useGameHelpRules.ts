import { useMemo } from 'react';
import { StateCase } from '@/lib/interfaces';

interface HelpContext {
  isStartCovered: boolean;
  placedPions: any[];
  isFirstGame: boolean;
  hasLockedPion: boolean;
  hasAvailablePions: boolean;
  directionsValid: { left: boolean; right: boolean; up: boolean; down: boolean };
  hasUsedMultiplicationOrDivision: boolean;
}

export const useGameHelpRules = (ctx: HelpContext): string[] => {
  return useMemo(() => {
    const messages: string[] = [];

    if (!ctx.isStartCovered) {
      messages.push('🎯 Placez un pion sur la case de départ (★) pour commencer');
    }
    if (ctx.isStartCovered && ctx.placedPions.length === 0) {
      messages.push('🧩 Sélectionnez un pion dans le porte-pions et placez-le sur le plateau');
    }
    if (ctx.placedPions.length > 0 && ctx.placedPions.length < 3) {
      messages.push('📐 Une combinaison valide doit contenir au moins 3 pions (nombre-opérateur-nombre)');
    }
    if (ctx.placedPions.length > 0 && !ctx.isFirstGame && !ctx.hasLockedPion) {
      messages.push('🔗 Vous devez utiliser au moins un pion verrouillé  pour l\'enchaînement');
    }
    if (ctx.hasAvailablePions && ctx.isStartCovered && ctx.placedPions.length >= 3) {
      const hasValidDirection = Object.values(ctx.directionsValid).some(Boolean);
      if (!hasValidDirection) {
        messages.push('⚠️ La combinaison actuelle n\'est pas valide. Vérifiez l\'alternance et la fermeture.');
      }
    }
    if (ctx.hasUsedMultiplicationOrDivision) {
      messages.push('✅ Bonus "× ou ÷" déjà utilisé pour ce match');
    }

    return messages;
  }, [ctx]);
};