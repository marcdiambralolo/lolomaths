"use client";
import { CONFIG } from './Config';
import Pill from './Pill';
import { SectionHeader } from './SectionHeader';

const ModesSection = () => (
    <section id="modes" className="mt-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-400">
        <SectionHeader title="🎨 Modes de jeu Lolomaths" subtitle="Variété de défis pour tous les goûts" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CONFIG.MODES.map((item, index) => (
                <Pill
                    key={item.title}
                    icon={<item.icon className="h-5 w-5" />}
                    title={item.title}
                    desc={item.desc}
                    tooltip={item.tooltip}
                    delay={index * 50}
                />
            ))}
        </div>
    </section>
);

export default ModesSection;