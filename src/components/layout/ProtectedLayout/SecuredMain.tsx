'use client';
import { memo } from 'react';
import { usePathname } from 'next/navigation';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

interface SecuredMainProps {
  children: React.ReactNode;
}

const SecuredMain = memo<SecuredMainProps>(({ children }) => {
  const pathname = usePathname();
  
  // On vérifie si on est sur la page de jeu (ou playlolomaths)
  const isGamePage = pathname?.includes('/star/play') || pathname?.includes('/star/diambraplay') || pathname?.includes('/star/playlolomaths');

  return (
    <ProtectedRoute>
      <main
        id="main-content"
        role="main"
        aria-label="Espace sécurisé."
        className={`mx-auto w-full pb-[calc(16px+env(safe-area-inset-bottom))] pt-4 dark:text-[color:var(--theme-text-main)] ${
          isGamePage ? 'px-0 sm:px-6' : 'px-4 sm:px-6 sm:pt-6'
        }`}
      >
        {children}
      </main>
    </ProtectedRoute>
  );
});

SecuredMain.displayName = 'SecuredMain';

export default SecuredMain;