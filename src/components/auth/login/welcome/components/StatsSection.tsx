'use client';
import SectionHeader from "./SectionHeader";
import StatCard from "./StatCard";

type StatItem = {
    id: string;
    value: string;
    label: string;
    gradient: string;
    textColor: string;
    glow: string;
};

const STATS: StatItem[] = [
    {
        id: 'pions_nombre',
        value: '6',
        label: 'pions de nombre',
        gradient: 'from-purple-500/15 via-fuchsia-500/10 to-indigo-500/15',
        textColor: 'text-purple-700 dark:text-purple-300',
        glow: 'shadow-purple-500/10',
    },
    {
        id: 'pions_operateur',
        value: '4',
        label: 'pions d\'opérateur',
        gradient: 'from-indigo-500/15 via-blue-500/10 to-cyan-500/15',
        textColor: 'text-indigo-700 dark:text-indigo-300',
        glow: 'shadow-indigo-500/10',
    },
    {
        id: 'total_pions',
        value: '10',
        label: 'pions au total',
        gradient: 'from-fuchsia-500/15 via-violet-500/10 to-purple-500/15',
        textColor: 'text-fuchsia-700 dark:text-fuchsia-300',
        glow: 'shadow-fuchsia-500/10',
    },
];

const StatsSection = () => (
    <section id="stats">
        <SectionHeader badge="Le jeu en chiffres" title="📊 Les chiffres clés" />
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
            {STATS.map((item) => (
                <StatCard key={item.id} item={item} />
            ))}
        </div>
    </section>
);

export default StatsSection;