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

const MATCH_OVER_BANNER =
  "bg-amber-500 text-slate-950 text-center text-sm font-bold py-2 px-3 rounded-xl shadow-lg mx-2 sm:mx-0 mt-2";

export const CompetitionScreen: React.FC = () => {
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

  // Conditions dérivées (lisibilité)
  const showMatchOverBanner = isMatchOver;
  const showDirectionActions =
    !isMatchOver && gameState.isStartCovered && hasAnyValidDirection;

  return (
    <main
      className="w-full mx-auto mt-2 flex flex-col select-none sm:max-w-md"
      aria-label="Écran de compétition"
    >
      <section id="competition" className="flex flex-col w-full">
        <OplaGrid />
        <TileRack />

        {showMatchOverBanner && (
          <div className={MATCH_OVER_BANNER}>
            🏁 Match terminé — redirection en cours…
          </div>
        )}

        {showDirectionActions && (
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
        gameResult={selectedGameResult}
        onAccept={handleAcceptCalculation}
        onCancel={handleCloseDialog}
      />
    </main>
  );
};

CompetitionScreen.displayName = "CompetitionScreen";