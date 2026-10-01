"use client";
import { CONFIG } from "./Constantes";
import PillGrid from "./PillGrid";
import PlainSection from "./PlainSection";

const ModesSection = () => (
    <PlainSection
        id="modes"
        headerTitle="🎨 Modes de jeu"
        headerSubtitle="Variété de défis"
    >
        <PillGrid items={CONFIG.MODES} />
    </PlainSection>
);

export default ModesSection;