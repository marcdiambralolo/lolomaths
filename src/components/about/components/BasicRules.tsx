'use client';
import { RULES_DATA } from './about.constants';
import Pill from './Pill';

const BasicRules = () => (
    <section id="regles" className="mt-10 sm:mt-12 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-200">
        <div className="mb-4 text-center">
            <h2 className="text-2xl font-black text-purple-900">🎮 Comment jouer ?</h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-purple-600">
                Placez votre première combinaison depuis la case &apos;Départ&apos; en respectant ces 4 règles élémentaires
            </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {RULES_DATA.map((rule, index) => (
                <Pill
                    key={index}
                    icon={<div className="text-sm font-bold">{rule.icon}</div>}
                    title={rule.title}
                    desc={rule.desc}
                    tooltip={rule.tooltip}
                />
            ))}
        </div>
    </section>
);

export default BasicRules;