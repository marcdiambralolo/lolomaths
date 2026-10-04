"use client";
import { cx, formatEditionDate } from "@/lib/functions";
import type { Consultation } from "@/lib/interfaces";
import { motion } from "framer-motion";
import { CheckCircle, Globe, Timer, UserRound } from "lucide-react";

interface ConsultationCardProps {
    consultation: Consultation;
    index: number;
    isDuplicate?: boolean;
    duplicateCount?: number;
}

export function ConsultationCard({ consultation, index, isDuplicate = false, duplicateCount = 0 }: ConsultationCardProps) {
    const nomJoueur = consultation.clientId?.username || 'LoloMaths';
    const country = consultation.clientId?.country || 'Côte d\'Ivoire';
    const combinaison = consultation.timeSpent || '0';
    const timeSpent = consultation.timeSpent;
    const relativeDate = formatEditionDate(new Date(consultation.createdAt || ''));

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
            whileHover={{ y: -4 }}
            className={cx(
                "group relative overflow-hidden rounded-xl p-4 cursor-pointer",
                "bg-white dark:bg-gray-800",
                "border border-gray-100 dark:border-gray-700",
                "shadow-md hover:shadow-xl",
                "transition-all duration-300",
                isDuplicate && "ring-2 ring-green-500 ring-offset-2 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20"
            )}
        >
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent pointer-events-none" />
            <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                            <UserRound className="w-3.5 h-3.5" />
                            <span className="text-xs font-medium">{nomJoueur}</span>
                        </div>
                        {timeSpent && (
                            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                                <Timer className="w-3.5 h-3.5" />
                                <span className="text-xs  font-medium">{relativeDate}</span>
                            </div>
                        )}    <Globe className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{country}</span>
                    </div>
                </div>

                <div className="flex justify-center gap-0.5 py-2">
                    {combinaison.split('').map((digit, i) => (
                        <motion.span
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.05, type: "spring", stiffness: 200 }}
                            className={cx(
                                "w-10 h-10 flex items-center justify-center rounded-xl font-black text-2xl transition-all",
                                isDuplicate
                                    ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30"
                                    : "bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 text-gray-800 dark:text-white",
                                "shadow-md hover:scale-105 transition-transform"
                            )}
                        >
                            {digit}
                        </motion.span>
                    ))}
                    {isDuplicate && (
                        <div className="relative   z-10">
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold shadow-md">
                                <CheckCircle className="w-3 h-3" />
                                {duplicateCount > 1 ? `x${duplicateCount}` : 'Doublon'}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.article>
    );
} 