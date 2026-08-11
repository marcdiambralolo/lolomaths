'use client';
import Image from 'next/image';

const PageHeader = () => (
    <header className="mb-14 mx-auto space-y-5">
        <div className="flex items-center gap-4 mb-6">
            <div className="relative">
                <div className="relative w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-2 ring-white/10">
                    <Image
                        src="/logo.png"
                        alt="Lolomaths Logo"
                        width={48}
                        height={48}
                        className="w-12 h-12 object-contain rounded-xl"
                        priority
                    />
                </div>
            </div>

            <div className="flex-1">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                        <span className="text-slate-800">Lolo</span>
                        <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                            maths
                        </span>
                    </h2>
                </div>
            </div>
        </div>

        {/* Séparateur décoratif */}
        <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-indigo-200" />
            <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-indigo-200" />
        </div>

        {/* Titre de la page */}
        <div className="pt-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Règles du Jeu{' '}
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    & Aide
                </span>
            </h1>
            <p className="text-gray-500 text-base sm:text-lg max-w-2xl font-medium leading-relaxed mt-3">
                Tout ce qu'il faut savoir pour jouer, construire vos meilleures combinaisons
                et maximiser votre score dans Lolomaths.
            </p>
        </div>
    </header>
);

export default PageHeader;