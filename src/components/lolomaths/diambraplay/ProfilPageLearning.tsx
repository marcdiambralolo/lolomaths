'use client';
import { memo } from 'react';
import FooterSection from "../commons/FooterSection";
import Horloge from "../home/dashboard/Horloge";
import FeuillesdeMatch from "../home/matchsheet/FeuillesdeMatch";

const ProfilPageLearning = memo(() => {

  return (
    <div className="w-full mx-auto max-w-md mb-8 mt-8">
    
      <footer className="fixed-bottom-content w-full mx-auto max-w-md space-y-4 space-x-2">
        <Horloge />
        <FeuillesdeMatch />
        <FooterSection />
      </footer>
    </div>
  );
});

export default ProfilPageLearning;