'use client';
import CacheLink from "@/components/commons/CacheLink";
import { ArrowLeft } from "lucide-react";
import { NAV_ITEMS } from "./about.constants";

const StickyNav = () => (
    <nav className="sticky top-0 z-30 border-b border-purple-100 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-3">
            <CacheLink href="/star/profil" className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-800 transition">
                <ArrowLeft className="h-4 w-4" />Retour au jeu
            </CacheLink>

            <div className="hidden sm:flex items-center gap-2 text-[13px] font-bold">
                {NAV_ITEMS.map(({ id, label }) => (
                    <a key={id} className="text-purple-500 hover:text-purple-800 transition capitalize" href={`#${id}`}>
                        {label}
                    </a>
                ))}
            </div>
        </div>
    </nav>
);

export default StickyNav;