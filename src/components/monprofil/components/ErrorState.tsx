"use client";
import { AlertCircle } from "lucide-react";
import { memo } from "react";

const ErrorState = memo(() => (
    <div className="flex items-center justify-center min-h-[400px]">
        <div className="max-w-md rounded-2xl border border-red-500/25 bg-gradient-to-br from-red-950/20 to-red-900/10 p-8 text-center backdrop-blur-xl">
            <AlertCircle className="mx-auto mb-4 h-16 w-16 text-red-400" />
            <h3 className="text-xl font-bold text-white mb-2">Accès refusé</h3>

            <p className="text-gray-300">Aucun utilisateur connecté. Veuillez vous connecter.</p>
        </div>
    </div>
));

export default ErrorState;