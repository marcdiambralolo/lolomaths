"use client";
import CacheLink from "@/components/commons/CacheLink";
import { ChevronRight } from "lucide-react";
import { BUTTON_CLASSES } from "./Constantes";

function HeroSection() {

    return (
        <section className="text-center reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <div className="mb-6 flex justify-center">
                <img
                    src="/logo.png"
                    alt="Lolomaths Logo"
                    className="h-20 w-auto object-contain"
                />
            </div>
            <h1 className="text-balance text-4xl font-black tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent sm:text-6xl">
                Lolomaths
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-purple-600">
                Développez votre mémoire visuelle et votre logique en replaçant les éléments du plateau P2.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <CacheLink href="/star/profil" className={BUTTON_CLASSES.primary}>
                    Jouez maintenant ! <ChevronRight className="h-4 w-4" />
                </CacheLink>
            </div>
        </section>
    );
}

export default HeroSection;