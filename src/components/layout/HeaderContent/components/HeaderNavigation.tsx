'use client';
import CacheLink from '@/components/commons/CacheLink';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface NavItem {
    href: string;
    label: string;
    icon: LucideIcon;
}

interface HeaderNavigationProps {
    navItems: NavItem[];
}

export function HeaderNavigation({ navItems }: HeaderNavigationProps) {

    return (
        <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item, index) => {
                const Icon = item.icon;

                return (
                    <CacheLink key={item.href} href={item.href}>
                        <motion.button
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08 }}
                            whileHover={{ scale: 1.03, y: -1 }}
                            whileTap={{ scale: 0.97 }}
                            className="relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold
                         text-slate-700 dark:text-slate-300 hover:text-[#2E5AA6] dark:hover:text-[#9BC2FF] 
                         hover:bg-[#EEF4FF] dark:hover:bg-[#0F1C3F]/50
                         transition-all duration-200 group"
                        >
                            <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />

                            <span>{item.label}</span>

                        </motion.button>
                    </CacheLink>
                );
            })}
        </nav>
    );
}