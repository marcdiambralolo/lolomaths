'use client';
import { Target } from "lucide-react";
import ConicPanel from "./ConicPanel";

const GameObjective = () => (
    <section id="but" className="mt-10 sm:mt-12 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-100">
        <ConicPanel>
            <h2 className="text-2xl font-black text-purple-900 flex items-center gap-2">
                <Target className="w-6 h-6 text-purple-600" />
                🎯 But du Jeu
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-purple-700">
                Effectuez à chaque tour une combinaison de pions dont le résultat calculé est le <span className="font-bold text-purple-600">plus approchant</span> ou <span className="font-bold text-purple-600">strictement égal</span> au nombre du plateau visé.
            </p>
        </ConicPanel>
    </section>
);

export default GameObjective;