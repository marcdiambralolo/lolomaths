"use client";
import { AlertCircle } from 'lucide-react';

const ChainRuleWarning = () => (
    <section className="mt-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-600">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 p-8 border-2 border-orange-200">
            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/5 rounded-full blur-2xl" />

            <div className="relative flex items-start gap-4">
                <AlertCircle className="w-8 h-8 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                    <h3 className="text-xl font-bold text-orange-800">⚠️ Règle importante d&apos;enchaînement</h3>
                    <p className="text-orange-700 mt-2">
                        Après le premier jeu, <span className="font-bold">tous les coups suivants doivent impérativement comporter</span> au moins un pion déjà placé lors d&apos;un jeu antérieur.
                    </p>
                </div>
            </div>
        </div>
    </section>
);

export default ChainRuleWarning; 