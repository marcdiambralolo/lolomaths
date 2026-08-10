"use client";
import { Brain, Calculator, Zap } from 'lucide-react';

const GameFlow = () => (
    <section id="jeu" className="mt-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-300">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-800 flex items-center justify-center gap-3">
                <Zap className="w-8 h-8 text-orange-500" />
                ⚡ Déroulement du jeu
            </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-6 hover:shadow-xl transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center mb-4 shadow-lg">
                        <Calculator className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-green-800 mb-2">Validation</h3>
                    <p className="text-green-600">Une combinaison valide affiche un carré jaune indiquant le nombre à atteindre et une icône pour choisir le sens de calcul.</p>
                </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 p-6 hover:shadow-xl transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-4 shadow-lg">
                        <Brain className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-blue-800 mb-2">Calcul</h3>
                    <p className="text-blue-600">Le calcul s&apos;effectue opération par opération de l&apos;autre extrémité vers le nombre visé. Une boîte de dialogue valide le jeu.</p>
                </div>
            </div>
        </div>
    </section>
);

export default GameFlow; 