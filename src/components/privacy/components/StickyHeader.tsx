'use client';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

const StickyHeader = () => {
    const router = useRouter();

    const handleNavigateToRegister = () => {
        router.push('/auth/register');
    };

    return (
        <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-blue-100"
        >
            <div className="max-w-4xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-2"
                    >
                        <button
                            onClick={handleNavigateToRegister}
                            className="group inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-600 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 relative overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <UserPlus className="w-4 h-4" />
                                Retour à l'inscription
                            </span>

                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        </button>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default StickyHeader;