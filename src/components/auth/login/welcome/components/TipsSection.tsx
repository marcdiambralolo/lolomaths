"use client";
import { CONFIG } from './Config';
import SectionHeader from './SectionHeader';

const TipsSection = () => {
    const colorMap = {
        purple: "from-purple-50 to-purple-100 text-purple-700",
        indigo: "from-indigo-50 to-indigo-100 text-indigo-700",
    };

    return (
        <section id="conseils" className="mt-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-700">
            <SectionHeader title="💡 Conseils pratiques" subtitle="Astuces pour améliorer vos performances" />
            <div className="grid gap-4 sm:grid-cols-2">
                {CONFIG.TIPS.map((tip) => (
                    <div
                        key={tip.title}
                        className={`rounded-2xl bg-gradient-to-br ${colorMap[tip.color as keyof typeof colorMap]} p-5 hover:shadow-md transition-all`}
                    >
                        <div className="flex items-center gap-2">
                            <tip.icon className="h-5 w-5" />
                            <span className="font-bold">{tip.title}</span>
                        </div>
                        <p className="mt-1 text-sm">{tip.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TipsSection;