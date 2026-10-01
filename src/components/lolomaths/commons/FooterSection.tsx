'use client';
import { useOnlineStatus } from '@/hooks/lolomaths/home/useOnlineStatus';
import { CURRENT_YEAR, STATUS_CONFIG } from '@/lib/learning/constantes';
import { memo } from 'react';
import { motion } from 'framer-motion';

const COLOR_CLASSES: Record<string, string> = {
    red: 'bg-red-500',
    green: 'bg-green-500',
    emerald: 'bg-emerald-500',
};

interface StatusBadgeProps {
    text: string;
    color: string;
}

const StatusBadge = memo(({ text, color }: StatusBadgeProps) => {
    const bgClass = COLOR_CLASSES[color] ?? 'bg-gray-500';

    return (
        <div
            role="status"
            aria-label={`Statut de connexion : ${text}`}
            className={`px-3 py-2 rounded-full text-xs font-bold shadow-md ${bgClass} text-white flex items-center gap-2 transition-colors duration-300`}
        >
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            <span>{text}</span>
        </div>
    );
});

const AppName = memo(() => {
    return (
        <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <motion.span
                className="text-xs font-black tracking-wider bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
                LOLOMATHS
            </motion.span>

            <motion.div
                className="h-0.5 w-16 bg-gradient-to-r from-purple-500/50 via-indigo-500/50 to-pink-500/50 rounded-full mt-0.5"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
            />

            <motion.span
                className="text-[8px] text-white font-medium tracking-[0.15em] uppercase mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
            >
                Reveillons le genie qui sommeille en nous !
            </motion.span>
        </motion.div>
    );
});

const Divider = memo(() => {
    return (
        <motion.div
            className="hidden sm:block h-8 w-px bg-gradient-to-b from-transparent via-gray-600/50 to-transparent"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
        />
    );
});

const Copyright = memo(() => {
    return (
        <motion.div
            className="flex flex-col items-center sm:items-start"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
        >
            <span className="text-xs font-medium text-gray-300">
                © {CURRENT_YEAR}
            </span>
            <span className="text-[10px] text-white font-medium">
                Diambra Corporation
            </span>
        </motion.div>
    );
});

export const FooterSection = memo(() => {
    const isOnline = useOnlineStatus();
    const status = isOnline ? STATUS_CONFIG.online : STATUS_CONFIG.offline;

    return (
        <footer className="relative mt-8 bg-gray-900 rounded-xl p-2 shadow-lg overflow-hidden">
            <div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 pointer-events-none"
                aria-hidden="true"
            />

            <motion.div
                className="absolute inset-0 rounded-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 via-orange-500/20 to-pink-500/20 blur-sm" />
            </motion.div>

            <div className="relative flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                <AppName />
                <Divider />

                <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 }}
                >
                    <StatusBadge text={status.text} color={status.color} />
                </motion.div>

                <Divider />
                <div className="flex items-center gap-4">
                    <Copyright />
                </div>
            </div>

            <motion.p
                className="relative text-center text-[10px] text-white font-medium mt-3 sm:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
            >
                Reveillons le genie qui sommeille en nous !  
            </motion.p>
        </footer>
    );
});

export default FooterSection;