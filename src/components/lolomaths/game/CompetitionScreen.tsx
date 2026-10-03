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
    directionsValid,
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

  const handleCloseDialog = useCallback(() => {
    setSelectedDirectionIndex(null);
  }, [setSelectedDirectionIndex]);

  const isDialogOpen = useMemo(
    () => selectedDirectionIndex !== null && selectedGameResult !== undefined,
    [selectedDirectionIndex, selectedGameResult]
  );

  // Affiche les flèches directionnelles UNIQUEMENT si au moins une direction est valide
  const hasAnyValidDirection = useMemo(
    () =>
      directionsValid.left ||
      directionsValid.right ||
      directionsValid.up ||
      directionsValid.down,
    [directionsValid]
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

        {gameState.isStartCovered && hasAnyValidDirection && (
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