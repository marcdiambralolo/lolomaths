"use client";
import { Award } from "lucide-react";
import ConicSection from "./ConicSection";

const EvaluationSection = () => (
    <ConicSection id="evaluation" headerTitle="⏱️ Évaluation et classement">
        <p className="mt-3 text-sm leading-relaxed text-purple-700">
            Votre performance est mesurée par le temps écoulé entre le début et la fin du match.
            Plus vous êtes rapide et précis, meilleur sera votre score.
        </p>

        <div className="mt-4 flex items-center gap-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
            <Award className="h-8 w-8 text-purple-600" />
            <div>
                <p className="text-sm font-bold text-purple-900">Comparez vos résultats</p>
                <p className="text-sm text-purple-700">Défiez vos amis et devenez le champion !</p>
            </div>
        </div>
    </ConicSection>
);

export default EvaluationSection;