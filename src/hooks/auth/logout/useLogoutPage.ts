import { useAuth } from '@/lib/auth/AuthContext';
import { useAuthStore } from '@/lib/store/auth.store';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

const PROGRESS_INTERVAL = 100;
const PROGRESS_STEP = 10;
const SUCCESS_REDIRECT_DELAY = 1200;   // raccourci : 4s c'est trop long
const ERROR_REDIRECT_DELAY = 1500;
const MAX_LOGOUT_WAIT = 10000;

export type LogoutStatus = 'loading' | 'success' | 'error';

export function useLogoutPage() {
  const { logout, user } = useAuth();
  const router = useRouter();
  const logoutStore = useAuthStore((s) => s.logout);

  const [status, setStatus] = useState<LogoutStatus>('loading');
  const [progress, setProgress] = useState(0);

  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutCompletedRef = useRef(false);
  const hasRunRef = useRef(false);

  const cleanup = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
      redirectTimeoutRef.current = null;
    }
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    // ✅ Garde anti double-exécution (React StrictMode en dev)
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const redirectToLogin = () => {
      // ✅ On utilise router + refresh pour que le middleware voie le cookie supprimé
      router.replace('/auth/login');
      router.refresh();
    };

    const performLogout = async () => {
      // 1. UI : l'utilisateur disparaît immédiatement
      logoutStore();

      // 2. Si pas d'utilisateur, on considère déjà déconnecté
      if (!user) {
        setStatus('success');
        setProgress(100);
        redirectTimeoutRef.current = setTimeout(redirectToLogin, SUCCESS_REDIRECT_DELAY);
        return;
      }

      // 3. Progress bar simulée qui monte jusqu'à 90 %
      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
              progressIntervalRef.current = null;
            }
            return 90;
          }
          return Math.min(prev + PROGRESS_STEP, 90);
        });
      }, PROGRESS_INTERVAL);

      // 4. Timeout de sécurité : si l'API ne répond jamais
      errorTimeoutRef.current = setTimeout(() => {
        if (!logoutCompletedRef.current) {
          cleanup();
          setStatus('error');
          redirectTimeoutRef.current = setTimeout(redirectToLogin, ERROR_REDIRECT_DELAY);
        }
      }, MAX_LOGOUT_WAIT);

      try {
        // 5. Appel API réel (le serveur tue les cookies httpOnly)
        await logout();
        logoutCompletedRef.current = true;
        cleanup();
        setProgress(100);
        setStatus('success');
        redirectTimeoutRef.current = setTimeout(redirectToLogin, SUCCESS_REDIRECT_DELAY);
      } catch {
        cleanup();
        setStatus('error');
        redirectTimeoutRef.current = setTimeout(redirectToLogin, ERROR_REDIRECT_DELAY);
      }
    };

    void performLogout();

    return cleanup;
  }, [cleanup, logout, logoutStore, router, user]);

  return { status, progress };
}