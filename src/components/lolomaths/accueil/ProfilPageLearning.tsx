'use client';
import { memo } from 'react';
import HorlogeInit from '../home/accueil/HorlogeInit';
import PageContainer from './components/PageContainer';
import ResultsSection from './components/ResultsSection';

const ProfilPageLearning = memo(() => {
  return (
    <PageContainer>
      <HorlogeInit />
      <ResultsSection />      
    </PageContainer>
  );
});

export default ProfilPageLearning;