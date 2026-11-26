'use client';

import React, { memo, useCallback, useMemo } from 'react';
import { BoardTheme, UneCase } from '@/lib/interfaces';
import {
  formatOperatorDisplay,
  getRackPionAriaLabel,
  getRackPionTitle,
} from './rackStyles';
import { useRackPionStyle } from './useRackPionStyle';

export interface RackPionProps {
  pion: UneCase;
  theme: BoardTheme;
  onClick: (pion: UneCase) => void;
}

const BASE_3D_SHADOW = [
  '0 1px 0 rgba(15, 23, 42, 0.95)',
  '0 2px 0 rgba(15, 23, 42, 0.95)',
  '0 3px 0 rgba(15, 23, 42, 0.95)',
  '0 4px 0 rgba(15, 23, 42, 0.95)',
  '0 5px 0 rgba(15, 23, 42, 0.95)',
  '0 8px 12px rgba(0, 0, 0, 0.5)',
  'inset 0 1.5px 1px rgba(255, 255, 255, 0.45)',
  'inset 0 -2px 3px rgba(0, 0, 0, 0.35)',
].join(', ');

const SELECTED_3D_SHADOW = [
  '0 0 0 2px rgba(255, 255, 255, 0.9)',
  '0 1px 0 rgba(15, 23, 42, 0.95)',
  '0 2px 0 rgba(15, 23, 42, 0.95)',
  '0 3px 0 rgba(15, 23, 42, 0.95)',
  '0 4px 0 rgba(15, 23, 42, 0.95)',
  '0 5px 0 rgba(15, 23, 42, 0.95)',
  '0 6px 0 rgba(15, 23, 42, 0.95)',
  '0 10px 14px rgba(0, 0, 0, 0.55)',
  'inset 0 1.5px 1px rgba(255, 255, 255, 0.55)',
  'inset 0 -2px 3px rgba(0, 0, 0, 0.35)',
].join(', ');

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

  const pion3DStyle = useMemo<React.CSSProperties>(() => {
    if (isUsed) {
      return {
        ...style,
        opacity: 0,
        pointerEvents: 'none',
      };
    }

    if (isSelected) {
      return {
        ...style,
        backgroundImage:
          'linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.04) 55%, rgba(0,0,0,0.22) 100%)',
        transform: 'perspective(300px) rotateX(10deg) translateY(-2px)',
        boxShadow: SELECTED_3D_SHADOW,
      };
    }

    return {
      ...style,
      backgroundImage:
        'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.02) 55%, rgba(0,0,0,0.25) 100%)',
      transform: 'perspective(300px) rotateX(10deg)',
      boxShadow: BASE_3D_SHADOW,
    };
  }, [style, isSelected, isUsed]);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isUsed}
      aria-label={getRackPionAriaLabel(pion, isSelected)}
      aria-pressed={isSelected}
      aria-hidden={isUsed}
      title={getRackPionTitle(pion)}
      className={`
        relative flex items-center justify-center
        rounded-xl border border-white/20
        font-mono font-black select-none
        transition-all duration-100 ease-out
        ${
          isUsed
            ? 'cursor-not-allowed'
            : 'hover:brightness-110 active:!translate-y-[4px] active:!shadow-[0_1px_0_rgba(15,23,42,0.95),0_2px_4px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.3)] cursor-pointer'
        }
        focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80
      `}
      style={pion3DStyle}
    >
      {!isUsed && (
        <span
          className="pointer-events-none leading-none"
          style={{
            textShadow:
              '0 1px 0 rgba(255, 255, 255, 0.25), 0 -1px 1px rgba(0, 0, 0, 0.55)',
          }}
        >
          {formatOperatorDisplay(pion.txt)}
        </span>
      )}
    </button>
  );
};

RackPionBase.displayName = 'RackPionBase';

function arePropsEqual(prev: RackPionProps, next: RackPionProps): boolean {
  const a = prev.pion;
  const b = next.pion;

  return (
    a.placep === b.placep &&
    a.txt === b.txt &&
    a.itxt === b.itxt &&
    a.etat === b.etat &&
    a.tca === b.tca &&
    prev.theme === next.theme &&
    prev.onClick === next.onClick
  );
}

export const RackPion = memo(RackPionBase, arePropsEqual);
RackPion.displayName = 'RackPion';