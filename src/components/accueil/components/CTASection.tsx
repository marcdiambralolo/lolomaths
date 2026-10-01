"use client";
import CacheLink from '@/components/commons/CacheLink';
import { Gamepad2, ArrowRight, Rocket } from 'lucide-react';

const CTASection = () => (
    <section className="mt-16 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-800">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 p-10 text-center shadow-2xl">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg...%3E')] opacity-10" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/20 rounded-full blur-3xl" />
            <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 mb-4">
                    <Rocket className="w-4 h-4 text-white" />
                    <span className="text-xs font-bold text-white uppercase">Prêt à relever le défi ?</span>
                </div>
                <h2 className="text-3xl font-black text-white mb-6">Mémorisez, échangez, verrouillez et gagnez !</h2>
                <CacheLink
                    href="/star/profil"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-white text-purple-700 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
                >
                    <Gamepad2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Jouer maintenant
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </CacheLink>
            </div>
        </div>
    </section>
);

export default CTASection;