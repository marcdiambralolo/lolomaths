"use client";

import React, { useCallback, useMemo } from "react";
import { useCompetitionGame } from "@/hooks/lolomaths/game/useCompetitionGame";
import { Fdialog } from "./Fdialog";
import { OplaGrid } from "./OplaGrid";
import { TileRack } from "./TileRack";
import { DirectionActions } from "./components/DirectionActions";
import { GameHeaderControls } from "./components/GameHeaderControls";
import { GameHistoryList } from "./components/GameHistoryList";
import { GameScoreBoard } from "./components/GameScoreBoard";
import { HelpMessagesView } from "./components/HelpMessagesView";
import HelpToggle from "./components/HelpToggle";
import { MatchSummaryScreen } from "./components/MatchSummaryScreen";

export const CompetitionScreen: React.FC = React.memo(() => {
  const {
    chrono,
    showResultZone,
    selectedDirectionIndex,
    helpMessages,
    showHelp,
    gameState,
    hasPlacedPions,
    selectedGameResult,
    handleResetRound,
    setShowHelp,
    handleAcceptCalculation,
    setSelectedDirectionIndex,
    handleRestartMatch,
    handleShowDetails,
  } = useCompetitionGame();

  // Fermeture optimisée de la boîte de dialogue
  const handleCloseDialog = useCallback(() => {
    setSelectedDirectionIndex(null);
  }, [setSelectedDirectionIndex]);

  // Calcul mémorisé de l'état d'ouverture du dialogue
  const isDialogOpen = useMemo(
    () => selectedDirectionIndex !== null && selectedGameResult !== undefined,
    [selectedDirectionIndex, selectedGameResult]
  );

  if (showResultZone) {
    return (
      <MatchSummaryScreen
        isTimeUp={chrono.isFinished}
        onRestart={handleRestartMatch}
        onShowDetails={handleShowDetails}
      />
    );
  }

  return (
    <main
      className="w-full max-w-md mx-auto mt-2 flex flex-col select-none"
      aria-label="Écran de compétition"
    >
      <section id="zcom" className="flex flex-col gap-3">
        <OplaGrid />
        <TileRack />

        {gameState.isStartCovered && (
          <DirectionActions onSelectDirection={setSelectedDirectionIndex} />
        )}

        <GameHeaderControls
          formattedTime={chrono.formattedTime}
          hasPlacedPions={hasPlacedPions}
          onResetRound={handleResetRound}
        />

        {showHelp && <HelpMessagesView messages={helpMessages} />}
        <GameScoreBoard />
        <GameHistoryList />
        <HelpToggle checked={showHelp} onChange={setShowHelp} />
      </section>

      {/* Boîte de dialogue de confirmation du coup */}
      <Fdialog
        isOpen={isDialogOpen}
        gameResult={selectedGameResult ?? null}
        onAccept={handleAcceptCalculation}
        onCancel={handleCloseDialog}
      />
    </main>
  );
});

CompetitionScreen.displayName = "CompetitionScreen";