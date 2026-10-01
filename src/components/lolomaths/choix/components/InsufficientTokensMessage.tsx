'use client';

const InsufficientTokensMessage = () => (
    <div className="w-full my-1 p-4 rounded-xl bg-red-50 border border-red-200 dark:border-red-800/50 text-center">
        <p className="text-base text-red-700 font-medium">
            ⚠️ Vous ne disposez pas d'assez de jetons pour jouer.
        </p>

        <p className="text-sm text-red-600/70 mt-1">
            Acquérez des jetons en cliquant sur le bouton ci-dessous pour continuer.
        </p>
    </div>
);

export default InsufficientTokensMessage;