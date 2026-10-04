'use client';

 
import { memo } from 'react';
import FooterSection from '../commons/FooterSection';
import { MatchSummaryScreen } from '../game/components/MatchSummaryScreen';
import FeuilleDeMatch from './FeuilleDeMatch';
import { StatsSection } from './StatsSection';

const ResultatPage = memo(() => {
  return (
    <main className="w-full mx-auto max-w-md space-y-4 px-4 py-4">
      <MatchSummaryScreen />
      <FeuilleDeMatch />
      <StatsSection />
      <FooterSection />
    </main>
  );
});

ResultatPage.displayName = 'ResultatPage';

export default ResultatPage;