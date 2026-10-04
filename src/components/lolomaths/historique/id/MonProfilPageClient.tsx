"use client";
import Loader from "@/app/loading";
import { useAdminConsultationsPageFinished } from "@/hooks/lolomaths/historique/useAdminConsultationsPageFinished";
import { useHistoriqueConsultations } from "@/hooks/lolomaths/historique/useHistoriqueConsultations";
import { memo } from "react";
 import EditionCard from "../components/EditionCard";
import ParticipationsSection from "../components/ParticipationsSection";
import TitleSection from "../components/TitleSection";
import WinnersSection from "../components/WinnersSection";
import { BackButton } from "./components/BackButton";
import { ConsultationList } from "./components/ConsultationList";
import EditionHeader from "./components/EditionHeader";
import { StatisticsSection } from "./components/StatisticsSection";
import ErrorMessage from "@/components/lolomaths/commons/ErrorMessage";

const HistoriquePageClient = memo(() => {
  const {
    handleGoBack, loading: historiqueLoading, error, duplicateMap, hasConsultations,
    formattedEndDate, formattedStartDate, edition, advancedStats, rankedConsultations,
  } = useHistoriqueConsultations();

  const {
    activeEdition, consultations, loading: adminLoading,
  } = useAdminConsultationsPageFinished();

  const isLoading = historiqueLoading || adminLoading;

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage />;

  return (
    <div className="max-w-4xl mx-auto px-3 py-4 sm:px-4 sm:py-8">
       
      {activeEdition && (
        <div className="w-full mx-auto max-w-xl px-4">
          <EditionCard activeEdition={activeEdition} />
          <TitleSection />
          <WinnersSection consultations={consultations} />
          <ParticipationsSection
            consultations={consultations}
            activeEditionId={activeEdition?.id}
          />
        </div>
      )}

      {edition && (
        <EditionHeader
          startDate={formattedStartDate}
          endDate={formattedEndDate}
          participantsCount={advancedStats?.completedPlayers}
        />
      )}

      <ConsultationList
        hasConsultations={hasConsultations}
        rankedConsultations={rankedConsultations}
        duplicateMap={duplicateMap}
      />

      <StatisticsSection advancedStats={advancedStats} />
      <BackButton onClick={handleGoBack} />
    </div>
  );
});

export default HistoriquePageClient;