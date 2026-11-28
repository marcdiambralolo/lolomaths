'use client';

import { memo } from 'react';
import FooterSection from '../commons/FooterSection';
import { MatchSummaryScreen } from '../game/components/MatchSummaryScreen';
import FeuilleDeMatch from './FeuilleDeMatch';
import { StatsSection } from './StatsSection';
import { ResultHero } from './ResultHero';
import { ResultActions } from './ResultActions';

const ResultatPage = memo(() => {
  return (
    <main
      aria-label="Résultats du match"
      className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-indigo-950"
    >
      <div className="w-full max-w-md mx-auto px-3 py-4 space-y-4">
        <ResultHero />

        <nav aria-label="Actions rapides">
          <ResultActions />
        </nav>

        <FeuilleDeMatch />
        <MatchSummaryScreen />
        <StatsSection />

        <nav aria-label="Actions de fin de page">
          <ResultActions />
        </nav>

        <FooterSection />
      </div>
    </main>
  );
});

ResultatPage.displayName = 'ResultatPage';

export default ResultatPage;