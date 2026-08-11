'use client';
import SectionHeader from "./SectionHeader";

const CARD_BASE_CLASS =
    'relative overflow-hidden rounded-2xl border border-purple-100/80 bg-white/90 shadow-[0_10px_30px_rgba(109,40,217,0.08)] backdrop-blur-sm transition-all duration-300 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_10px_30px_rgba(80,50,180,0.20)]';

const CardContainer: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className = '' }) => (
    <div className={`${CARD_BASE_CLASS} p-5 sm:p-6 ${className}`}>
        {children}
    </div>
);

const GameObjective = () => (
    <section id="but">
        <SectionHeader badge="But du jeu" title="🎯 Objectif" />

        <CardContainer className="text-center">
            <p className="text-sm leading-relaxed text-slate-700 sm:text-[15px] dark:text-slate-200">
                Effectuez à chaque tour une combinaison de pions dont le résultat calculé est le{' '}
                <span className="font-bold text-purple-600 dark:text-purple-400">plus approchant</span> ou{' '}
                <span className="font-bold text-purple-600 dark:text-purple-400">strictement égal</span> au nombre du plateau visé.
            </p>
        </CardContainer>
    </section>
);

export default GameObjective;