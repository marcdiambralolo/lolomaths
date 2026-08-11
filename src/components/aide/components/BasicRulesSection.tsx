'use client';
import SectionHeader from './SectionHeader';
import RuleCard from './RuleCard';
import { BASIC_RULES } from './constants';

const BasicRulesSection = () => (
    <section className="space-y-6">
        <SectionHeader
            icon="🎮"
            title="Comment jouer ?"
            subtitle="Placez votre première combinaison depuis la case 'Départ' en respectant ces 4 règles élémentaires."
        />

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
            {BASIC_RULES.map((rule, idx) => (
                <RuleCard key={idx} rule={rule} />
            ))}
        </div>
    </section>
);

export default BasicRulesSection;