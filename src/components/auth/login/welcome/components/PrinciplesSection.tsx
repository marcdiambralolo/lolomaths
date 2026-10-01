"use client";
import Pill from '@/components/accueil/components/Pill';
import { CONFIG } from './Config';
import SectionHeader from './SectionHeader';

const PrinciplesSection = () => (
    <section id="principe" className="mt-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-200">
        <SectionHeader title="📌 Principe du jeu Lolomaths" subtitle="Déplacez les éléments du plateau P2 pour reproduire le plateau P1" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CONFIG.PRINCIPLES.map((item, index) => (
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

export default PrinciplesSection;