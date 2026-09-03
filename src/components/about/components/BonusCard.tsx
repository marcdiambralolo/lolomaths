"use client";

import { colorClasses } from "./about.constants";

function BonusCard({ icon, title, value, color = "purple" }: { icon: React.ReactNode; title: string; value: string; color?: string }) {

    const bgClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.purple;

    return (
        <div className={`text-center p-3 rounded-xl bg-gradient-to-br ${bgClass} hover:scale-105 transition-transform`}>
            <div className="flex items-center justify-center gap-1.5 mb-0.5">
                {icon}
                <div className="font-semibold text-xs">{title}</div>
            </div>
            <div className="text-xl font-black">{value}</div>
        </div>
    );
}

export default BonusCard;