"use client";

import React from "react";
import { useCompetitionGame } from "@/hooks/lolomaths/game/useCompetitionGame";
import HorlogeMise from "../choix/components/HorlogeMise";
import FooterSection from "../commons/FooterSection";
import { Fdialog } from "./Fdialog";
import { OplaGrid } from "./OplaGrid";
import { DirectionActions } from "./components/DirectionActions";
import { GameHeaderControls } from "./components/GameHeaderControls";
import { GameHistoryList } from "./components/GameHistoryList";
import { GameScoreBoard } from "./components/GameScoreBoard";
import { HelpMessagesView } from "./components/HelpMessagesView";
import HelpToggle from "./components/HelpToggle";
import { TileRack } from "./portepions/TileRack";

export const CompetitionScreen: React.FC = React.memo(() => {
  const {
    helpMessages,
    showHelp,
    gameState,
    hasPlacedPions,
    selectedGameResult,
    hasAnyValidDirection,
    isDialogOpen,
    isMatchOver,
    handleCloseDialog,
    handleResetRound,
    setShowHelp,
    handleAcceptCalculation,
    setSelectedDirectionIndex,
  } = useCompetitionGame();

  return (
    <main
      className="w-full max-w-md mx-auto mt-2 flex flex-col select-none px-2"
      aria-label="Écran de compétition"
    >
      <section id="zcom" className="flex flex-col gap-3">
        <OplaGrid />
        <TileRack />

        {/* ✅ Message quand le match est terminé */}
        {isMatchOver && (
          <div className="bg-amber-500 text-slate-950 text-center text-sm font-bold py-2 px-3 rounded-xl shadow-lg">
            🏁 Match terminé — redirection en cours…
          </div>
        )}

        {!isMatchOver && gameState.isStartCovered && hasAnyValidDirection && (
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

CompetitionScreen.displayName = "CompetitionScreen";