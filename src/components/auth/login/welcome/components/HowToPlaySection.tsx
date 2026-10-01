"use client";
import FeatureCard from '@/components/accueil/components/FeatureCard';
import { CONFIG } from './Config';
import SectionHeader from './SectionHeader';

const HowToPlaySection = () => (
    <section id="jeu" className="mt-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-300">
        <SectionHeader title="🎮 Comment jouer ?" subtitle="Suivez ces étapes pour réussir" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CONFIG.STEPS.map((item, index) => (
                <FeatureCard key={item.title} icon={<item.icon className="h-5 w-5" />} title={item.title} delay={index * 50}>
                    {item.desc}
                </FeatureCard>
            ))}
        </div>
    </section>
);

export default HowToPlaySection;