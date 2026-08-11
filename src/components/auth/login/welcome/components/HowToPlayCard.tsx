'use client';
import { MousePointerClick } from 'lucide-react';
import { memo } from 'react';

const cardBaseClass =
    'relative overflow-hidden rounded-2xl border border-purple-100/80 bg-white/90 shadow-[0_10px_30px_rgba(109,40,217,0.08)] backdrop-blur-sm transition-all duration-300 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_10px_30px_rgba(80,50,180,0.20)]';

const HowToPlayCard = memo(function HowToPlayCard() {
    return (
        <div className={`${cardBaseClass} p-5 sm:p-6`}>
            <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-400/10" />

            <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-400/10" />

            <div className="relative">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">
                    <MousePointerClick className="h-3.5 w-3.5" />
                    Mode Clic
                </div>

                <p className="text-sm leading-7 text-slate-700 sm:text-[15px] dark:text-slate-200">
                    Sélectionnez un chiffre, puis cliquez sur une case vide pour le placer.
                </p>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-white/80 px-4 py-3 text-left shadow-sm dark:bg-white/5">
                        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-purple-500">
                            Étape 1
                        </div>
                        <div className="mt-1 text-sm font-semibold text-slate-800 dark:text-white">
                            Choisir un chiffre
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white/80 px-4 py-3 text-left shadow-sm dark:bg-white/5">
                        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-indigo-500">
                            Étape 2
                        </div>
                        <div className="mt-1 text-sm font-semibold text-slate-800 dark:text-white">
                            Placer sur le plateau
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white/80 px-4 py-3 text-left shadow-sm dark:bg-white/5">
                        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-fuchsia-500">
                            Étape 3
                        </div>
                        <div className="mt-1 text-sm font-semibold text-slate-800 dark:text-white">
                            Valider la combinaison
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default HowToPlayCard;