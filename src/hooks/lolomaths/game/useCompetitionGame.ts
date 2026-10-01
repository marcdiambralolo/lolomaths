import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useChrono } from "@/hooks/lolomaths/useChrono";
import { useCompetitionStore } from "@/lib/store/useCompetitionStore";
import { isStartCaseCovered, getPlacedPions, hasLockedPionInSequence, } from "@/components/lolomaths/game/competitionEngine";
import { StateCase } from "@/lib/interfaces";
import { loadGameConfig } from "@/services/configService";
import { useGameHelpRules } from "./useGameHelpRules";

export interface GameHistoryItem {
  score: number;
  combination: string;
}

const MATCH_DURATION = 300;

export const useCompetitionGame = () => {
  const store = useCompetitionStore();
  const [showResultZone, setShowResultZone] = useState(false);
  const [selectedDirectionIndex, setSelectedDirectionIndex] = useState<number | null>(null);
  const [showHelp, setShowHelp] = useState(true);

  const chrono = useChrono({
    initialSeconds: MATCH_DURATION,
    autoStart: false,
    onTimeUp: () => {
      setShowResultZone(true);
    },
  });

  const hasInitializedMatch = useRef(false);

  useEffect(() => {
    if (hasInitializedMatch.current) {
      return;
    }

    hasInitializedMatch.current = true;

    const config = loadGameConfig();

    store.initGame(
      config.numbers,
      config.operators,
      config.niveau
    );

    chrono.reset(MATCH_DURATION);
    chrono.start();

    return () => {
      chrono.pause();
    };
  }, []);

  const processedGamesRef = useRef(0);




  const gameState = useMemo(() => {
    const isStartCovered = isStartCaseCovered(store.flatGrid);

    const placedPions = getPlacedPions(store.flatGrid);

    const hasAvailablePions = store.flatGrid.some(
      (cell) =>
        cell.etat === StateCase.Pla ||
        cell.etat === StateCase.Choi
    );

    return {
      isStartCovered,
      placedPions,
      hasLockedPion: hasLockedPionInSequence(placedPions),
      isFirstGame: store.cnbjeu === 0,
      hasAvailablePions,
    };
  }, [store.flatGrid, store.cnbjeu]);

  /**
   * Reset de la manche.
   */
  const handleResetRound = useCallback(() => {
    store.resetPions();
    setSelectedDirectionIndex(null);
  }, [store.resetPions]);

  /**
   * Validation d'un calcul.
   */
  const handleAcceptCalculation = useCallback(() => {
    if (selectedDirectionIndex === null) {
      return;
    }

    store.confirmCalculation(selectedDirectionIndex);
    setSelectedDirectionIndex(null);
  }, [
    selectedDirectionIndex,
    store.confirmCalculation,
  ]);

  const handleRestartMatch = useCallback(() => {
    setShowResultZone(false);

    setSelectedDirectionIndex(null);

    processedGamesRef.current = 0;

    const config = loadGameConfig();

    store.initGame(
      config.numbers,
      config.operators,
      config.niveau
    );

    chrono.reset(MATCH_DURATION);
    chrono.start();
  }, [
    store.initGame,
    chrono.reset,
    chrono.start,
  ]);

  /**
   * Affichage des statistiques du match.
   */
  const handleShowDetails = useCallback(() => {
    const average =
      store.cnbjeu > 0
        ? (store.scoreTotal / store.cnbjeu).toFixed(1)
        : "0";

    alert(
      `Détails du match:\n` +
      `Score: ${store.scoreTotal} pts\n` +
      `Jeux: ${store.cnbjeu}\n` +
      `Moyenne: ${average} pts`
    );
  }, [
    store.scoreTotal,
    store.cnbjeu,
  ]);


  const helpMessages = useGameHelpRules({
    ...gameState,
    directionsValid: store.directionsValid,
    hasUsedMultiplicationOrDivision:
      store.hasUsedMultiplicationOrDivision,
  });

  /**
   * Évite de recalculer cette valeur à chaque rendu.
   */
  const hasPlacedPions = useMemo(
    () => gameState.placedPions.length > 0,
    [gameState.placedPions.length]
  );

  /**
   * Résultat actuellement sélectionné.
   */
  const selectedGameResult = useMemo(
    () =>
      selectedDirectionIndex !== null
        ? store.gameResults[selectedDirectionIndex]
        : null,
    [selectedDirectionIndex, store.gameResults]
  );

  return {
    chrono, showResultZone, selectedDirectionIndex, gameState, showHelp,
    helpMessages, hasPlacedPions, selectedGameResult,
    setSelectedDirectionIndex, setShowHelp,
    handleResetRound, handleAcceptCalculation, handleRestartMatch,
    handleShowDetails,
  };
};