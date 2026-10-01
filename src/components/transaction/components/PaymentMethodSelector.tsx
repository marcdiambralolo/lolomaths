"use client";
import { PAYMENT_METHODS } from "@/hooks/transaction/useTransactionPage";
import { motion } from "framer-motion";
import { CheckCircle2, Shield, Smartphone } from "lucide-react";
import { ANIMATIONS } from "./constantes";

const PaymentMethodSelector = ({
    selectedMethod,
    setSelectedPaymentMethod,
}: {
    selectedMethod: string | null;
    setSelectedPaymentMethod: (id: string) => void;
}) => (
    <motion.div
        {...ANIMATIONS.fadeInUp}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden mb-6"
    >
        <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Choisissez votre moyen de paiement
            </h2>
        </div>

        <div className="p-6">
            <div className="grid grid-cols-2 gap-3">
                {PAYMENT_METHODS.map((method) => (
                    <button
                        key={method.id}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                        className={`
                            relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all
                            ${selectedMethod === method.id
                                ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }
                        `}
                    >
                        <span className="text-2xl">{method.icon}</span>
                        <span className="text-sm font-medium text-gray-700">{method.name}</span>
                        {selectedMethod === method.id && (
                            <div className="absolute -top-2 -right-2 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-3 h-3 text-white" />
                            </div>
                        )}
                    </button>
                ))}
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <Shield className="w-3 h-3" />
                <span>Paiement 100% sécurisé par Money Fusion</span>
            </div>
        </div>
    </motion.div>
);

export default PaymentMethodSelector;