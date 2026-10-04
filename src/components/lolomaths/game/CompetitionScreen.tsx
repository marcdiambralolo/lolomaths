"use client";
import { useCompetitionGame } from "@/hooks/lolomaths/game/useCompetitionGame";
import React from "react";
import HorlogeMise from "../choix/components/HorlogeMise";
import FooterSection from "../commons/FooterSection";
import { Fdialog } from "./Fdialog";
import { OplaGrid } from "./OplaGrid";
import { TileRack } from "./TileRack";
import { DirectionActions } from "./components/DirectionActions";
import { GameHeaderControls } from "./components/GameHeaderControls";
import { GameHistoryList } from "./components/GameHistoryList";
import { GameScoreBoard } from "./components/GameScoreBoard";
import { HelpMessagesView } from "./components/HelpMessagesView";
import HelpToggle from "./components/HelpToggle";

export const CompetitionScreen: React.FC = React.memo(() => {
  const {
    helpMessages,
    showHelp,
    gameState,
    hasPlacedPions,
    selectedGameResult,
    hasAnyValidDirection,
    isDialogOpen,
    handleCloseDialog,
    handleResetRound,
    setShowHelp,
    handleAcceptCalculation,
    setSelectedDirectionIndex,
  } = useCompetitionGame();

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
          hasPlacedPions={hasPlacedPions}
          onResetRound={handleResetRound}
        />

        {showHelp && <HelpMessagesView messages={helpMessages} />}
        <GameScoreBoard />
        <GameHistoryList />
        <HelpToggle checked={showHelp} onChange={setShowHelp} />
        <HorlogeMise />
        <FooterSection />
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