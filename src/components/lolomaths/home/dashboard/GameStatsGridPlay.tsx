'use client';
import { Stats } from "@/hooks/cache/useStatsDataWithCache";
import { LearningConfiguration } from "@/lib/interfaces";
import { Target, Trophy, Users } from "lucide-react";
import { memo } from 'react';

interface GameStatsGridProps {
    gameConfig: LearningConfiguration;
    stats: Stats;
}

export const GameStatsGridPlay = memo(function GameStatsGrid({ gameConfig, stats }: GameStatsGridProps) {
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
        <div className="grid grid-cols-3 gap-3 w-full mt-3">
            {statsData.map((stat, index) => (
                <div
                    key={stat.id}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 p-3 text-center backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    style={{
                        animationDelay: `${index * 100}ms`,
                    }}
                >
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