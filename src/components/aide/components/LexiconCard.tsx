"use client";
import { LexiconItem } from '@/lib/lolomaths/interfaces';

const LexiconCard: React.FC<{ item: LexiconItem }> = ({ item }) => (
    <div className="group p-5 rounded-2xl bg-white/90 border border-gray-100/80 hover:border-indigo-100 shadow-sm hover:shadow-lg transition-all duration-300">
        <div className="inline-block px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs mb-3 group-hover:bg-indigo-100 transition-colors">
            {item.term}
        </div>

        <p className="text-gray-600 text-sm leading-relaxed">{item.definition}</p>
    </div>
);

export default LexiconCard;