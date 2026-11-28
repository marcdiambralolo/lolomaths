'use client';
import Loader from '@/app/admin/loading';
import { useLearningConfig } from '@/hooks/admin/useLearningConfig';
import { LearningConfiguration } from '@/lib/interfaces';
import { AnimatePresence, motion } from 'framer-motion';
import { GamepadIcon, PlusIcon, TargetIcon, TrophyIcon, UsersIcon, } from 'lucide-react';
import { useState } from 'react';
import ConfigCard from './ConfigCard';
import ConfigForm from './ConfigForm';
import Pagination from './Pagination';
import ToastContainer from './ToastContainer';

export default function LearningConfigurationManager() {
  const {
    setEditingId, setIsCreating, handleCreate, handleUpdate, handleDelete, setCurrentPage,
    currentPage, totalPages, configs, loading, editingId, isCreating,
  } = useLearningConfig();

  const [filterStatus, setFilterStatus] = useState<
    'all' | 'active' | 'upcoming' | 'ended'
  >('all');

  const filteredConfigs = configs.filter((c) =>
    filterStatus === 'all' ? true : c.status === filterStatus
  );

  const stats = [
    {
      label: 'Tournois',
      value: configs.length,
      icon: <TrophyIcon className="h-6 w-6" />,
      color: 'from-amber-400 via-orange-500 to-red-500',
      delay: 0,
    },
    {
      label: 'En cours',
      value: configs.filter((c) => c.status === 'active').length,
      icon: <TargetIcon className="h-6 w-6" />,
      color: 'from-emerald-400 via-green-500 to-teal-500',
      delay: 0.1,
    },
    {
      label: 'Joueurs',
      value: configs.reduce((acc, c) => acc + (c.participants ?? 0), 0),
      icon: <UsersIcon className="h-6 w-6" />,
      color: 'from-blue-400 via-indigo-500 to-purple-500',
      delay: 0.2,
    },
    {
      label: 'Parties',
      value: configs.reduce((acc, c) => acc + (c.partiesJouees ?? 0), 0),
      icon: <GamepadIcon className="h-6 w-6" />,
      color: 'from-purple-500 via-pink-500 to-fuchsia-500',
      delay: 0.3,
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full min-h-screen bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.12),_transparent_35%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.12),_transparent_35%),linear-gradient(135deg,#f8fafc_0%,#ffffff_45%,#f5f3ff_100%)]">
      <ToastContainer />

      <div className="relative mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: -28 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="overflow-hidden bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 bg-clip-text text-2xl font-black tracking-tight text-transparent md:text-5xl">
                  TOURNOIS LOLOMATHS
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  {configs.length} tournoi{configs.length > 1 ? 's' : ''} configuré{configs.length > 1 ? 's' : ''}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold bg-white hover:border-slate-300 transition-colors"
                >
                  <option value="all">Tous les tournois</option>
                  <option value="active">En cours</option>
                  <option value="upcoming">À venir</option>
                  <option value="ended">Terminés</option>
                </select>

                {!isCreating && (
                  <motion.button
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setIsCreating(true)}
                    className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 px-6 py-3 font-bold text-white shadow-lg"
                  >
                    <div className="absolute inset-0 translate-x-full -skew-x-12 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-0" />
                    <div className="relative flex items-center justify-center gap-2">
                      <PlusIcon className="h-5 w-5" />
                      <span>Nouveau tournoi</span>
                    </div>
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: stat.delay, type: 'spring', stiffness: 180 }}
              whileHover={{ y: -6, scale: 1.015 }}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.color} p-5 text-white shadow-xl`}
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
              <div className="relative z-10">
                <div className="mb-2 flex items-start justify-between">
                  <div className="text-2xl font-black tracking-tight md:text-3xl">
                    {stat.value}
                  </div>
                  <div className="rounded-xl bg-white/15 p-2 backdrop-blur-sm">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-white/90">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {isCreating && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.28 }}
              className="mb-8 overflow-hidden"
            >
              <ConfigForm
                mode="create"
                onSubmit={handleCreate}
                onCancel={() => setIsCreating(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredConfigs.map((config) => (
              <motion.div
                key={config._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {editingId === config._id ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                  >
                    <ConfigForm
                      mode="edit"
                      initialData={config}
                      onSubmit={(data: Partial<LearningConfiguration>) =>
                        handleUpdate(config._id!, data)
                      }
                      onCancel={() => setEditingId(null)}
                    />
                  </motion.div>
                ) : (
                  <ConfigCard
                    config={config}
                    onEdit={() => setEditingId(config._id!)}
                    onDelete={() => handleDelete(config._id!)}
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredConfigs.length === 0 && !isCreating && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
            <TrophyIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">
              {filterStatus === 'all'
                ? 'Aucun tournoi configuré pour le moment.'
                : `Aucun tournoi ${filterStatus === 'active'
                  ? 'en cours'
                  : filterStatus === 'upcoming'
                    ? 'à venir'
                    : 'terminé'
                }.`}
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}