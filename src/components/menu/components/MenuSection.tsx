'use client';
import { MainMenuItem } from '@/lib/interfaces';
import { motion } from 'framer-motion';
import {
    BookOpen, ChevronRight, Crown, Flame, Gamepad2,
    Gem, Settings, Sparkles, Star, Trophy, Users, Zap,
} from 'lucide-react';
import React from 'react';

const MENU_GRADIENT_STYLES = [
    {
        bg: 'from-indigo-500 to-purple-600',
        text: 'group-hover:text-indigo-400',
        border: 'group-hover:border-indigo-500/50',
        glow: 'group-hover:shadow-indigo-500/20',
    },
    {
        bg: 'from-purple-500 to-pink-600',
        text: 'group-hover:text-purple-400',
        border: 'group-hover:border-purple-500/50',
        glow: 'group-hover:shadow-purple-500/20',
    },
    {
        bg: 'from-pink-500 to-rose-600',
        text: 'group-hover:text-pink-400',
        border: 'group-hover:border-pink-500/50',
        glow: 'group-hover:shadow-pink-500/20',
    },
    {
        bg: 'from-cyan-500 to-blue-600',
        text: 'group-hover:text-cyan-400',
        border: 'group-hover:border-cyan-500/50',
        glow: 'group-hover:shadow-cyan-500/20',
    },
    {
        bg: 'from-emerald-500 to-teal-600',
        text: 'group-hover:text-emerald-400',
        border: 'group-hover:border-emerald-500/50',
        glow: 'group-hover:shadow-emerald-500/20',
    },
    {
        bg: 'from-amber-500 to-orange-600',
        text: 'group-hover:text-amber-400',
        border: 'group-hover:border-amber-500/50',
        glow: 'group-hover:shadow-amber-500/20',
    },
] as const;

interface IconProps {
    name: string;
    className?: string;
}

function Icon({ name, className = 'h-6 w-6' }: IconProps) {
    const icons: Record<string, React.ReactNode> = {
        play: <Gamepad2 className={className} />,
        trophy: <Trophy className={className} />,
        book: <BookOpen className={className} />,
        settings: <Settings className={className} />,
        users: <Users className={className} />,
        sparkles: <Sparkles className={className} />,
        star: <Star className={className} />,
        crown: <Crown className={className} />,
        zap: <Zap className={className} />,
        flame: <Flame className={className} />,
        gem: <Gem className={className} />,
    };

    return icons[name] ?? <Sparkles className={className} />;
}

interface MenuCardProps {
    item: MainMenuItem;
    onClick: (item: MainMenuItem) => void;
    index: number;
}

function MenuCard({ item, onClick, index }: MenuCardProps) {
    const style = MENU_GRADIENT_STYLES[index % MENU_GRADIENT_STYLES.length];

    return (
        <motion.button
            type="button"
            onClick={() => onClick(item)}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.45 }}
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.985 }}
            className="group relative w-full rounded-2xl bg-gradient-to-r from-slate-200/70 via-slate-300/30 to-slate-200/70 p-[1px] text-left focus:outline-none dark:from-slate-800/90 dark:via-slate-700/30 dark:to-slate-800/90"
        >
            <div
                className={`relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/92 p-4 shadow-sm transition-all duration-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/92 ${style.border} ${style.glow}`}
            >
                <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full dark:via-white/5" />

                <div className="relative z-10 flex items-center gap-4">
                    <div className="relative shrink-0">
                        <div
                            className={`absolute inset-0 rounded-xl bg-gradient-to-br ${style.bg} opacity-30 blur-md transition-opacity duration-300 group-hover:opacity-70`}
                        />
                        <div
                            className={`relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${style.bg} text-white shadow-md transition-transform duration-300 group-hover:rotate-2 group-hover:scale-105 sm:h-14 sm:w-14`}
                        >
                            <Icon name={item.icon} className="h-6 w-6 sm:h-7 sm:w-7" />
                        </div>
                    </div>

                    <div className="min-w-0 flex-1 text-left">
                        <h3
                            className={`text-base font-bold text-slate-800 transition-colors duration-200 dark:text-slate-100 sm:text-lg ${style.text}`}
                        >
                            {item.title}
                        </h3>
                        <p className="line-clamp-2 text-xs font-normal text-slate-500 dark:text-slate-400 sm:text-sm">
                            {item.description}
                        </p>
                    </div>

                    <div className="shrink-0">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-400 shadow-inner transition-all duration-300 group-hover:translate-x-1 group-hover:bg-slate-900 group-hover:text-white dark:bg-slate-800/80 dark:group-hover:bg-slate-100 dark:group-hover:text-slate-900 sm:h-10 sm:w-10">
                            <ChevronRight className="h-5 w-5" />
                        </div>
                    </div>
                </div>
            </div>
        </motion.button>
    );
}

function MenuSection({
    items,
    onNavigate,
}: {
    items: MainMenuItem[];
    onNavigate: (item: MainMenuItem) => void;
}) {
    return (
        <section className="w-full max-w-lg space-y-3">
            {items.map((item, index) => (
                <MenuCard
                    key={item.id}
                    item={item}
                    onClick={onNavigate}
                    index={index}
                />
            ))}
        </section>
    );
}

export default MenuSection;