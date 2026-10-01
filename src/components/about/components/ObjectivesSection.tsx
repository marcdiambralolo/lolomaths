"use client";
import ConicSection from "./ConicSection";
import { CONFIG } from "./Constantes";
import FeatureGrid from "./FeatureGrid";

const ObjectivesSection = () => (
    <ConicSection id="objectifs" headerTitle="🎯 Objectifs du jeu">
        <FeatureGrid items={CONFIG.OBJECTIVES} />
    </ConicSection>
);

export default ObjectivesSection;