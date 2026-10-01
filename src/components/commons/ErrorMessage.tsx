'use client';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
    <motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-600 text-sm mt-1 flex items-center gap-1"
    >
        <AlertCircle className="w-4 h-4" />    {message}
    </motion.p>
);

export default ErrorMessage;