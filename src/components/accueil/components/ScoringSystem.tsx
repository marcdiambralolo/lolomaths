"use client";
import { Award, Info, Star } from 'lucide-react';
import BonusCard from './BonusCard';

const ScoringSystem = () => {
    const baseBonuses = [
        { icon: <Star className="w-4 h-4" />, title: "Égalité parfaite", value: "+5", color: "green" },
        { icon: <span>7</span>, title: "7 pions utilisés", value: "+1", color: "purple" },
        { icon: <span>8</span>, title: "8 pions utilisés", value: "+2", color: "indigo" },
        { icon: <span>9</span>, title: "9 pions utilisés", value: "+3", color: "pink" },
        { icon: <span>10</span>, title: "10 pions utilisés", value: "+4", color: "orange" },
        { icon: <span>≥30</span>, title: "Niveau 1 (≥30)", value: "+1", color: "purple" },
        { icon: <span>≥100</span>, title: "Niveau 2 (≥100)", value: "+1", color: "indigo" },
        { icon: <span>≥200</span>, title: "Niveau 3 (≥200)", value: "+1", color: "pink" },
        { icon: <span>≥300</span>, title: "Niveau 4 (≥300)", value: "+1", color: "orange" },
        { icon: <span>×÷</span>, title: "1ère × ou ÷", value: "+1", color: "green" }
    ];

    return (
        <section id="stats" className="mt-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-500">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-gray-800 flex items-center justify-center gap-3">
                    <Award className="w-8 h-8 text-yellow-500" />
                    📊 Système de notation & Bonus
                </h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
                    <h3 className="text-lg font-bold text-purple-800 mb-3 flex items-center gap-2">
                        <span className="text-xl">a)</span> Note de base
                    </h3>
                    <p className="text-purple-700">
                        La note de base correspond à l&apos;écart négatif entre votre résultat calculé et le nombre à atteindre.
                    </p>

                    <div className="mt-3 bg-purple-50 rounded-xl p-3 text-sm text-purple-600 flex items-start gap-2">
                        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>La note de base est donc toujours négative ou égale à 0 (en cas d&apos;égalité parfaite).</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
                    <h3 className="text-lg font-bold text-purple-800 mb-3 flex items-center gap-2">
                        <span className="text-xl">b)</span> Grille des Bonus
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        {baseBonuses.map((bonus, index) => (
                            <BonusCard
                                key={index}
                                icon={bonus.icon}
                                title={bonus.title}
                                value={bonus.value}
                                color={bonus.color}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-yellow-50 to-amber-100 hover:scale-105 transition-transform">
                    <div className="text-3xl mb-2">🎯</div>
                    <div className="font-bold text-amber-800">Note à un jeu</div>
                    <div className="text-sm text-amber-600 mt-1">Note de base + Bonus</div>
                </div>
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-100 hover:scale-105 transition-transform">
                    <div className="text-3xl mb-2">🏆</div>
                    <div className="font-bold text-blue-800">Score d&apos;un match</div>
                    <div className="text-sm text-blue-600 mt-1">Cumul des notes</div>
                </div>
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-100 hover:scale-105 transition-transform">
                    <div className="text-3xl mb-2">👑</div>
                    <div className="font-bold text-purple-800">Score Compétition</div>
                    <div className="text-sm text-purple-600 mt-1">Cumul des matchs</div>
                </div>
            </div>
        </section>
    );
};

export default ScoringSystem;