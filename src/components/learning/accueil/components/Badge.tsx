'use client';

const Badge = () => (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md mb-4">
        <span className="text-sm">🏆</span>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/90">
            Compétition Précédente
        </span>
    </div>
);

export default Badge;