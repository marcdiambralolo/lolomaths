"use client";
import { motion } from "framer-motion";
import { Lock, RefreshCw } from "lucide-react";

const ProcessingState = ({ status }: { status: string }) => {
    const getContent = () => {
        switch (status) {
            case "initiating":
                return {
                    icon: <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin" />,
                    title: "Préparation du paiement...",
                    subtitle: ""
                };
            case "pending_user_action":
                return {
                    icon: <Lock className="w-12 h-12 text-indigo-600" />,
                    title: "Redirection vers la page sécurisée",
                    subtitle: "Vous allez être redirigé dans quelques instants"
                };
            case "verifying":
                return {
                    icon: <Lock className="w-12 h-12 text-indigo-600" />,
                    title: "Vérification en cours...",
                    subtitle: "Nous vérifions le statut de votre transaction"
                };
            default:
                return {
                    icon: <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin" />,
                    title: "Traitement en cours...",
                    subtitle: ""
                };
        }
    };

    const content = getContent();

    return (
        <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 text-center"
        >
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                {content.icon}
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{content.title}</h2>

            {content.subtitle && <p className="text-gray-500">{content.subtitle}</p>}
        </motion.div>
    );
};

export default ProcessingState;