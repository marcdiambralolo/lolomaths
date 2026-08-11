'use client';
import React, { memo } from 'react';

type BonusItem = {
    id: string;
    icon: React.ReactNode;
    title: string;
    value: string;
    color: string;
};

const BonusCard = memo(function BonusCard({ item }: { item: BonusItem }) {
    const colorClasses = {
        purple: "from-purple-50 to-purple-100 text-purple-700 dark:from-purple-500/20 dark:to-purple-500/10 dark:text-purple-300",
        indigo: "from-indigo-50 to-indigo-100 text-indigo-700 dark:from-indigo-500/20 dark:to-indigo-500/10 dark:text-indigo-300",
        pink: "from-pink-50 to-pink-100 text-pink-700 dark:from-pink-500/20 dark:to-pink-500/10 dark:text-pink-300",
        green: "from-green-50 to-green-100 text-green-700 dark:from-green-500/20 dark:to-green-500/10 dark:text-green-300",
        orange: "from-orange-50 to-orange-100 text-orange-700 dark:from-orange-500/20 dark:to-orange-500/10 dark:text-orange-300",
        yellow: "from-yellow-50 to-amber-100 text-amber-700 dark:from-amber-500/20 dark:to-amber-500/10 dark:text-amber-300",
    };

    const bgClass = colorClasses[item.color as keyof typeof colorClasses] || colorClasses.purple;

    return (
        <div className={`text-center p-3 rounded-xl bg-gradient-to-br ${bgClass} hover:scale-105 transition-transform`}>
            <div className="flex items-center justify-center gap-1.5 mb-0.5">
                {item.icon}
                <div className="font-semibold text-xs">{item.title}</div>
            </div>

            <div className="text-xl font-black">{item.value}</div>
        </div>
    );
});

export default BonusCard;