"use client";

const ScoreMetric: React.FC<{
    label: string;
    formula: string;
    icon: string;
    accentColor: 'blue' | 'emerald' | 'violet'
}> = ({ label, formula, icon, accentColor }) => {
    const colorStyles = {
        blue: 'bg-blue-50/80 border-blue-100 text-blue-700',
        emerald: 'bg-emerald-50/80 border-emerald-100 text-emerald-700',
        violet: 'bg-violet-50/80 border-violet-100 text-violet-700',
    };

    return (
        <div className={`p-6 rounded-2xl border bg-white/90 backdrop-blur-sm ${colorStyles[accentColor]} text-center shadow-sm hover:shadow-md transition-all`}>
            <div className="text-2xl mb-2">{icon}</div>
            <span className="text-xs uppercase tracking-wider font-bold opacity-80">{label}</span>
            <div className="text-lg font-black mt-1.5">{formula}</div>
        </div>
    );
};

export default ScoreMetric;