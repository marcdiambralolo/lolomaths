"use client";
import { RuleItem } from '@/lib/lolomaths/interfaces';

const RuleCard: React.FC<{ rule: RuleItem }> = ({ rule }) => (
    <div className="group p-5 rounded-2xl bg-white/90 border border-gray-100/80 shadow-sm hover:shadow-lg hover:border-indigo-200/60 transition-all duration-300">
        <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-sm mb-1">{rule.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{rule.description}</p>
            </div>
        </div>
    </div>
);

export default RuleCard;