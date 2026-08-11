'use client';
import { Brain, Calculator, Zap } from "lucide-react";
import ConicPanel from "./ConicPanel";

const GameFlow = () => {
    const flowSteps = [
        {
            icon: <Calculator className="w-4 h-4 text-white" />,
            title: "Validation",
            description: "Une combinaison valide affiche un carré jaune indiquant le nombre à atteindre et une icône pour choisir le sens de calcul.",
            bg: "from-green-50 to-emerald-50",
            iconBg: "bg-green-600",
            titleColor: "text-green-800",
            textColor: "text-green-700"
        },
        {
            icon: <Brain className="w-4 h-4 text-white" />,
            title: "Calcul",
            description: "Le calcul s'effectue opération par opération de l'autre extrémité vers le nombre visé. Une boîte de dialogue valide le jeu.",
            bg: "from-blue-50 to-cyan-50",
            iconBg: "bg-blue-600",
            titleColor: "text-blue-800",
            textColor: "text-blue-700"
        }
    ];

    return (
        <section id="deroulement" className="mt-10 sm:mt-12 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-300">
            <ConicPanel>
                <h2 className="text-2xl font-black text-purple-900 flex items-center gap-2">
                    <Zap className="w-6 h-6 text-orange-500" />
                    ⚡ Déroulement du jeu
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {flowSteps.map((step, index) => (
                        <div key={index} className={`rounded-2xl bg-gradient-to-br ${step.bg} p-4`}>
                            <div className="flex items-center gap-2 mb-2">
                                <div className={`w-8 h-8 rounded-lg ${step.iconBg} flex items-center justify-center`}>
                                    {step.icon}
                                </div>
                                <h3 className={`font-bold ${step.titleColor}`}>{step.title}</h3>
                            </div>
                            <p className={`text-sm ${step.textColor}`}>{step.description}</p>
                        </div>
                    ))}
                </div>
            </ConicPanel>
        </section>
    );
};

export default GameFlow;