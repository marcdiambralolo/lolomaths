"use client";

import React, { memo, useCallback } from "react";
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

export const CompetitionScreen: React.FC = memo(() => {
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

  const handleToggleHelp = useCallback(
    (checked: boolean) => {
      setShowHelp(checked);
    },
    [setShowHelp]
  );

  const matchEnded = Boolean(isMatchOver);
  const safeMessages = Array.isArray(helpMessages) ? helpMessages : [];
  const showMatchOverBanner = matchEnded;
  const showDirectionActions =
    !matchEnded &&
    Boolean(gameState?.isStartCovered) &&
    Boolean(hasAnyValidDirection);
  const showHelpPanel = Boolean(showHelp) && safeMessages.length > 0;
  const canOpenDialog = Boolean(isDialogOpen) && !matchEnded;

  return (
    <main
      className="w-full mx-auto mt-2 flex flex-col select-none sm:max-w-md"
      aria-label="Écran de compétition"
    >
      <section id="competition" className="flex flex-col w-full">
        <OplaGrid />
        <TileRack />

        {showMatchOverBanner && (
          <div role="status" aria-live="polite" className={MATCH_OVER_BANNER}>
            🏁 Match terminé — redirection en cours…
          </div>
        )}

        {showDirectionActions && (
          <DirectionActions onSelectDirection={setSelectedDirectionIndex} />
        )}

        {!matchEnded && (
          <GameHeaderControls
            hasPlacedPions={Boolean(hasPlacedPions)}
            onResetRound={handleResetRound}
          />
        )}

        {showHelpPanel && <HelpMessagesView messages={safeMessages} />}
        <GameScoreBoard />
        <GameHistoryList />

        <HorlogeMise />
        <HelpToggle checked={Boolean(showHelp)} onChange={handleToggleHelp} />
        <FooterSection />
      </section>

      <Fdialog
        isOpen={canOpenDialog}
        gameResult={selectedGameResult}
        onAccept={handleAcceptCalculation}
        onCancel={handleCloseDialog}
      />
    </main>
  );
});

CompetitionScreen.displayName = "CompetitionScreen";