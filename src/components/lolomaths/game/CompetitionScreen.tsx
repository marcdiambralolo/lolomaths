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
      className="w-full mx-auto mt-2 flex flex-col select-none px-0 sm:px-2 sm:max-w-md"
      aria-label="Écran de compétition"
    >
      <section id="zcom" className="flex flex-col w-full">
        {/* Le plateau touchera les bords sur mobile */}
        <OplaGrid />
        <TileRack />

        {isMatchOver && (
          <div className="bg-amber-500 text-slate-950 text-center text-sm font-bold py-2 px-3 rounded-xl shadow-lg mx-2 sm:mx-0 mt-2">
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
        
        <HorlogeMise />
        <HelpToggle checked={showHelp} onChange={setShowHelp} />
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