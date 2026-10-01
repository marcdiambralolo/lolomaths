"use client";
import { motion } from "framer-motion";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { ANIMATIONS } from "./constantes";

const SuccessState = ({ consultationId, router }: { consultationId?: string; router: ReturnType<typeof useRouter> }) => (
    <motion.div
        key="success"
        {...ANIMATIONS.scaleIn}
        className="mb-8 text-center"
    >
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">Paiement confirmé!</h1>
        <p className="text-gray-600 text-lg">Merci pour votre confiance. Votre transaction a été enregistrée.</p>

        {consultationId && (
            <button
                onClick={() => router.push(`/consultations/${consultationId}`)}
                className="mt-4 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition font-medium"
            >
                Voir ma consultation
                <ExternalLink className="w-4 h-4" />
            </button>
        )}
    </motion.div>
);

export default SuccessState;