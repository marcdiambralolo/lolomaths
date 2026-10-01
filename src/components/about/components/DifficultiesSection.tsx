"use client";
import ConicSection from "./ConicSection";
import { CONFIG } from "./Constantes";
import DifficultyBadge from "./DifficultyBadge";

const DifficultiesSection = () => (
    <ConicSection
        id="difficulte"
        headerTitle="📊 Niveaux de difficulté"
        headerSubtitle="Choisissez votre niveau, de 2×2 (débutant) à 10×10 (expert)."
    >
        <div className="mt-4 flex flex-wrap gap-2">
            {CONFIG.DIFFICULTIES.map((diff) => (
                <DifficultyBadge key={diff.level} level={diff.level} label={diff.label} />
            ))}
        </div>

        <p className="mt-3 text-sm text-purple-700">
            Plus le niveau est élevé, plus le nombre de cases à mémoriser et à déplacer est important.
        </p>
    </ConicSection>
);

export default DifficultiesSection;