'use client';

function PageFooter() {
    return (
        <footer className="mt-8 text-center">
            <p className="text-xs font-medium">
                © <span suppressHydrationWarning>{new Date().getFullYear()}</span> Lolomaths •
                Tous droits réservés
            </p>
        </footer>
    );
}

export default PageFooter;