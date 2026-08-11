'use client';
import SectionHeader from './SectionHeader';
import LexiconCard from './LexiconCard';
import { LEXICON_DATA } from './constants';

const LexiconSection = () => (
    <section className="space-y-6">
        <SectionHeader
            icon="📚"
            title="Lexique du jeu"
            subtitle="Le vocabulaire essentiel pour bien comprendre le plateau et vos pièces."
        />

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
            {LEXICON_DATA.map((item, idx) => (
                <LexiconCard key={idx} item={item} />
            ))}
        </div>
    </section>
);

export default LexiconSection;