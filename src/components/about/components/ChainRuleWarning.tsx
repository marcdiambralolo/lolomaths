'use client';
import { AlertCircle } from "lucide-react";

const ChainRuleWarning = () => (
    <section id="enchainement" className="mt-10 sm:mt-12 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-600">
        <div className="rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 p-5 border-2 border-orange-200">
            <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                    <h3 className="font-bold text-orange-800">⚠️ Règle importante d&apos;enchaînement</h3>
                    <p className="text-sm text-orange-700 mt-1">
                        Après le premier jeu, <span className="font-bold">tous les coups suivants doivent impérativement comporter</span> au moins un pion déjà placé lors d&apos;un jeu antérieur.
                    </p>
                </div>
            </div>
        </div>
    </section>
);

export default ChainRuleWarning;