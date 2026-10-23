'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { LogIn, Sparkles, UserPlus } from 'lucide-react';

interface WelcomeDialogProps {
  open: boolean;
  onHasAccount: () => void;
}

const WelcomeDialog = ({ open, onHasAccount }: WelcomeDialogProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const handleNo = () => {
    setIsLeaving(true);
    const returnTo = searchParams?.get('returnTo');
    const target = returnTo
      ? `/auth/register?returnTo=${encodeURIComponent(returnTo)}`
      : '/auth/register';
    setTimeout(() => router.push(target), 220);
  };

  return (
    <dialog
      ref={dialogRef}
      className="welcome-dialog p-0 bg-transparent backdrop:bg-black/60 backdrop:backdrop-blur-md"
      onCancel={(e) => e.preventDefault()}
    >
      <div
        className={`relative w-[min(92vw,440px)] overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] ${
          isLeaving ? 'dialog-leave' : 'dialog-enter'
        }`}
      >
        {/* ─── Décor : gradient + halo lumineux ───────────────────────── */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br from-blue-400/30 via-indigo-400/20 to-purple-400/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-gradient-to-tr from-cyan-300/20 via-sky-300/15 to-transparent blur-3xl" />
        </div>

        {/* ─── Barre supérieure colorée ───────────────────────────────── */}
        <div className="relative h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

        <div className="relative px-8 pt-8 pb-10">
          {/* ─── Icône flottante ─────────────────────────────────────── */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 opacity-40 blur-xl" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30">
                <Sparkles className="h-8 w-8 text-white" strokeWidth={2.2} />
              </div>
            </div>
          </div>

          {/* ─── Titre ───────────────────────────────────────────────── */}
          <h2 className="mt-6 text-center text-[26px] font-bold leading-tight tracking-tight text-slate-900">
            Bienvenue&nbsp;! 👋
          </h2>
          <p className="mt-2 text-center text-[15px] leading-relaxed text-slate-600">
            Avez-vous déjà un compte&nbsp;?
            <br />
            <span className="text-slate-400 text-sm">Dites-le-nous pour continuer.</span>
          </p>

          {/* ─── Boutons ─────────────────────────────────────────────── */}
          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              onClick={onHasAccount}
              className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-5 py-3.5 text-white font-semibold shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300 active:translate-y-0 active:shadow-md"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative flex items-center justify-center gap-2.5">
                <LogIn className="h-5 w-5 transition-transform group-hover:translate-x-0.5" strokeWidth={2.2} />
                Oui, j&apos;ai déjà un compte
              </span>
            </button>

            <button
              type="button"
              onClick={handleNo}
              className="group w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-3.5 font-semibold text-slate-700 transition-all duration-300 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-700 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
            >
              <span className="flex items-center justify-center gap-2.5">
                <UserPlus className="h-5 w-5 transition-transform group-hover:scale-110" strokeWidth={2.2} />
                Non, je suis nouveau
              </span>
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            🔒 Connexion sécurisée &amp; chiffrée
          </p>
        </div>
      </div>

      {/* ─── Animations + centrage ───────────────────────────────────── */}
      <style jsx>{`
        .welcome-dialog {
          /* ✅ Centrage horizontal + vertical */
          position: fixed;
          inset: 0;
          margin: auto;
          max-height: calc(100vh - 2rem);
          max-width: calc(100vw - 2rem);
          overflow: visible;
        }
        .welcome-dialog::backdrop {
          animation: backdropFadeIn 0.25s ease-out;
        }
        .dialog-enter {
          animation: dialogPopIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .dialog-leave {
          animation: dialogPopOut 0.22s ease-in forwards;
        }
        @keyframes backdropFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes dialogPopIn {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.94);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes dialogPopOut {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(16px) scale(0.96);
          }
        }
      `}</style>
    </dialog>
  );
};

export default WelcomeDialog;