'use client';

import React, { memo, useCallback } from 'react';
import { BoardTheme, UneCase } from '@/lib/interfaces';
import {
  getRackPionAriaLabel,
  getRackPionTitle,
} from './rackStyles';
import { useRackPionStyle } from '../useRackPionStyle';

// ============================================================
// TYPES
// ============================================================

export interface RackPionProps {
  pion: UneCase;
  theme: BoardTheme;
  onClick: (pion: UneCase) => void;
}

// ============================================================
// COMPOSANT DE BASE (exporté pour tests)
// ============================================================

export const RackPionBase: React.FC<RackPionProps> = ({
  pion,
  theme,
  onClick,
}) => {
  const { isSelected, isUsed, style } = useRackPionStyle(pion, theme);

  const handleClick = useCallback(() => {
    if (isUsed) return;
    onClick(pion);
  }, [onClick, pion, isUsed]);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isUsed}
      aria-label={getRackPionAriaLabel(pion, isSelected)}
      aria-pressed={isSelected}
      title={getRackPionTitle(pion)}
      className="
        flex items-center justify-center
        rounded-md border
        font-mono font-black
        transition-all duration-100
        hover:brightness-110
        focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70
        disabled:cursor-not-allowed
      "
      style={style}
    >
      {!isUsed && pion.txt}
    </button>
  );
};

RackPionBase.displayName = 'RackPionBase';

// ============================================================
// COMPARATEUR MEMO
// ============================================================

function arePropsEqual(prev: RackPionProps, next: RackPionProps): boolean {
  const a = prev.pion;
  const b = next.pion;

  return (
    a.placep === b.placep &&
    a.txt === b.txt &&
    a.etat === b.etat &&
    a.tca === b.tca &&
    prev.theme === next.theme &&
    prev.onClick === next.onClick
  );
}

// ============================================================
// EXPORT MEMOÏSÉ
// ============================================================

export const RackPion = memo(RackPionBase, arePropsEqual);
RackPion.displayName = 'RackPion';