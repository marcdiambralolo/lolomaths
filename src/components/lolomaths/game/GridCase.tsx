import React from 'react';
 
import { StateCase, UneCase } from '@/lib/interfaces';
import { START_CASE_INDEX } from './competitionEngine';
import { getCaseStyle } from '@/lib/utils/theme';

interface GridCaseProps {
  caseData: UneCase;
  onClick: (c: UneCase) => void;
}

export const GridCase: React.FC<GridCaseProps> = ({ caseData, onClick }) => {
  const isStart = caseData.ncase === START_CASE_INDEX;
  const style = getCaseStyle({
    etat: caseData.etat,
    isStartCase: isStart,
    tca: caseData.tca
  });

  return (
    <button
      onClick={() => onClick(caseData)}
      className={`
        w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11
        flex items-center justify-center
        border rounded-md text-xs sm:text-sm md:text-base transition-all duration-150 select-none
        ${style}
      `}
      title={`Case (${caseData.indi}, ${caseData.indj})`}
    >
      {caseData.txt || (isStart && caseData.etat === StateCase.Cre ? '★' : '')}
    </button>
  );
};