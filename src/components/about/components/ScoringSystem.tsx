'use client';
import { Award, Info } from "lucide-react";
import ConicPanel from "./ConicPanel";
import { BONUS_DATA, SCORE_METRICS } from "./about.constants";
import BonusCard from "./BonusCard";

const ScoringSystem = () => (
    <section id="notation" className="mt-10 sm:mt-12 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-500">
        <ConicPanel>
            <h2 className="text-2xl font-black text-purple-900 flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-500" />
                📊 Système de notation & Bonus
            </h2>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div className="bg-purple-50/50 rounded-xl p-4">
                    <h3 className="font-bold text-purple-800 mb-2 flex items-center gap-1">
                        <span className="text-sm">a)</span> Note de base
                    </h3>
                    <p className="text-sm text-purple-700">
                        La note de base correspond à l&apos;écart négatif entre votre résultat calculé et le nombre à atteindre.
                    </p>
                    <div className="mt-2 bg-white/60 rounded-lg p-2 text-xs text-purple-600 flex items-start gap-1.5">
                        <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                        <span>La note de base est donc toujours négative ou égale à 0 (en cas d&apos;égalité parfaite).</span>
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-purple-800 mb-2 flex items-center gap-1">
                        <span className="text-sm">b)</span> Grille des Bonus
                    </h3>
                    <div className="grid grid-cols-2 gap-1.5">
                        {BONUS_DATA.map((bonus, index) => (
                            <BonusCard
                                key={index}
                                icon={<span className="text-sm font-bold">{bonus.icon}</span>}
                                title={bonus.title}
                                value={bonus.value}
                                color={bonus.color}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {SCORE_METRICS.map((metric, index) => (
                    <div key={index} className={`text-center p-3 rounded-xl ${metric.gradient}`}>
                        <div className="text-2xl mb-1">{metric.icon}</div>
                        <div className={`font-bold text-sm ${metric.titleColor}`}>{metric.title}</div>
                        <div className={`text-xs ${metric.descColor} mt-0.5`}>{metric.description}</div>
                    </div>
                ))}
            </div>
        </ConicPanel>
    </section>
);

export default ScoringSystem;