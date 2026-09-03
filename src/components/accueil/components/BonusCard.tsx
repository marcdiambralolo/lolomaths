"use client";
import { colorClasses } from "@/components/about/components/about.constants";

function BonusCard({ icon, title, value, color = "purple" }: { icon: React.ReactNode; title: string; value: string; color?: string }) {

    const bgClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.purple;

    return (
        <div className={`text-center p-4 rounded-xl bg-gradient-to-br ${bgClass} hover:scale-105 transition-transform`}>
            <div className="flex items-center justify-center gap-2 mb-1">
                {icon}
                <div className="font-semibold text-sm">{title}</div>
            </div>

            <div className="text-2xl font-black">{value}</div>
        </div>
    );
}

export default BonusCard;