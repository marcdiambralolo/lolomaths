'use client';

import { AuthRequestError, authService } from '@/lib/api/services';
import { clearClientApplicationState } from '@/lib/cache/clientState';
import { config } from '@/lib/config';
import { Role } from '@/lib/interfaces';
import { useAuthStore } from '@/lib/store/auth.store';
import type { LoginDto, Permission, RegisterDto } from '@/lib/types/auth.types';
import { logger } from '@/lib/utils/logger';
import { useRouter } from 'next/navigation';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { User } from '../interfaces';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasRole: (roles: Role | Role[]) => boolean;
  hasPermission: (permissions: Permission | Permission[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logoutStore = useAuthStore((s) => s.logout);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const persistLogin = useAuthStore((s) => s.login);
  const persistUser = useAuthStore((s) => s.updateUser);
  const persistLogout = useAuthStore((s) => s.logout);

  useEffect(() => {
    let isMounted = true;

    const isPublicRoute = () => {
      if (typeof window === 'undefined') return false;
      const publicRoutes = ['/auth/login', '/auth/register', '/auth/logout'];
      return publicRoutes.some((route) => window.location.pathname.startsWith(route));
    };

    const initAuth = async () => {
      if (isPublicRoute()) {
        setIsLoading(false);
        return;
      }
      try {
        const currentUser = await authService.me();
        if (!isMounted) return;
        persistLogin(currentUser);
      } catch (error) {
        if (error instanceof AuthRequestError && error.status === 401) {
          // ⚠️ Ne PAS supprimer le cookie en JS ici : on laisse le middleware
          // et le serveur gérer. On nettoie juste l'état client.
          await clearClientApplicationState();
          if (isMounted && typeof window !== 'undefined') {
            window.location.replace('/auth/login');
            return;
          }
        } else {
          logger.warn('Auth initialization skipped after non-auth error:', error);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void initAuth();

    return () => {
      isMounted = false;
    };
  }, [persistLogin, persistLogout]);

  const login = useCallback(async (credentials: LoginDto): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      persistLogin(response.user);
      setAccessToken(response.accessToken ?? null);
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [persistLogin]);

  const register = useCallback(async (data: RegisterDto): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      persistLogin(response.user);
      router.replace(config.routes.dashboard);
      router.refresh();
    } catch (error) {
      logger.error('Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [persistLogin, router]);

  /**
   * ✅ Déconnexion propre :
   * 1. Nettoyage immédiat de l'état Zustand (UI réactive)
   * 2. Appel serveur pour tuer les cookies httpOnly (Set-Cookie)
   * 3. Nettoyage de tous les caches client
   * 4. Reset du token en mémoire
   */
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    // 1. UI : l'utilisateur disparaît immédiatement de l'état
    logoutStore();

    try {
      // 2. Serveur : supprime les cookies httpOnly via Set-Cookie
      await authService.logout();
    } catch (error) {
      // On log mais on continue : le nettoyage client doit avoir lieu quoi qu'il arrive
      logger.error('Logout API error (continuing cleanup):', error);
    } finally {
      // 3. Reset du token en mémoire
      setAccessToken(null);

      // 4. Nettoyage de tous les caches client (React Query, localStorage, IndexedDB…)
      try {
        await clearClientApplicationState();
      } catch (error) {
        logger.error('Client state cleanup error:', error);
      }

      persistLogout();
      setIsLoading(false);
    }
  }, [logoutStore, persistLogout]);

  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      const currentUser = await authService.me();
      persistUser(currentUser);
    } catch (error) {
      logger.error('Error refreshing user:', error);
      throw error;
    }
  }, [persistUser]);

  const hasRole = useCallback((roles: Role | Role[]): boolean => {
    if (!user?.role) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  }, [user]);

  const hasPermission = useCallback((permissions: Permission | Permission[]): boolean => {
    if (!user) return false;
    if (user.role === Role.SUPER_ADMIN) return true;
    const permissionArray = Array.isArray(permissions) ? permissions : [permissions];
    return user.customPermissions
      ? permissionArray.some((perm) => user.customPermissions?.includes(perm))
      : false;
  }, [user]);

  const isAuthenticated = useMemo(() => !!user, [user]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      accessToken,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      refreshUser,
      hasRole,
      hasPermission,
    }),
    [user, accessToken, isAuthenticated, isLoading, login, register, logout, refreshUser, hasRole, hasPermission]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;