'use client';
import { motion } from "framer-motion";
import { AlertCircle, Check, Eye, EyeOff } from 'lucide-react';
import { memo, default as React } from 'react';

interface InputFieldProps {
    label: string;
    name: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    placeholder?: string;
    icon?: React.ReactNode;
    showPassword?: boolean;
    onTogglePassword?: () => void;
    showSuccess?: boolean;
}

export const RegisterInputField = memo<InputFieldProps>(({
    label,
    name,
    type = 'text',
    value,
    onChange,
    error,
    placeholder,
    icon,
    showPassword,
    onTogglePassword,
    showSuccess,
}) => (
    <div className="space-y-1.5">
        <label htmlFor={name} className="block text-xs font-semibold text-black dark:text-[#D1D5DB]">
            {label} <span className="text-red-500">*</span>
        </label>

        <div className="relative">
            {icon && (
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#9FB0D1]">
                    {icon}
                </div>
            )}

            <input
                id={name}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className={`
          w-full ${icon ? 'pl-10' : 'pl-4'} ${onTogglePassword || showSuccess ? 'pr-10' : 'pr-4'} 
          py-2.5 text-sm text-black
          border-2 rounded-xl 
          theme-dark-input bg-white dark:bg-[color:var(--theme-layer-3)]
          transition-all duration-200
          placeholder:text-black dark:placeholder:text-[#9FB0D1]
          ${error
                        ? 'border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-500'
                        : 'border-gray-200 dark:border-[color:var(--theme-border)] focus:border-blue-500 dark:focus:border-[#4F83D1]'
                    }
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-[#4F83D1]/25
        `}
                placeholder={placeholder}
            />

            {onTogglePassword && (
                <button
                    type="button"
                    onClick={onTogglePassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 
                   text-gray-400 dark:text-[#9FB0D1] 
                   hover:text-gray-600 dark:hover:text-[#DDE7FA] 
                   transition-colors p-1"
                    aria-label={showPassword ? 'Masquer' : 'Afficher'}
                >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            )}

            {showSuccess && !error && value && (
                <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
            )}

        </div>

        {error && (
            <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-600 dark:text-red-400 text-xs flex items-center gap-1"
            >
                <AlertCircle className="w-3 h-3" />
                {error}
            </motion.p>
        )}
    </div>
));