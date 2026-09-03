'use client';
import Pill from "./Pill";
import SectionHeader from "./SectionHeader";

const LEXIQUE = [
    {
        id: 'operateurs',
        icon: <div className="text-sm font-bold">+ − × ÷</div>,
        title: 'Opérateurs',
        desc: "Signes d'Addition (+), Soustraction (−), Multiplication (×) et Division (÷).",
    },
    {
        id: 'plateau',
        icon: <div className="text-sm">🎯</div>,
        title: 'Plateau',
        desc: 'Cases comportant des nombres et une case "Départ".',
    },
    {
        id: 'pions_nombre',
        icon: <div className="text-sm">🔢</div>,
        title: 'Pions de nombre',
        desc: 'Pions marqués de nombres (6 pions par jeu).',
    },
    {
        id: 'pions_operateur',
        icon: <div className="text-sm">➗</div>,
        title: "Pions d'opérateur",
        desc: "Pions marqués d'opérateurs (6 pions par jeu).",
    },
    {
        id: 'nombres_plateau',
        icon: <div className="text-sm">📊</div>,
        title: 'Nombres du plateau',
        desc: 'Nombres inscrits dans les cases du plateau.',
    },
    {
        id: 'combinaison',
        icon: <div className="text-sm">🧩</div>,
        title: 'Combinaison de pions',
        desc: "Agencement (en ligne ou colonne) de pion(s) de nombre et d'opérateur. Débute et finit par un pion de nombre.",
    },
    {
        id: 'jeu',
        icon: <div className="text-sm">🎮</div>,
        title: 'Jeu',
        desc: 'Combinaison de pions validée.',
    },
    {
        id: 'match',
        icon: <div className="text-sm">🏆</div>,
        title: 'Match',
        desc: 'Ensemble de jeux.',
    },
];

const Lexicon = () => (
    <section id="lexique">
        <SectionHeader
            badge="Lexique"
            title="📚 Le vocabulaire essentiel"
            subtitle="Pour bien comprendre le plateau et vos pièces"
        />

        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
            {LEXIQUE.map((item, index) => (
                <Pill
                    key={item.id}
                    icon={item.icon}
                    title={item.title}
                    desc={item.desc}
                    delay={index * 40}
                />
            ))}
        </div>
    </section>
);

export default Lexicon;