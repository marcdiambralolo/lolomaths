"use client";
import CacheLink from '@/components/commons/CacheLink';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

const WelcomeHeader = () => (
    <section className="text-center reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700">
        <div className="flex items-center justify-center gap-4 mb-4">
            <Image
                src="/logo.png"
                alt="Lolomaths Logo"
                width={80}
                height={80}
                className="w-20 h-20 object-contain"
                priority
            />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent">
                LOLOMATHS
            </h1>
        </div>

        <p className="mt-4 text-xl text-purple-600 font-semibold">Réveillons le génie qui sommeille en nous.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <CacheLink href="/star/profil" className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 text-white font-bold shadow-lg shadow-purple-500/30 hover:shadow-xl transition-all">
                <span className="relative z-10 flex items-center gap-2">
                    🎯 Jouer maintenant !
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </CacheLink>
        </div>
    </section>
);

export default WelcomeHeader; 