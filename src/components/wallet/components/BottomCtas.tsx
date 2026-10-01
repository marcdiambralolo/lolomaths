"use client";
import CacheLink from "@/components/commons/CacheLink";
import { motion } from "framer-motion";
import { ArrowLeftCircle, ShoppingBag } from "lucide-react";
import { fadeInUp } from "./constantes";

function BottomCtas({ href, label }: { href: string; label: string }) {
    return (
        <motion.div variants={fadeInUp} className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <CacheLink
                href={href}
                className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-orange-600 hover:shadow-lg hover:-translate-y-0.5"
            >
                <ArrowLeftCircle className="h-4 w-4" />
                {label}
            </CacheLink>
            <CacheLink
                href="/star/marcheoffrandes"
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
                <ShoppingBag className="h-4 w-4" />
                Acquerir des Jetons
            </CacheLink>
        </motion.div>
    );
}

export default BottomCtas;