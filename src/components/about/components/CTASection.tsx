"use client";
import CacheLink from "@/components/commons/CacheLink";
import { ChevronRight } from "lucide-react";

function CTASection() {
    return (
        <section className="mt-12 text-center reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-800">
            <div className="rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white">
                <h2 className="text-2xl font-black">Prêt à relever le défi ?</h2>
                <p className="mt-2 text-sm text-purple-100">Mémorisez, échangez, verrouillez et gagnez !</p>
                <CacheLink
                    href="/star/profil"
                    className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-white text-purple-700 rounded-2xl font-bold hover:shadow-lg transition-all hover:scale-105"
                >
                    Commencez ! <ChevronRight className="h-4 w-4" />
                </CacheLink>
            </div>
        </section>
    );
}

export default CTASection;