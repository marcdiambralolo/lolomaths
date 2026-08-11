'use client';
import CacheLink from "@/components/commons/CacheLink";
import { ChevronRight, Gamepad2 } from "lucide-react";

const CallToAction = () => (
    <section className="mt-12 text-center reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-700">
        <div className="rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 mb-3">
                <Gamepad2 className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Prêt à relever le défi ?</span>
            </div>
            <h2 className="text-2xl font-black">Commencez votre première compétition !</h2>
            <CacheLink href="/star/profil" className="inline-flex items-center gap-2 mt-5 px-6 py-3 bg-white text-purple-700 rounded-2xl font-bold hover:shadow-lg transition-all hover:scale-105">
                Jouer maintenant <ChevronRight className="h-4 w-4" />
            </CacheLink>
        </div>
    </section>
);

export default CallToAction;