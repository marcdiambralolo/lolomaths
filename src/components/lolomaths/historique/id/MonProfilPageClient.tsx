'use client';

import Loader from '@/app/loading';
import ErrorMessage from '@/components/lolomaths/commons/ErrorMessage';
import { useHistoriqueConsultations } from '@/hooks/lolomaths/historique/useHistoriqueConsultations';
import { memo } from 'react';
import EditionCard from '../components/EditionCard';
import ParticipationsSection from '../components/ParticipationsSection';
import TitleSection from '../components/TitleSection';
import WinnersSection from '../components/WinnersSection';
import { BackButton } from './components/BackButton';
import { ConsultationList } from './components/ConsultationList';
import EditionHeader from './components/EditionHeader';
import { StatisticsSection } from './components/StatisticsSection';
import EmptyState from './components/EmptyState';

const HistoriquePageClient = memo(() => {
  const {
    loading,
    error,
    handleGoBack,
    activeEdition,
    consultations,
    duplicateMap,
    hasConsultations,
    rankedConsultations,
    edition,
    formattedStartDate,
    formattedEndDate,
    advancedStats,
  } = useHistoriqueConsultations();

  if (loading) return <Loader />;
  if (error) return <ErrorMessage />;

  return (
    <div className="max-w-4xl mx-auto px-3 py-4 sm:px-4 sm:py-8 space-y-8">
      {/* 1. Header */}
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-200">
          Historique des tournois
        </h1>
        <BackButton onClick={handleGoBack} />
      </header>

      {/* 2. Édition active */}
      {activeEdition && (
        <section className="relative rounded-2xl p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-2 border-emerald-200 dark:border-emerald-800 space-y-4">
          <div className="absolute -top-3 left-6 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
            EN COURS
          </div>
          <EditionCard activeEdition={activeEdition} />
          <TitleSection />
          {/* <WinnersSection consultations={consultations} /> */}
          <ParticipationsSection
            consultations={consultations}
            activeEditionId={activeEdition.id}
          />
        </section>
      )}

      {/* 3. Éditions passées */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
          Éditions passées
        </h2>

        {edition && (
          <EditionHeader
            startDate={formattedStartDate}
            endDate={formattedEndDate}
            participantsCount={advancedStats?.completedPlayers}
          />
        )}

        {hasConsultations ? (
          <ConsultationList
            hasConsultations={hasConsultations}
            rankedConsultations={rankedConsultations}
            duplicateMap={duplicateMap}
          />
        ) : (
          <EmptyState
            title="📚 Aucune édition passée"
            subtitle="Les éditions terminées apparaîtront ici."
          />
        )}
      </section>

      {/* 4. Statistiques globales */}
      {advancedStats && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            Statistiques globales
          </h2>
          <StatisticsSection advancedStats={advancedStats} />
        </section>
      )}
    </div>
  );
});

HistoriquePageClient.displayName = 'HistoriquePageClient';

export default HistoriquePageClient;