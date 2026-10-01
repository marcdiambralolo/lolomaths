"use client";
import { Clock, Trophy, } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

const EvaluationSection = () => (
    <section id="evaluation" className="mt-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-600">
        <SectionHeader title="⏱️ Évaluation et classement" subtitle="Votre performance mesurée" />
        <div className="rounded-3xl bg-white p-6 shadow-lg border border-purple-100">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 p-5">
                    <div className="flex items-center gap-3">
                        <Clock className="h-8 w-8 text-purple-600" />
                        <div>
                            <p className="font-bold text-purple-900">Temps écoulé</p>
                            <p className="text-sm text-purple-700">Mesuré du début à la fin du match</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 p-5">
                    <div className="flex items-center gap-3">
                        <Trophy className="h-8 w-8 text-indigo-600" />
                        <div>
                            <p className="font-bold text-indigo-900">Score & Classement</p>
                            <p className="text-sm text-indigo-700">Comparez vos résultats et défiez vos amis</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default EvaluationSection;