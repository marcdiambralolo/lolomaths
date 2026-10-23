'use client';

import { useAuthStore } from '@/lib/store/auth.store';
import { useCompetitionStore } from '@/lib/store/useCompetitionStore';
import { clearPersistedQueryCache, queryClient } from './queryClient';
import { clearIndexedDbCache } from './indexedDB';

/**
 * Clés localStorage à NE PAS supprimer (thème, préférences UI non sensibles).
 */
const PRESERVED_LOCAL_STORAGE_KEYS = new Set<string>([
  'diambra-theme',
  'monetoile-theme',
]);

/**
 * Préfixes de clés à supprimer du storage (app + legacy).
 */
const APP_STORAGE_PREFIXES = ['diambra', 'monetoile'];

function isPreservedKey(key: string): boolean {
  return PRESERVED_LOCAL_STORAGE_KEYS.has(key);
}

function shouldRemoveKey(key: string): boolean {
  if (isPreservedKey(key)) return false;
  return APP_STORAGE_PREFIXES.some((prefix) => key.startsWith(prefix));
}

function clearAppStorage(storage: Storage | undefined): void {
  if (!storage) return;

  const keysToRemove: string[] = [];
  // ⚠️ On collecte d'abord pour ne pas muter pendant l'itération
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (key && shouldRemoveKey(key)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => {
    try {
      storage.removeItem(key);
    } catch {
      // noop (quota, sécurité…)
    }
  });
}

/**
 * Tente de supprimer les cookies d'auth côté client.
 * ⚠️ Ne fonctionne QUE si le cookie n'est pas `httpOnly`.
 * C'est un fallback : le serveur DOIT les supprimer via Set-Cookie.
 */
function clearAuthCookiesFallback(): void {
  if (typeof document === 'undefined') return;

  const cookiesToClear = ['monetoile_access_token', 'monetoile_refresh_token'];
  const paths = ['/', '/auth', '/api'];

  for (const name of cookiesToClear) {
    for (const path of paths) {
      document.cookie = `${name}=; Max-Age=0; path=${path}; SameSite=Lax`;
    }
  }
}

/**
 * Nettoie tous les caches Service Worker (Cache API).
 */
async function clearServiceWorkerCaches(): Promise<void> {
  if (typeof window === 'undefined' || !('caches' in window)) return;

  try {
    const names = await caches.keys();
    await Promise.all(names.map((name) => caches.delete(name)));
  } catch {
    // noop (SW non supporté ou bloqué)
  }
}

/**
 * Nettoie un store Zustand persisté de manière safe.
 * - Vérifie que `.persist.clearStorage` existe et est une fonction
 * - Gère les retours Promise (certains middlewares renvoient une Promise)
 */
function clearZustandPersist(store: unknown): void {
  try {
    const persist = (store as { persist?: { clearStorage?: () => unknown } }).persist;
    const clear = persist?.clearStorage;
    if (typeof clear === 'function') {
      const result = clear.call(persist);
      if (result && typeof (result as Promise<unknown>).then === 'function') {
        void (result as Promise<unknown>).catch(() => {});
      }
    }
  } catch {
    // noop
  }
}

/**
 * Nettoie TOUT l'état client lié à l'application.
 * Idempotent, safe en SSR, safe en navigation privée.
 */
export async function clearClientApplicationState(): Promise<void> {
  if (typeof window === 'undefined') return;

  // ─── 1. UI : retirer l'utilisateur IMMÉDIATEMENT ─────────────────────
  // (priorité UX : navbar se met à jour sans attendre le reste)
  try {
    useAuthStore.getState().logout();
  } catch {
    // noop
  }

  // ─── 2. Stores Zustand persistés ─────────────────────────────────────
  clearZustandPersist(useAuthStore);
  clearZustandPersist(useCompetitionStore);

  // ─── 3. React Query ──────────────────────────────────────────────────
  // clearPersistedQueryCache est SYNC et supprime uniquement la clé localStorage
  try {
    clearPersistedQueryCache();
  } catch {
    // noop
  }
  try {
    queryClient.clear();
  } catch {
    // noop
  }

  // ─── 4. Cookies (fallback si non httpOnly) ───────────────────────────
  clearAuthCookiesFallback();

  // ─── 5. Web Storage ──────────────────────────────────────────────────
  try {
    clearAppStorage(window.localStorage);
  } catch {
    // noop (Safari privé peut throw)
  }
  try {
    clearAppStorage(window.sessionStorage);
  } catch {
    // noop
  }

  // ─── 6. IndexedDB ────────────────────────────────────────────────────
  try {
    await clearIndexedDbCache();
  } catch {
    // noop (Firefox privé throw SecurityError)
  }

  // ─── 7. Cache API / Service Worker ───────────────────────────────────
  await clearServiceWorkerCaches();
}