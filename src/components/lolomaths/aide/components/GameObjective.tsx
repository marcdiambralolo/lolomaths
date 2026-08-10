'use client';

const GameObjective = () => (
    <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 text-white shadow-2xl shadow-indigo-600/15 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-indigo-400/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
            <div className="text-4xl">🎯</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">But du Jeu</h2>
            <p className="text-indigo-100 text-base sm:text-lg leading-relaxed max-w-3xl font-medium">
                Effectuez à chaque tour une combinaison de pions dont le résultat calculé est le
                <strong className="text-white bg-white/15 px-2.5 py-0.5 rounded-md mx-1 font-bold">
                    plus approchant
                </strong>
                ou
                <strong className="text-white bg-white/15 px-2.5 py-0.5 rounded-md mx-1 font-bold">
                    strictement égal
                </strong>
                au nombre du plateau visé.
            </p>
        </div>
    </section>
);

export default GameObjective;