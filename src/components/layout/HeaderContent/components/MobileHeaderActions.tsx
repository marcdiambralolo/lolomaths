'use client';
import NotificationBell from '@/components/layout/HeaderContent/NotificationBell';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

interface MobileHeaderActionsProps {
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
}

export function MobileHeaderActions({
    mobileMenuOpen,
    setMobileMenuOpen
}: MobileHeaderActionsProps) {
    return (
        <div className="flex lg:hidden items-center gap-1.5 sm:gap-2">
            <NotificationBell />

            <motion.button
                whileTap={{ scale: 0.9, rotate: 90 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-xl bg-gradient-to-br from-[#EEF4FF] to-[#DDE7FA] p-2 
                   dark:from-[#0F1C3F]/70 dark:to-[#162A56]/70
                   text-[#2E5AA6] dark:text-[#9BC2FF]
                   hover:shadow-lg hover:shadow-[#2E5AA6]/20
                   transition-all"
            >
                <AnimatePresence mode="wait">
                    {mobileMenuOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <X className="w-6 h-6" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="menu"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Menu className="w-6 h-6" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
}