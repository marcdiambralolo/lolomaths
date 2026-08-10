'use client';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const BackButton = () => (
    <nav className="mb-10">
        <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/90 border border-gray-200/80 text-sm font-semibold text-gray-600 hover:text-indigo-600 hover:border-indigo-300 shadow-sm backdrop-blur-sm transition-all group"
        >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />

            <span>Retour à l'accueil</span>
        </Link>
    </nav>
);

export default BackButton;