'use client';
import { motion, Variants } from "framer-motion";
import { LogOut, Shield, Sparkles, Star, Zap } from "lucide-react";

const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.92, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 250, damping: 22, mass: 0.8 } },
    exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.15 } }
};

export const LoadingState = ({ progress }: { progress: number }) => (
    <motion.div
        key="loading"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="theme-dark-panel rounded-2xl border border-white/20 bg-white/95 p-6 text-center shadow-2xl backdrop-blur-xl sm:rounded-3xl sm:p-10 dark:bg-[#0F1C3F]/92"
    >
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
            className="relative mx-auto mb-5 h-16 w-16 sm:mb-6 sm:h-20 sm:w-20"
        >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] shadow-xl shadow-[#2E5AA6]/35 sm:rounded-3xl" />
            <div className="absolute inset-0 flex items-center justify-center">
                <LogOut className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0"
            >
                <Sparkles className="h-16 w-16 text-[#9BC2FF] sm:h-20 sm:w-20" />
            </motion.div>
        </motion.div>

        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="theme-dark-title mb-2 text-xl font-bold text-slate-900 sm:mb-3 sm:text-2xl">Déconnexion en cours</motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="theme-dark-muted mb-5 text-sm text-slate-600 sm:mb-7 sm:text-base">Sécurisation de votre session...</motion.p>

        <div className="mb-5 sm:mb-7">
            <div className="h-2 sm:h-2.5 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                <motion.div className="relative h-full rounded-full bg-gradient-to-r from-[#2E5AA6] via-[#4F83D1] to-[#9BC2FF]" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.25, ease: "easeOut" }}>
                    <motion.div className="absolute inset-0 bg-white/30" animate={{ x: ['-100%', '100%'] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                </motion.div>
            </div>
            <motion.p animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-xs sm:text-sm text-slate-500 mt-2 font-semibold">{progress}%</motion.p>
        </div>

        <div className="flex items-center justify-center gap-3 sm:gap-4 text-slate-400">
            {[
                { Icon: Shield, color: "text-blue-400" },
                { Icon: Zap, color: "text-yellow-400" },
                { Icon: Star, color: "text-[#9BC2FF]" }
            ].map(({ Icon, color }, i) => (
                <motion.div key={i} className={color}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.div>
            ))}
        </div>
    </motion.div>
);