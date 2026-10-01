"use client";
import CacheLink from '@/components/commons/CacheLink';
import { ArrowRight, ChevronRight } from 'lucide-react';
import Image from "next/image";

const HeroSection = () => (
    <section className="text-center reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700">
        <div className="flex justify-center">
            <CacheLink href="/" className="text-center">
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 mx-auto transition-transform duration-300">
                    <Image
                        src="/logo.png"
                        alt="Lolomaths"
                        fill
                        sizes="(max-width: 768px) 256px, 384px"
                        className="object-contain drop-shadow-xl"
                        priority
                    />
                </div>
            </CacheLink>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <CacheLink
                href="/star/profil"
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 to-orange-700 px-4 py-4 text-white font-bold shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:-translate-y-1"
            >
                <span className="relative z-10 flex items-center gap-2 text-base sm:text-lg">
                    <span className="text-xl">🎮</span>
                    Jouez maintenant !
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <div className="absolute inset-0 rounded-2xl animate-pulse-slow opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-purple-400/20 to-indigo-400/20" />
            </CacheLink>

            <CacheLink
                href="#principe"
                className="group inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-all duration-300 hover:-translate-y-1"
            >
                En savoir plus
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </CacheLink>
        </div>
    </section>
);

export default HeroSection;