"use client";
import { BookOpen } from 'lucide-react';
import Pill from './Pill';

const GameLexicon = () => {
    const lexiconItems = [
        {
            icon: <div className="text-xl font-bold">+ − × ÷</div>,
            title: "Opérateurs",
            desc: "Signes d'Addition (+), Soustraction (−), Multiplication (×) et Division (÷).",
            delay: 0
        },
        {
            icon: <div className="text-xl">🎯</div>,
            title: "Plateau",
            desc: "Cases comportant des nombres et une case 'Départ'.",
            delay: 50
        },
        {
            icon: <div className="text-xl">🔢</div>,
            title: "Pions de nombre",
            desc: "Pions marqués de nombres (6 pions par jeu).",
            delay: 100
        },
        {
            icon: <div className="text-xl">➗</div>,
            title: "Pions d'opérateur",
            desc: "Pions marqués d'opérateurs (4 pions par jeu).",
            delay: 150
        },
        {
            icon: <div className="text-xl">📊</div>,
            title: "Nombres du plateau",
            desc: "Nombres inscrits dans les cases du plateau.",
            delay: 200
        },
        {
            icon: <div className="text-xl">🧩</div>,
            title: "Combinaison de pions",
            desc: "Agencement (en ligne ou colonne) de pion(s) de nombre et d'opérateur. Débute et finit par un pion de nombre.",
            delay: 250
        }
    ];

    return (
        <section id="lexique" className="mt-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-400">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-gray-800 flex items-center justify-center gap-3">
                    <BookOpen className="w-8 h-8 text-purple-600" />
                    📚 Lexique du jeu
                </h2>
                <p className="text-gray-500 mt-2">Le vocabulaire essentiel pour bien comprendre le plateau et vos pièces.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {lexiconItems.map((item, index) => (
                    <Pill
                        key={index}
                        icon={item.icon}
                        title={item.title}
                        desc={item.desc}
                        delay={item.delay}
                    />
                ))}
            </div>
        </section>
    );
};

export default GameLexicon;