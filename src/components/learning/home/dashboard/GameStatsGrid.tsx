'use client';
import { Stats } from "@/hooks/cache/useStatsDataWithCache";
import { LearningConfiguration } from "@/lib/interfaces";
import { Users, Trophy, Target, Sparkles } from "lucide-react";
import { memo } from 'react';

interface GameStatsGridProps {
    gameConfig: LearningConfiguration;
    stats: Stats;
    demarrerJeu: () => void;
}

export const GameStatsGrid = memo(function GameStatsGrid({ gameConfig, stats, demarrerJeu }: GameStatsGridProps) {
    const statsData = [
        {
            id: 'match',
            icon: <Trophy className="h-4 w-4" />,
            label: 'N° match',
            value: gameConfig?.numeromatch || 'N/A',
            gradient: 'from-amber-400 to-orange-500',
            bgGlow: 'bg-amber-500/20',
            iconBg: 'bg-amber-500/30',
            textGlow: 'shadow-amber-500/50',
        },
        {
            id: 'subscribers',
            icon: <Users className="h-4 w-4" />,
            label: 'Inscrits',
            value: stats?.subscribers || 'N/A',
            gradient: 'from-blue-400 to-indigo-500',
            bgGlow: 'bg-blue-500/20',
            iconBg: 'bg-blue-500/30',
            textGlow: 'shadow-blue-500/50',
        },
        {
            id: 'level',
            icon: <Target className="h-4 w-4" />,
            label: 'Niveau',
            value: gameConfig?.niveau || 2,
            gradient: 'from-purple-400 to-pink-500',
            bgGlow: 'bg-purple-500/20',
            iconBg: 'bg-purple-500/30',
            textGlow: 'shadow-purple-500/50',
        },
    ];

    return (
        <div className="grid grid-cols-3 gap-3 w-full mt-3 cursor-pointer" onClick={demarrerJeu} >
            {statsData.map((stat, index) => (
                <div
                    key={stat.id}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 p-3 text-center backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    style={{
                        animationDelay: `${index * 100}ms`,
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                    <div className={`absolute -right-4 -top-4 h-16 w-16 rounded-full ${stat.bgGlow} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <div className={`absolute -bottom-4 -left-4 h-16 w-16 rounded-full ${stat.bgGlow} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100`} />

                    <div className="relative mb-2 flex justify-center">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl ${stat.textGlow}`}>
                            {stat.icon}
                        </div>
                        <Sparkles className="absolute -right-1 -top-1 h-3 w-3 text-yellow-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>

                    <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-white transition-colors duration-300 group-hover:text-white/70">
                        {stat.label}
                    </p>

                    <div className="relative">
                        <p className={`text-[11px] font-black text-white transition-all duration-300 group-hover:scale-110 ${stat.id === 'match' ? 'bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent' :
                            stat.id === 'subscribers' ? 'bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent' :
                                'bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent'
                            }`}>
                            {stat.value}
                        </p>
                        <div className={`mx-auto mt-0.5 h-0.5 w-8 rounded-full bg-gradient-to-r ${stat.gradient} opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:w-12`} />
                    </div>
                </div>
            ))}
        </div>
    );
});