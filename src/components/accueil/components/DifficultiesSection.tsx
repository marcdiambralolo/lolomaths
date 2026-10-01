"use client";
import { CONFIG } from './Config';
import DifficultyBadge from './DifficultyBadge';
import { SectionHeader } from './SectionHeader';

const DifficultiesSection = () => (
    <section id="difficulte" className="mt-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-500">
        <SectionHeader title="📊 Niveaux de difficulté" subtitle="Choisissez votre niveau et progressez" />
        <div className="rounded-3xl bg-white p-6 shadow-lg border border-purple-100">
            <div className="flex flex-wrap gap-3 justify-center">
                {CONFIG.DIFFICULTIES.map((diff) => (
                    <DifficultyBadge key={diff.level} level={diff.level} label={diff.label} />
                ))}
            </div>
            <p className="mt-4 text-center text-sm text-purple-700">
                Plus le niveau est élevé, plus le nombre de cases à mémoriser et à déplacer est important.
                <br />
                <span className="font-semibold">Commencez petit et progressez à votre rythme !</span>
            </p>
        </div>
    </section>
);

export default DifficultiesSection;