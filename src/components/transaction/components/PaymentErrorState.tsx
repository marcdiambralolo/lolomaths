"use client";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";
import { ANIMATIONS } from "./constantes";

const PaymentErrorState = ({ error, onRetry }: { error: string | null; onRetry: () => void }) => (
    <motion.div
        {...ANIMATIONS.fadeInUp}
        className="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
    >
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h3 className="font-semibold text-red-800 mb-2">Une erreur est survenue</h3>
        <p className="text-red-600 text-sm mb-4">{error}</p>
        <button
            onClick={onRetry}
            className="px-5 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition flex items-center gap-2 mx-auto"
        >
            <RefreshCw className="w-4 h-4" />
            Réessayer le paiement
        </button>
    </motion.div>
);

export default PaymentErrorState;