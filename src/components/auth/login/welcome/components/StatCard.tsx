'use client';
import { memo } from 'react';

type StatItem = {
    id: string;
    value: string;
    label: string;
    gradient: string;
    textColor: string;
    glow: string;
};

const StatCard = memo(function StatCard({ item }: { item: StatItem }) {
    return (
        <div
            className={`relative overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-br ${item.gradient} p-5 shadow-xl ${item.glow} backdrop-blur-sm dark:border-white/10`}
        >
            <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-white/20 blur-2xl dark:bg-white/10" />

            <div className="relative text-center">
                <div className={`text-3xl font-black sm:text-4xl ${item.textColor}`}>
                    {item.value}
                </div>
                <div className="mt-2 text-sm font-semibold leading-snug text-slate-700 dark:text-slate-200">
                    {item.label}
                </div>
            </div>
        </div>
    );
});

export default StatCard;