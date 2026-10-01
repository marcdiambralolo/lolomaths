'use client';
import CacheLink from '@/components/commons/CacheLink';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Crown, LogOut, Settings, User } from 'lucide-react';
import { useEffect, useState } from 'react';

type UserMenuUser = {
    username?: string;
};

interface UserMenuProps {
    user: UserMenuUser | null;
    userBadge: { text: string; label: string };
    mounted: boolean;
    showUserMenu: boolean;
    setShowUserMenu: (show: boolean) => void;
    handleLogout: () => void;
}

export function UserMenu({ user, userBadge, mounted, showUserMenu, setShowUserMenu, handleLogout }: UserMenuProps) {
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    const canRenderClientValues = hydrated && mounted;
    const displayUserName = canRenderClientValues ? user?.username || 'Utilisateur' : 'Utilisateur';
    const displayBadgeText = canRenderClientValues ? userBadge.text : 'Profil';
    const displayBadgeLabel = canRenderClientValues ? userBadge.label : 'Profil utilisateur';

    return (
        <div className="relative user-menu-container">
            <motion.button
                onClick={() => setShowUserMenu(!showUserMenu)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2.5 rounded-xl bg-gradient-lux-light dark:bg-gradient-lux-dark px-3 py-2
             border-2 border-[var(--accent-violet)] dark:border-[var(--accent-gold)]
             hover:border-[var(--accent-gold)] dark:hover:border-[var(--accent-violet)]
             hover:shadow-lg hover:shadow-[var(--accent-violet)]/20
             transition-all duration-300"
            >
                <div className="relative">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[var(--accent-violet)] to-[var(--accent-gold)] flex items-center justify-center shadow-lg">
                        <User className="w-5 h-5 text-white" />
                    </div>

                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        className="absolute -top-1 -right-1"
                    >
                        <Crown className="w-4 h-4 text-[var(--accent-gold)] drop-shadow-lg" />
                    </motion.div>
                </div>

                <div className="text-left">
                    <p suppressHydrationWarning className="text-sm font-bold text-[var(--text-light)] dark:text-[var(--text-dark)] leading-tight max-w-[120px] truncate">
                        {displayUserName}
                    </p>
                    <p suppressHydrationWarning className="bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-violet)] bg-clip-text text-xs font-black text-transparent">
                        {displayBadgeText}
                    </p>
                </div>

                <motion.div
                    animate={{ rotate: showUserMenu ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ChevronDown className="h-4 w-4 text-[var(--accent-violet)] dark:text-[var(--accent-gold)]" />
                </motion.div>
            </motion.button>

            <AnimatePresence>
                {showUserMenu && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl 
                       shadow-2xl border-2 border-[#DDE7FA] dark:border-[#2E5AA6]/35 overflow-hidden z-50"
                    >
                        <div className="border-b border-[#DDE7FA] bg-gradient-to-br from-[#EEF4FF] to-[#DDE7FA] px-4 py-3 
                          dark:from-[#0F1C3F]/50 dark:to-[#162A56]/45 
                          dark:border-[#2E5AA6]/35">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#2E5AA6] to-[#4F83D1] 
                                flex items-center justify-center shadow-md relative">
                                    <User className="w-6 h-6 text-white" />
                                    <Crown className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400" />
                                </div>

                                <div>
                                    <p suppressHydrationWarning className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[150px]">
                                        {displayUserName}
                                    </p>
                                    <p suppressHydrationWarning className="text-xs font-semibold text-[#2E5AA6] dark:text-[#9BC2FF]">{displayBadgeLabel}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-2">
                            <CacheLink href="/star/monprofil" onClick={() => setShowUserMenu(false)}>
                                <motion.button
                                    whileHover={{ scale: 1.02, x: 4 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                             text-slate-700 dark:text-slate-300 hover:bg-[#EEF4FF] dark:hover:bg-[#0F1C3F]/50
                             hover:text-[#2E5AA6] dark:hover:text-[#9BC2FF]
                             transition-all font-semibold text-sm"
                                >
                                    <Settings className="w-5 h-5" />
                                    Profil
                                </motion.button>
                            </CacheLink>

                            <motion.button
                                whileHover={{ scale: 1.02, x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                           text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30
                           transition-all font-semibold text-sm"
                            >
                                <LogOut className="w-5 h-5" />
                                Déconnexion
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}