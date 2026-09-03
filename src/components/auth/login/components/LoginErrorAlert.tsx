'use client';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { memo } from "react";
 
export const LoginErrorAlert = memo(({ message }: { message: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-700/60 dark:bg-[#231631] 
               rounded-xl flex items-start gap-2"
  >
    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
    <p className="text-red-700 dark:text-red-300 text-xs leading-relaxed">{message}</p>
  </motion.div>
));