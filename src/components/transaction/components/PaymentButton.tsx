"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ANIMATIONS } from "./constantes";

const PaymentButton = ({
    totalAmount,
    onClick,
}: {
    totalAmount: number;
    onClick: () => void;
}) => (
    <motion.div
        {...ANIMATIONS.fadeInUp}
        transition={{ delay: 0.2 }}
    >
        <button
            onClick={onClick}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-semibold text-lg hover:bg-indigo-700 transition shadow-md flex items-center justify-center gap-2"
        >
            Payer {totalAmount.toLocaleString()} FCFA
            <ArrowRight className="w-5 h-5" />
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">
            En cliquant sur "Payer", vous serez redirigé vers une page de paiement sécurisée.
            Aucune information bancaire n'est stockée sur notre plateforme.
        </p>
    </motion.div>
);

export default PaymentButton;