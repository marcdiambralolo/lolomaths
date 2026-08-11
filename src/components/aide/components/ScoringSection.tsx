'use client';
import { BONUS_DATA } from './constants';
import BonusCard from './BonusCard';
import ScoreMetric from './ScoreMetric';
import SectionHeader from './SectionHeader';

const ScoringSection = () => (
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
);

export default ScoringSection;