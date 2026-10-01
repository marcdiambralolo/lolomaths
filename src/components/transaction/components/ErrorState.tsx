"use client";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const ErrorState = ({ error, router }: { error: string | null; router: ReturnType<typeof useRouter> }) => (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-3">Transaction introuvable</h1>
            <p className="text-gray-600 mb-8">
                {error || "Impossible de récupérer les détails de votre transaction."}
            </p>

            <button
                onClick={() => router.push("/")}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
            >
                Retour à l'accueil
            </button>
        </div>
    </div>
);

export default ErrorState;