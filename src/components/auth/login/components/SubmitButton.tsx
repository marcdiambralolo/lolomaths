'use client';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
 
interface SubmitButtonProps {
    isSubmitDisabled: boolean;
    isHydrated: boolean;
    isLoading: boolean;
    isPending: boolean;
}

const SubmitButton = ({ isSubmitDisabled, isHydrated, isLoading, isPending }: SubmitButtonProps) => {
    const isSubmitting = isHydrated && (isLoading || isPending);

    return (
        <motion.button
            type="submit"
            disabled={isSubmitDisabled}
            className={`
                w-full py-3 rounded-xl font-semibold text-sm
                shadow-md hover:shadow-lg
                flex items-center justify-center gap-2
                transition-all duration-200
                ${isSubmitDisabled
                    ? 'bg-gray-200 text-gray-400 border border-blue-100 cursor-not-allowed'
                    : 'border border-blue-200 bg-gradient-to-r from-blue-100 to-blue-300 text-blue-900 hover:from-blue-200 hover:to-blue-400'
                }
            `}
            whileHover={{ scale: isSubmitDisabled ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitDisabled ? 1 : 0.98 }}
        >
            {isSubmitting ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connexion...</span>
                </>
            ) : (
                'Se connecter'
            )}
        </motion.button>
    );
};

export default SubmitButton;