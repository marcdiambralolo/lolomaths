'use client';

import {
  ConfigStatus,
  LearningConfiguration,
  StatusConfigItem,
} from '@/lib/interfaces';
import { generateNumeromatch } from '@/lib/learning/configUtils';
import { ITEMS_PER_PAGE } from '@/lib/learning/constantes';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { useConfigApi } from './useConfigApi';
import { usePagination } from './usePagination';
import { useToast } from './useToast';

// ============================================================
// CONFIGURATION DES STATUTS
// ============================================================

export const statusConfig: Record<ConfigStatus, StatusConfigItem> = {
  pending: {
    color: 'from-amber-400 to-yellow-500',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800',
    icon: '⏳',
    label: 'En attente',
  },
  active: {
    color: 'from-emerald-400 to-green-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800',
    icon: '⚡',
    label: 'Actif',
  },
  ended: {
    color: 'from-slate-400 to-gray-500',
    bg: 'bg-slate-50 dark:bg-slate-800',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-700',
    icon: '🏁',
    label: 'Terminé',
  },
  cancelled: {
    color: 'from-rose-400 to-red-500',
    bg: 'bg-rose-50 dark:bg-rose-900/20',
    text: 'text-rose-700 dark:text-rose-400',
    border: 'border-rose-200 dark:border-rose-800',
    icon: '❌',
    label: 'Annulé',
  },
} as const;

// ============================================================
// HOOK
// ============================================================

export function useLearningConfig() {
  // -------------------- STATE --------------------
  const [configs, setConfigs] = useState<LearningConfiguration[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Ref pour éviter les appels multiples
  const isMountedRef = useRef(true);

  // -------------------- HOOKS --------------------
  const {
    fetchConfigurations,
    createConfiguration,
    updateConfiguration,
    deleteConfiguration,
    isLoading,
    error,
  } = useConfigApi();

  const { showToast } = useToast();

  const { currentPage, totalPages, paginatedItems, setCurrentPage } =
    usePagination(configs, ITEMS_PER_PAGE);

  // -------------------- FETCH INITIAL --------------------
  const loadConfigs = useCallback(
    async (silent = false) => {
      if (!silent) setIsRefreshing(true);
      try {
        const data = await fetchConfigurations();
        if (isMountedRef.current && data) {
          setConfigs(data);
        }
      } catch (err) {
        if (isMountedRef.current) {
          console.error('Erreur lors du chargement des configurations:', err);
          showToast('Impossible de charger les configurations.', 'error');
        }
      } finally {
        if (isMountedRef.current) setIsRefreshing(false);
      }
    },
    [fetchConfigurations, showToast]
  );

  useEffect(() => {
    isMountedRef.current = true;
    loadConfigs();
    return () => {
      isMountedRef.current = false;
    };
  }, [loadConfigs]);

  // -------------------- CREATE --------------------
  const handleCreate = useCallback(
    async (data: Partial<LearningConfiguration>) => {
      startTransition(async () => {
        const submitData: Partial<LearningConfiguration> = {
          ...data,
          numeromatch: data.numeromatch || generateNumeromatch(),
        };

        // Optimistic update
        const tempId = `temp-${Date.now()}`;
        const optimisticConfig = {
          ...submitData,
          _id: tempId,
          id: tempId,
        } as LearningConfiguration;

        setConfigs((prev) => [optimisticConfig, ...prev]);

        try {
          const result = await createConfiguration(submitData);
          if (result && isMountedRef.current) {
            showToast('🎮 Configuration créée avec succès !', 'success');
            await loadConfigs(true); // Rechargement silencieux
            setIsCreating(false);
            setCurrentPage(1);
          } else {
            // Rollback
            setConfigs((prev) => prev.filter((c) => c._id !== tempId));
            showToast('Erreur lors de la création.', 'error');
          }
        } catch (err) {
          // Rollback
          setConfigs((prev) => prev.filter((c) => c._id !== tempId));
          console.error('Erreur création:', err);
          showToast('Erreur lors de la création.', 'error');
        }
      });
    },
    [createConfiguration, loadConfigs, showToast, setCurrentPage]
  );

  // -------------------- UPDATE --------------------
  const handleUpdate = useCallback(
    async (id: string, data: Partial<LearningConfiguration>) => {
      startTransition(async () => {
        // Sauvegarde de l'ancienne config pour rollback
        const previousConfig = configs.find(
          (c) => c._id === id || c.id === id
        );
        if (!previousConfig) return;

        // Optimistic update
        setConfigs((prev) =>
          prev.map((c) =>
            c._id === id || c.id === id ? { ...c, ...data } : c
          )
        );

        try {
          const result = await updateConfiguration(id, data);
          if (result && isMountedRef.current) {
            showToast('✨ Configuration mise à jour !', 'success');
            await loadConfigs(true);
            setEditingId(null);
          } else {
            // Rollback
            setConfigs((prev) =>
              prev.map((c) =>
                c._id === id || c.id === id ? previousConfig : c
              )
            );
            showToast('Erreur lors de la mise à jour.', 'error');
          }
        } catch (err) {
          setConfigs((prev) =>
            prev.map((c) =>
              c._id === id || c.id === id ? previousConfig : c
            )
          );
          console.error('Erreur mise à jour:', err);
          showToast('Erreur lors de la mise à jour.', 'error');
        }
      });
    },
    [configs, updateConfiguration, loadConfigs, showToast]
  );

  // -------------------- DELETE --------------------
  const handleDelete = useCallback(
    async (id: string) => {
      const confirmed = window.confirm(
        'Êtes-vous sûr de vouloir supprimer cette configuration ?'
      );
      if (!confirmed) return;

      startTransition(async () => {
        // Sauvegarde pour rollback
        const previousConfigs = configs;
        const configToDelete = configs.find(
          (c) => c._id === id || c.id === id
        );
        if (!configToDelete) return;

        // Optimistic update
        setConfigs((prev) =>
          prev.filter((c) => c._id !== id && c.id !== id)
        );

        try {
          const success = await deleteConfiguration(id);
          if (success && isMountedRef.current) {
            showToast('🗑️ Configuration supprimée', 'success');

            // Recalcul de la pagination
            const newTotalPages = Math.ceil(
              (previousConfigs.length - 1) / ITEMS_PER_PAGE
            );
            if (currentPage > newTotalPages && newTotalPages > 0) {
              setCurrentPage(newTotalPages);
            }
          } else {
            // Rollback
            setConfigs(previousConfigs);
            showToast('Erreur lors de la suppression.', 'error');
          }
        } catch (err) {
          setConfigs(previousConfigs);
          console.error('Erreur suppression:', err);
          showToast('Erreur lors de la suppression.', 'error');
        }
      });
    },
    [configs, deleteConfiguration, showToast, currentPage, setCurrentPage]
  );

  // -------------------- REFRESH --------------------
  const refreshConfigs = useCallback(async () => {
    await loadConfigs();
  }, [loadConfigs]);

  // -------------------- RESET --------------------
  const resetAll = useCallback(() => {
    setConfigs([]);
    setEditingId(null);
    setIsCreating(false);
    setCurrentPage(1);
  }, [setCurrentPage]);

  // -------------------- RETURN --------------------
  return {
    // État
    configs,
    editingId,
    isCreating,
    isPending,
    isRefreshing,
    error,

    // Loader
    loading: isLoading, // Loader uniquement pour le fetch initial
    isMutating: isPending, // Pour désactiver les boutons

    // Pagination
    currentPage,
    totalPages,
    paginatedConfigs: paginatedItems,

    // Actions
    setCurrentPage,
    setEditingId,
    setIsCreating,
    setConfigs,
    handleCreate,
    handleUpdate,
    handleDelete,
    refreshConfigs,
    resetAll,
  };
}

export { useLearningConfig as default };