"use client";
import { Gamepad2 } from 'lucide-react';
import Pill from './Pill';

const GameRules = () => {
    const rules = [
        {
            icon: <div className="text-xl font-bold">1,3,5</div>,
            title: "Alternance des nombres",
            desc: "Pas de juxtaposition de deux pions de nombre.",
            tooltip: "Les nombres doivent être séparés par des opérateurs",
            delay: 0
        },
        {
            icon: <div className="text-xl font-bold">+ − × ÷</div>,
            title: "Alternance des opérateurs",
            desc: "Pas de juxtaposition de deux pions d'opérateur.",
            tooltip: "Les opérateurs doivent être séparés par des nombres",
            delay: 50
        },
        {
            icon: <div className="text-xl">🚫</div>,
            title: "Fermeture propre",
            desc: "Pas de mise d'un pion d'opérateur en bout de combinaison.",
            tooltip: "Une combinaison doit commencer et finir par un nombre",
            delay: 100
        },
        {
            icon: <div className="text-xl">📍</div>,
            title: "Emplacement unique",
            desc: "Pas de superposition de pions sur la même case.",
            tooltip: "Chaque case ne peut contenir qu'un seul pion",
            delay: 150
        }
    ];

    return (
        <section id="regles" className="mt-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-200">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-gray-800 flex items-center justify-center gap-3">
                    <Gamepad2 className="w-8 h-8 text-indigo-600" />
                    🎮 Comment jouer ?
                </h2>
                <p className="text-gray-500 mt-2">Placez votre première combinaison depuis la case &apos;Départ&apos; en respectant ces 4 règles élémentaires</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {rules.map((rule, index) => (
                    <Pill
                        key={index}
                        icon={rule.icon}
                        title={rule.title}
                        desc={rule.desc}
                        tooltip={rule.tooltip}
                        delay={rule.delay}
                    />
                ))}
            </div>
        </section>
    );
};

export default GameRules;