'use client';
import SectionHeader from './SectionHeader';

const GameFlowSection = () => {
    const flowSteps = [
        {
            icon: '✅',
            title: 'Validation',
            description: (
                <>
                    Une combinaison valide affiche un <strong className="text-amber-900">carré jaune</strong> indiquant
                    le nombre à atteindre et une icône pour choisir le sens de calcul.
                </>
            ),
            color: 'amber'
        },
        {
            icon: '🧮',
            title: 'Calcul',
            description: (
                <>
                    Le calcul s'effectue opération par opération de l'autre extrémité vers le nombre visé.
                    Une boîte de dialogue valide le jeu.
                </>
            ),
            color: 'indigo'
        }
    ];

    return (
        <section className="p-7 sm:p-8 rounded-3xl bg-white/90 border border-gray-100/80 shadow-sm backdrop-blur-sm space-y-6">
            <SectionHeader
                icon="⚡"
                title="Déroulement du jeu"
                className="mb-0"
            />

            <div className="grid md:grid-cols-2 gap-5">
                {flowSteps.map((step, index) => (
                    <div
                        key={index}
                        className={`p-5 rounded-2xl bg-${step.color}-50/70 border border-${step.color}-100/80 space-y-2.5`}
                    >
                        <div className={`flex items-center gap-2 text-${step.color}-800 font-bold text-sm`}>
                            <span className={`w-2 h-2 rounded-full bg-${step.color}-500 animate-pulse`} />
                            <span>{step.title}</span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {step.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default GameFlowSection;