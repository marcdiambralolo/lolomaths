'use client';
import { ToastItem } from '@/hooks/admin/useToast';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const ToastContainer = () => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    useEffect(() => {
        const handleToast = (e: Event) => {
            const custom = e as CustomEvent<ToastItem & { duration: number }>;
            setToasts((prev) => [...prev, { id: custom.detail.id, message: custom.detail.message, type: custom.detail.type }]);
        };
        const handleClose = (e: Event) => {
            const custom = e as CustomEvent<{ id: number }>;
            setToasts((prev) => prev.filter((t) => t.id !== custom.detail.id));
        };
        window.addEventListener('toast', handleToast);
        window.addEventListener('toast-close', handleClose);
        return () => {
            window.removeEventListener('toast', handleToast);
            window.removeEventListener('toast-close', handleClose);
        };
    }, []);

    return (
        <div className="fixed right-4 top-4 z-50 space-y-2">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, x: 100, scale: 0.96 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100, scale: 0.96 }}
                        className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-white shadow-2xl backdrop-blur-xl ${toast.type === 'success'
                            ? 'bg-gradient-to-r from-emerald-500 to-green-600'
                            : toast.type === 'error'
                                ? 'bg-gradient-to-r from-red-500 to-rose-600'
                                : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                            }`}
                    >
                        <span className="text-lg">{toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}</span>
                        <span>{toast.message}</span>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ToastContainer;