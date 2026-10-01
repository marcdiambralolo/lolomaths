"use client";
import Section from "./Section";
import SectionHeader from "./SectionHeader";

interface SectionProps {
    id?: string;
    className?: string;
    children: React.ReactNode;
}

interface PlainSectionProps extends SectionProps {
    headerTitle: string;
    headerSubtitle?: string;
}

function PlainSection({ id, headerTitle, headerSubtitle, children }: PlainSectionProps) {

    return (
        <Section id={id}>
            <SectionHeader title={headerTitle} subtitle={headerSubtitle} />
            {children}
        </Section>
    );
}

export default PlainSection;