'use client';
import { Loader2 } from 'lucide-react';

interface SubmitButtonProps {
    mounted: boolean;
    isSubmitDisabled: boolean;
    isLoading: boolean;
    isPending: boolean;
}

const SubmitButton = ({ mounted, isSubmitDisabled, isLoading, isPending }: SubmitButtonProps) => {
    const isDisabled = mounted && isSubmitDisabled;
    const isSubmitting = mounted && (isLoading || isPending);

    return (
        <button
            type="submit"
            disabled={isDisabled}
            className={`
                w-full py-3 rounded-xl font-semibold text-sm
                shadow-md hover:shadow-lg
                flex items-center justify-center gap-2 transition-all duration-200
                ${isDisabled
                    ? 'bg-gray-200 text-gray-400 border border-blue-100 cursor-not-allowed'
                    : 'border border-orange-200 bg-blue-600 text-white hover:from-blue-200 hover:to-blue-400'
                }
            `}
        >
            {isSubmitting ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Inscription...</span>
                </>
            ) : (
                <span>S'inscrire</span>
            )}
        </button>
    );
};

export default SubmitButton;