"use client";

function BonusCard({ icon, title, value, color = "purple" }: { icon: React.ReactNode; title: string; value: string; color?: string }) {
    const colorClasses = {
        purple: "from-purple-50 to-purple-100 text-purple-700",
        indigo: "from-indigo-50 to-indigo-100 text-indigo-700",
        pink: "from-pink-50 to-pink-100 text-pink-700",
        green: "from-green-50 to-green-100 text-green-700",
        orange: "from-orange-50 to-orange-100 text-orange-700",
        yellow: "from-yellow-50 to-amber-100 text-amber-700",
    };

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