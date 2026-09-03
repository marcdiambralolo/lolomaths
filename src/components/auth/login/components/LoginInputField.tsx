'use client';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import React, { memo } from "react";

interface InputFieldProps {
    label: string;
    name: string;
    type: string;
    value: string;
    error?: string;
    placeholder: string;
    icon: React.ElementType;
    showPasswordToggle?: boolean;
    showPassword?: boolean;
    onTogglePassword?: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LoginInputField = memo<InputFieldProps>(({
    label,
    name,
    type,
    value,
    error,
    placeholder,
    icon: Icon,
    showPasswordToggle,
    showPassword,
    onTogglePassword,
    onChange
}) => {

    return (
        <div className="space-y-1.5">
            <label htmlFor={name} className="block text-xs font-semibold text-white dark:text-[#D1D5DB]">
                {label}
            </label>
            <div className="relative">
                <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-[#9FB0D1]" />

                <input
                    id={name}
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`
            w-full pl-10 ${showPasswordToggle ? 'pr-10' : 'pr-4'} py-2.5 
            text-sm
            border-2 rounded-xl 
            theme-dark-input bg-white dark:bg-[color:var(--theme-layer-3)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]
            transition-all duration-200
            placeholder:text-gray-400 dark:placeholder:text-[#9FB0D1]
            ${error
                            ? 'border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-500'
                            : 'border-gray-200 dark:border-[color:var(--theme-border)] focus:border-blue-500 dark:focus:border-[#4F83D1]'
                        }
            focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-[#4F83D1]/25
          `}
                    autoComplete={name === 'username' ? 'username' : 'current-password'}
                />

                {showPasswordToggle && onTogglePassword && (
                    <button
                        type="button"
                        onClick={onTogglePassword}
                        className="absolute right-3 top-1/2 -translate-y-1/2 
                     text-gray-400 dark:text-[#9FB0D1] 
                     hover:text-gray-600 dark:hover:text-[#DDE7FA]
                     transition-colors p-1"
                        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                )}
            </div>

            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-600 dark:text-red-400 text-xs mt-1"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
}); 