'use client';
import { useHelp } from '@/hooks/learning/help/useHelp';
import { memo } from 'react';
import { FooterSection } from "../commons/FooterSection";
import HelpPanel from "./components/HelpPanel";

const HelpPage = () => {
  const { handleCloseHelp } = useHelp();

  return (
    <div className="container mx-auto max-w-md mt-8">
      <HelpPanel onClose={handleCloseHelp} />
      <div className="mt-4">
        <FooterSection />
      </div>
    </div>
  );
};

export default memo(HelpPage);