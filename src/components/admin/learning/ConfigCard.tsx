'use client';
import { statusConfig } from '@/hooks/admin/useLearningConfig';
import { normalizeStatus } from '@/lib/functions';
import { LearningConfiguration } from '@/lib/interfaces';
import { formatDateFR } from '@/lib/learning/functions';
import { motion } from 'framer-motion';
import { CalendarIcon, FlagIcon, LockIcon, PencilIcon, TrashIcon } from 'lucide-react';

function ConfigCard({ config, onEdit, onDelete, onEnd }: {
    config: LearningConfiguration;
    onEdit: () => void;
    onDelete: () => void;
    onEnd?: () => void;
}) {
    const status = statusConfig[normalizeStatus(config.status)];
    const isEnded = config.status === 'ended';
    const isActive = config.isActive;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            whileHover={{ y: -2 }}
            className="group relative"
        >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-15" />
            <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white/95 shadow-lg transition-all duration-300 hover:border-purple-200">
                <div className={`h-1.5 bg-gradient-to-r ${status.color}`} />

                {isEnded && (
                    <div className="absolute top-4 right-4 bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md z-10">
                        <LockIcon className="w-3 h-3" />
                        Terminée
                    </div>
                )}

                <div className="p-5 md:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex-1">
                            <div className="mb-4 flex flex-wrap items-center gap-2">
                                <motion.div whileHover={{ scale: 1.03 }} className={`rounded-full border px-3 py-1 text-xs font-bold ${status.bg} ${status.text} ${status.border}`}>
                                    <span className="mr-1">{status.icon}</span>
                                    {status.label}
                                </motion.div>

                                <div className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
                                    📊 Niveau {config.niveau ?? 2}
                                </div>

                                {isActive && (
                                    <motion.div
                                        animate={{ scale: [1, 1.08, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700"
                                    >
                                        ✅ ACTIF
                                    </motion.div>
                                )}

                                {isEnded && (
                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500">
                                        🔒 Lecture seule
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-3 mb-4">
                                {config.numeromatch && (
                                    <div className="flex items-center gap-2 rounded-xl bg-gray-50 p-3">
                                        <span className="text-lg">🆔</span>
                                        <div>
                                            <div className="text-xs text-gray-500">Numéro de match</div>
                                            <div className="font-mono text-sm font-semibold text-gray-800">{config.numeromatch}</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 text-gray-600">
                                    <CalendarIcon className="h-5 w-5 text-purple-500" />
                                    <div>
                                        <div className="text-xs text-gray-400">Début</div>
                                        <div className="text-sm font-semibold">{formatDateFR(config.startgameDate)}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 text-gray-600">
                                    <CalendarIcon className="h-5 w-5 text-blue-500" />
                                    <div>
                                        <div className="text-xs text-gray-400">Fin</div>
                                        <div className="text-sm font-semibold">{formatDateFR(config.endgameDate)}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 text-gray-600">
                                    <CalendarIcon className="h-5 w-5 text-blue-500" />
                                    <div>
                                        <div className="text-xs text-gray-400">Proclamation</div>
                                        <div className="text-sm font-semibold">{formatDateFR(config.proclamationDate)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="ml-0 flex flex-col items-end gap-2 lg:ml-4">
                            <div className="flex gap-2">
                                {!isEnded && onEnd && (
                                    <motion.button
                                        whileHover={{ scale: 1.08 }}
                                        whileTap={{ scale: 0.92 }}
                                        onClick={onEnd}
                                        className="rounded-2xl p-3 bg-amber-50 text-amber-600 hover:bg-amber-100 transition-all"
                                        title="Terminer l'édition"
                                    >
                                        <FlagIcon className="h-5 w-5" />
                                    </motion.button>
                                )}

                                <motion.button
                                    whileHover={!isEnded ? { scale: 1.08, rotate: 10 } : {}}
                                    whileTap={!isEnded ? { scale: 0.92 } : {}}
                                    onClick={onEdit}
                                    disabled={isEnded}
                                    className={`rounded-2xl p-3 transition-all ${isEnded ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                                    title={isEnded ? 'Cette édition est terminée et ne peut pas être modifiée' : 'Modifier'}
                                >
                                    <PencilIcon className="h-5 w-5" />
                                </motion.button>

                                <motion.button
                                    whileHover={!isEnded ? { scale: 1.08, rotate: -10 } : {}}
                                    whileTap={!isEnded ? { scale: 0.92 } : {}}
                                    onClick={onDelete}
                                    disabled={isEnded}
                                    className={`rounded-2xl p-3 transition-all ${isEnded ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                                    title={isEnded ? 'Cette édition est terminée et ne peut pas être supprimée' : 'Supprimer'}
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </motion.button>
                            </div>

                            {config.isActive && (
                                <div className="text-xs text-green-600 font-medium mt-1">
                                    ⚡ Édition active
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default ConfigCard;