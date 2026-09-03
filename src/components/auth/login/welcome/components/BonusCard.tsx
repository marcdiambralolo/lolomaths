'use client';
import { colorClasses } from '@/components/about/components/about.constants';
import React, { memo } from 'react';

type BonusItem = {
    id: string;
    icon: React.ReactNode;
    title: string;
    value: string;
    color: string;
};

const BonusCard = memo(function BonusCard({ item }: { item: BonusItem }) {
   
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