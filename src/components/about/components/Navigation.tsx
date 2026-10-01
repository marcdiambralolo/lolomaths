"use client";
import BackButton from "./BackButton";
import NavLinks from "./NavLinks";

interface NavProps {
    items: Array<{ id: string; label: string }>;
}

function NavigationAbout({ items }: NavProps) {
    return (
        <nav className="sticky top-0 z-30 border-b border-purple-100 bg-white/90 backdrop-blur-md shadow-sm">
            <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-3">
                <BackButton href="/star/profil">Retour au jeu</BackButton>
                <NavLinks items={items} />
            </div>
        </nav>
    );
}

export default NavigationAbout;