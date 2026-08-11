"use client";
import { BonusItem } from '@/lib/lolomaths/interfaces';

const BonusCard: React.FC<{ bonus: BonusItem }> = ({ bonus }) => (
    <div className="group p-4 rounded-2xl bg-gradient-to-br from-indigo-50/40 via-white to-violet-50/40 border border-indigo-100/60 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-300">
        <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-gray-700 leading-relaxed">
                {bonus.condition}
            </span>

            <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-extrabold text-sm shadow-md shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                +{bonus.points}
            </span>
        </div>
    </div>
);

export default BonusCard;