'use client';
import { memo } from 'react';
import { useDiambraStore } from '@/lib/store/diambra.store';
import LaMise from "../choix/LaMise";
import FooterSection from "../commons/FooterSection";
import HorlogeMise from '../choix/components/HorlogeMise';
import HorlogeInit from '../home/accueil/HorlogeInit';
import { HelpButton } from "../home/fixedcontent/HelpButton";

const ProfilPageLearning = memo(() => {
  const idEditionencours = useDiambraStore((state) => state.idEditionencours);
  const gameConfig = useDiambraStore((state) => state.gameConfig);

  const configId = gameConfig?._id || gameConfig?.id;
  const shouldShowLaMise = idEditionencours !== configId;

  return (
    <div className="w-full mx-auto max-w-md mb-8 mt-8">
      {shouldShowLaMise && (
        <div className="mt-4">
          <LaMise />
        </div>
      )}

      <footer className="fixed-bottom-content w-full mx-auto max-w-md space-y-4 space-x-2">
        {shouldShowLaMise ? <HorlogeMise /> : <HorlogeInit />}
        <FooterSection />
        <HelpButton />
      </footer>
    </div>
  );
});

export default ProfilPageLearning;