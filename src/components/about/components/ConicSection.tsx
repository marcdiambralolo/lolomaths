"use client";
import ConicPanel from "./ConicPanel";
import Section from "./Section";
import SectionHeader from "./SectionHeader";

interface SectionProps {
    id?: string;
    className?: string;
    children: React.ReactNode;
}

interface ConicSectionProps extends SectionProps {
    headerTitle: string;
    headerSubtitle?: string;
}

function ConicSection({ id, headerTitle, headerSubtitle, children }: ConicSectionProps) {
    return (
        <Section id={id}>
            <ConicPanel>
                <SectionHeader title={headerTitle} subtitle={headerSubtitle} />
                {children}
            </ConicPanel>
        </Section>
    );
}

export default ConicSection;