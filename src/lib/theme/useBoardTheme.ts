'use client';

import { useMemo } from 'react';
import { BoardTheme } from '@/lib/interfaces';
import { getThemeById } from './themesLoader';

const DEFAULT_THEME_ID = 0;

/**
 * Hook qui retourne le thème actif du plateau.
 *
 * Priorité :
 * 1. localStorage.lolomaths_config.themeId
 * 2. Thème par défaut (`becouefin`, numero: 0)
 *
 * NOTE : on n'utilise pas ` ` car `LearningConfiguration`
 * ne contient pas `themeId`. À ajouter plus tard si besoin.
 */
export function useBoardTheme(): BoardTheme {
  return useMemo(() => {
    let themeId: number | undefined;

    try {
      const saved = localStorage.getItem('lolomaths_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        themeId = parsed.themeId;
      }
    } catch {
      // ignore
    }

    return getThemeById(themeId ?? DEFAULT_THEME_ID);
  }, []);
}