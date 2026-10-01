"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Settings } from "lucide-react";
import { memo } from "react";

interface NotificationSettingsModalProps {
    show: boolean;
    onClose: () => void;
}

const NotificationSettingsModal = memo(function NotificationSettingsModal({
    show,
    onClose,
}: NotificationSettingsModalProps) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                                <Settings className="h-5 w-5 text-indigo-600" />
                            </div>

                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Paramètres</h2>
                                <p className="text-xs text-gray-500">Personnalisation bientôt disponible</p>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600">
                            Les paramètres de notifications seront disponibles prochainement.
                            Vous pourrez choisir les types de notifications à recevoir.
                        </p>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={onClose}
                                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-indigo-700"
                                type="button"
                            >
                                Fermer
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
});

export default NotificationSettingsModal;