"use client";
import FeatureCard from '@/components/accueil/components/FeatureCard';
import { CONFIG } from './Config';
import SectionHeader from './SectionHeader';

const ObjectivesSection = () => (
    <section className="mt-2 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-100">
        <SectionHeader title="🎯 Objectifs du jeu Lolomaths" subtitle="Ce que vous allez développer" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {CONFIG.OBJECTIVES.map((item, index) => (
                <FeatureCard key={item.title} icon={<item.icon className="h-5 w-5" />} title={item.title} delay={index * 50}>
                    {item.desc}
                </FeatureCard>
            ))}
        </div>
    </section>
);

export default ObjectivesSection;