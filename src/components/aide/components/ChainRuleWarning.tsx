'use client';

const ChainRuleWarning = () => (
    <section className="p-6 sm:p-7 rounded-3xl bg-amber-50/80 border-2 border-amber-200/60 shadow-sm space-y-3">
        <div className="flex items-center gap-3 text-amber-900 font-bold text-base">
            <span className="text-2xl">⚠️</span>
            <h3>Règle importante d'enchaînement</h3>
        </div>

        <p className="text-amber-800 text-sm leading-relaxed font-medium pl-10">
            Après le premier jeu, tous les coups suivants doivent impérativement comporter
            <strong className="text-amber-950 underline decoration-amber-300 underline-offset-2 mx-1">
                au moins un pion déjà placé
            </strong>
            lors d'un jeu antérieur.
        </p>
    </section>
);

export default ChainRuleWarning;