"use client";
import { Target } from 'lucide-react';

const GameObjective = () => (
    <section className="mt-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-100">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-800 flex items-center justify-center gap-3">
                <Target className="w-8 h-8 text-purple-600" />
                🎯 But du Jeu
            </h2>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 text-center border border-purple-100">
            <p className="text-lg text-purple-800 font-medium max-w-3xl mx-auto">
                Effectuez à chaque tour une combinaison de pions dont le résultat calculé est le <span className="font-bold text-purple-600">plus approchant</span> ou <span className="font-bold text-purple-600">strictement égal</span> au nombre du plateau visé.
            </p>
        </div>
    </section>
);

export default GameObjective;