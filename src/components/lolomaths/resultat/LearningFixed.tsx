'use client';
import { memo } from 'react';
import { FooterSection } from "../commons/Features";
import { MatchSummaryScreen } from '../game/components/MatchSummaryScreen';
import FeuilleDeMatch from "./FeuilleDeMatch";
import { StatsSection } from "./StatsSection";

const LearningFixed = memo(() => { 

  return (
    <footer className="fixed-bottom-content w-full mx-auto max-w-md space-y-4 space-x-2">
      <MatchSummaryScreen />

      <FeuilleDeMatch />
      <StatsSection />
      <FooterSection />

    </footer>
  );
});

export default LearningFixed;