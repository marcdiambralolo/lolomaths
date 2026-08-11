'use client';
import { Brain, Calculator } from "lucide-react";
import SectionHeader from "./SectionHeader";

const CARD_BASE_CLASS =
    'relative overflow-hidden rounded-2xl border border-purple-100/80 bg-white/90 shadow-[0_10px_30px_rgba(109,40,217,0.08)] backdrop-blur-sm transition-all duration-300 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_10px_30px_rgba(80,50,180,0.20)]';

const FLOW_STEPS = [
    {
        icon: <Calculator className="h-3.5 w-3.5" />,
        title: 'Validation',
        description:
            'Une combinaison valide affiche un carré jaune indiquant le nombre à atteindre et une icône pour choisir le sens de calcul.',
        bgBlur: 'bg-green-500/10 dark:bg-green-400/10',
        badgeBg: 'bg-green-50 dark:bg-green-500/10',
        badgeText: 'text-green-700 dark:text-green-300',
    },
    {
        icon: <Brain className="h-3.5 w-3.5" />,
        title: 'Calcul',
        description:
            "Le calcul s'effectue opération par opération de l'autre extrémité vers le nombre visé. Une boîte de dialogue valide le jeu.",
        bgBlur: 'bg-blue-500/10 dark:bg-blue-400/10',
        badgeBg: 'bg-blue-50 dark:bg-blue-500/10',
        badgeText: 'text-blue-700 dark:text-blue-300',
    },
];

const GameFlow = () => (
    <section id="deroulement">
        <SectionHeader badge="Déroulement" title="⚡ Validation & Calcul" />

        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {FLOW_STEPS.map((step, index) => (
                <div key={index} className={CARD_BASE_CLASS}>
                    <div className={`absolute right-0 top-0 h-28 w-28 rounded-full ${step.bgBlur} blur-3xl`} />
                    <div className="relative p-5 sm:p-6">
                        <div className={`mb-3 inline-flex items-center gap-2 rounded-full ${step.badgeBg} px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] ${step.badgeText}`}>
                            {step.icon}
                            {step.title}
                        </div>
                        <p className="text-sm leading-relaxed text-slate-700 sm:text-[15px] dark:text-slate-200">
                            {step.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    </section>
);

export default GameFlow;