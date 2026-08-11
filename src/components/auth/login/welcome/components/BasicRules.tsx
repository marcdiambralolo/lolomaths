'use client';
import Pill from "./Pill";
import SectionHeader from "./SectionHeader";

const RULES = [
    {
        id: 'alternance_nombres',
        icon: <div className="text-sm font-bold">1,3,5</div>,
        title: 'Alternance des nombres',
        desc: 'Pas de juxtaposition de deux pions de nombre.',
        tooltip: 'Les nombres doivent être séparés par des opérateurs.',
    },
    {
        id: 'alternance_operateurs',
        icon: <div className="text-sm font-bold">+ − × ÷</div>,
        title: 'Alternance des opérateurs',
        desc: "Pas de juxtaposition de deux pions d'opérateur.",
        tooltip: 'Les opérateurs doivent être séparés par des nombres.',
    },
    {
        id: 'fermeture_propre',
        icon: <div className="text-sm">🚫</div>,
        title: 'Fermeture propre',
        desc: "Pas de mise d'un pion d'opérateur en bout de combinaison.",
        tooltip: 'Une combinaison doit commencer et finir par un nombre.',
    },
    {
        id: 'emplacement_unique',
        icon: <div className="text-sm">📍</div>,
        title: 'Emplacement unique',
        desc: 'Pas de superposition de pions sur la même case.',
        tooltip: 'Chaque case ne peut contenir qu\'un seul pion.',
    },
];

const BasicRules = () => (
    <section id="regles">
        <SectionHeader
            badge="Règles élémentaires"
            title="🎮 Comment jouer ?"
            subtitle="Placez votre première combinaison depuis la case 'Départ' en respectant ces 4 règles"
        />
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
            {RULES.map((item, index) => (
                <Pill
                    key={item.id}
                    icon={item.icon}
                    title={item.title}
                    desc={item.desc}
                    tooltip={item.tooltip}
                    delay={index * 60}
                />
            ))}
        </div>
    </section>
);

export default BasicRules;