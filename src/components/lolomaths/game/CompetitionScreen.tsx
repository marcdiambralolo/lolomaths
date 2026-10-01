"use client";
import { useCompetitionGame } from "@/hooks/lolomaths/game/useCompetitionGame";
import React from "react";
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

export const CompetitionScreen: React.FC = () => {
  const {
    chrono, showResultZone, selectedDirectionIndex, helpMessages,
    showHelp, gameState, hasPlacedPions, selectedGameResult,
    handleResetRound, setShowHelp, handleAcceptCalculation, setSelectedDirectionIndex,
    handleRestartMatch, handleShowDetails,
  } = useCompetitionGame();

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

        {showHelp && (
          <HelpMessagesView messages={helpMessages} />
        )}

        <GameScoreBoard />
        <GameHistoryList />

        <HelpToggle
          checked={showHelp}
          onChange={setShowHelp}
        />
      </section>

      <Fdialog
        isOpen={selectedDirectionIndex !== null}
        gameResult={selectedGameResult}
        onAccept={handleAcceptCalculation}
        onCancel={() => setSelectedDirectionIndex(null)}
      />
    </main>
  );
};  