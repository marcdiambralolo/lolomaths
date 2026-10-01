'use client';
import Section from './Section';

const SectionsList = ({ sections }: { sections: any[] }) => (
    <div className="px-6">
        {sections.map((section, idx) => (
            <Section
                key={section.number + idx}
                number={section.number}
                title={section.title}
                icon={section.icon}
                iconColor={section.iconColor}
            >
                {section.content}
            </Section>
        ))}
    </div>
);

export default SectionsList;