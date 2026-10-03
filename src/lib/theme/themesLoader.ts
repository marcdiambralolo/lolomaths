import themesData from '@/data/themes.json';
import { BoardTheme, parseTheme } from '@/lib/interfaces';

let cachedThemes: BoardTheme[] | null = null;

/**
 * Charge tous les thèmes depuis `themes.json`.
 * Transposition de `ltheme.add(Theme(it.getJSONObject(item)))` Kotlin.
 */
export function loadAllThemes(): BoardTheme[] {
  if (cachedThemes) return cachedThemes;
  cachedThemes = (themesData as Record<string, unknown>[]).map((raw) =>
    parseTheme(raw)
  );
  return cachedThemes;
}

/**
 * Retourne le thème correspondant à `id`, ou le thème 0 par défaut.
 * Transposition de `th = ltheme.first { it.numero == gint("couleurs") }` Kotlin.
 */
export function getThemeById(id: number | undefined | null): BoardTheme {
  const themes = loadAllThemes();
  if (!themes.length) return parseTheme({});
  const found = themes.find((t) => t.id === id);
  return found ?? themes[0];
}