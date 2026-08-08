"use client";
import { LexiconItem, RuleItem, BonusItem } from '@/lib/lolomaths/interfaces';
import Link from 'next/link';
import { BASIC_RULES, LEXICON_DATA, BONUS_DATA } from './constants';

const SectionHeader: React.FC<{
    icon: string;
    title: string;
    subtitle?: string;
    className?: string;
}> = ({ icon, title, subtitle, className = '' }) => (
    <div className={`mb-8 ${className}`}>
        <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl shrink-0 text-indigo-600 shadow-sm">
                {icon}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                {title}
            </h2>
        </div>
        {subtitle && (
            <p className="text-gray-500 text-sm sm:text-base mt-2 ml-13 max-w-2xl leading-relaxed">
                {subtitle}
            </p>
        )}
    </div>
);

const RuleCard: React.FC<{ rule: RuleItem }> = ({ rule }) => (
    <div className="group p-5 rounded-2xl bg-white/90 border border-gray-100/80 shadow-sm hover:shadow-lg hover:border-indigo-200/60 transition-all duration-300">
        <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-sm mb-1">{rule.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{rule.description}</p>
            </div>
        </div>
    </div>
);

const LexiconCard: React.FC<{ item: LexiconItem }> = ({ item }) => (
    <div className="group p-5 rounded-2xl bg-white/90 border border-gray-100/80 hover:border-indigo-100 shadow-sm hover:shadow-lg transition-all duration-300">
        <div className="inline-block px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs mb-3 group-hover:bg-indigo-100 transition-colors">
            {item.term}
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">{item.definition}</p>
    </div>
);

const BonusCard: React.FC<{ bonus: BonusItem }> = ({ bonus }) => (
    <div className="group p-4 rounded-2xl bg-gradient-to-br from-indigo-50/40 via-white to-violet-50/40 border border-indigo-100/60 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-300">
        <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-gray-700 leading-relaxed">
                {bonus.condition}
            </span>
            <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-extrabold text-sm shadow-md shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                +{bonus.points}
            </span>
        </div>
    </div>
);

const ScoreMetric: React.FC<{
    label: string;
    formula: string;
    icon: string;
    accentColor: 'blue' | 'emerald' | 'violet'
}> = ({ label, formula, icon, accentColor }) => {
    const colorStyles = {
        blue: 'bg-blue-50/80 border-blue-100 text-blue-700',
        emerald: 'bg-emerald-50/80 border-emerald-100 text-emerald-700',
        violet: 'bg-violet-50/80 border-violet-100 text-violet-700',
    };

    return (
        <div className={`p-6 rounded-2xl border bg-white/90 backdrop-blur-sm ${colorStyles[accentColor]} text-center shadow-sm hover:shadow-md transition-all`}>
            <div className="text-2xl mb-2">{icon}</div>
            <span className="text-xs uppercase tracking-wider font-bold opacity-80">{label}</span>
            <div className="text-lg font-black mt-1.5">{formula}</div>
        </div>
    );
};

const Divider: React.FC = () => (
    <div className="relative my-12">
        <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200/60"></div>
        </div>
        <div className="relative flex justify-center">
            <span className="px-4 bg-white text-gray-300 text-sm">✦</span>
        </div>
    </div>
);

export default function HelpPage() {

    return (
        <main className="w-full max-w-4xl mx-auto bg-white pb-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
                <nav className="mb-10">
                    <Link
                        href="/star/lolomaths"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/90 border border-gray-200/80 text-sm font-semibold text-gray-600 hover:text-indigo-600 hover:border-indigo-300 shadow-sm backdrop-blur-sm transition-all group"
                    >
                        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Retour à l'accueil</span>
                    </Link>
                </nav>

                <header className="mb-14 space-y-5">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                        Règles du Jeu{' '}
                        <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                            & Aide
                        </span>
                    </h1>
                    <p className="text-gray-500 text-base sm:text-lg max-w-2xl font-medium leading-relaxed">
                        Tout ce qu'il faut savoir pour jouer, construire vos meilleures combinaisons
                        et maximiser votre score dans Lolomaths.
                    </p>
                </header>

                <div className="space-y-8">
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

                    <section className="space-y-6">
                        <SectionHeader
                            icon="🎮"
                            title="Comment jouer ?"
                            subtitle="Placez votre première combinaison depuis la case 'Départ' en respectant ces 4 règles élémentaires."
                        />
                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                            {BASIC_RULES.map((rule, idx) => (
                                <RuleCard key={idx} rule={rule} />
                            ))}
                        </div>
                    </section>

                    <section className="p-7 sm:p-8 rounded-3xl bg-white/90 border border-gray-100/80 shadow-sm backdrop-blur-sm space-y-6">
                        <SectionHeader
                            icon="⚡"
                            title="Déroulement du jeu"
                            className="mb-0"
                        />
                        <div className="grid md:grid-cols-2 gap-5">
                            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-100/80 space-y-2.5">
                                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                    <span>Validation</span>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Une combinaison valide affiche un <strong className="text-amber-900">carré jaune</strong> indiquant
                                    le nombre à atteindre et une icône pour choisir le sens de calcul.
                                </p>
                            </div>

                            <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100/80 space-y-2.5">
                                <div className="flex items-center gap-2 text-indigo-800 font-bold text-sm">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                    <span>Calcul</span>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Le calcul s'effectue opération par opération de l'autre extrémité vers le nombre visé.
                                    Une boîte de dialogue valide le jeu.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <SectionHeader
                            icon="📚"
                            title="Lexique du jeu"
                            subtitle="Le vocabulaire essentiel pour bien comprendre le plateau et vos pièces."
                        />
                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                            {LEXICON_DATA.map((item, idx) => (
                                <LexiconCard key={idx} item={item} />
                            ))}
                        </div>
                    </section>

                    <Divider />

                    <section className="space-y-8">
                        <SectionHeader
                            icon="📊"
                            title="Système de notation & Bonus"
                        />

                        <div className="p-6 sm:p-7 rounded-3xl bg-white/90 border border-gray-100/80 shadow-sm space-y-4">
                            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                                <span className="text-blue-600">a)</span> Note de base
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                La note de base correspond à <strong className="text-indigo-600">l'écart négatif</strong> entre
                                votre résultat calculé et le nombre à atteindre.
                            </p>
                            <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-100/80 text-blue-800 text-sm font-semibold flex items-start gap-3">
                                <span className="text-lg">ℹ️</span>
                                <span>La note de base est donc toujours <strong>négative ou égale à 0</strong> (en cas d'égalité parfaite).</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                                <span className="text-emerald-600">b)</span> Grille des Bonus
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {BONUS_DATA.map((bonus, idx) => (
                                    <BonusCard key={idx} bonus={bonus} />
                                ))}
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-4 pt-4">
                            <ScoreMetric
                                label="Note à un jeu"
                                formula="Note de base + Bonus"
                                icon="🎯"
                                accentColor="blue"
                            />
                            <ScoreMetric
                                label="Score d'un match"
                                formula="Cumul des notes"
                                icon="🏆"
                                accentColor="emerald"
                            />
                            <ScoreMetric
                                label="Score Compétition"
                                formula="Cumul des matchs"
                                icon="👑"
                                accentColor="violet"
                            />
                        </div>
                    </section>

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
                </div>
            </div>
        </main>
    );
}