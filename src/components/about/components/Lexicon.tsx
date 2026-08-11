'use client';
import { BookOpen } from "lucide-react";
import { LEXICON_DATA } from "./about.constants";
import Pill from "./Pill";

const Lexicon = () => (
    <section id="lexique" className="mt-10 sm:mt-12 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-400">
        <div className="mb-4 text-center">
            <h2 className="text-2xl font-black text-purple-900 flex items-center justify-center gap-2">
                <BookOpen className="w-6 h-6 text-purple-600" />
                📚 Lexique du jeu
            </h2>
            <p className="mx-auto mt-1 max-w-2xl text-sm text-purple-600">
                Le vocabulaire essentiel pour bien comprendre le plateau et vos pièces.
            </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {LEXICON_DATA.map((item, index) => (
                <Pill
                    key={index}
                    icon={<div className="text-sm">{item.icon}</div>}
                    title={item.title}
                    desc={item.desc}
                />
            ))}
        </div>
    </section>
);

export default Lexicon;