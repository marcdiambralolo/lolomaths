'use client';
import { motion } from "framer-motion";

export default function Background() {
    return (
        <div className="absolute inset-0 overflow-hidden">
            <motion.div
                animate={{ scale: [1, 1.15, 1], rotate: [0, 60, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute -top-24 -left-24 w-72 h-72 sm:w-96 sm:h-96 bg-[#2E5AA6]/15 rounded-full blur-3xl"
            />
            <motion.div
                animate={{ scale: [1.15, 1, 1.15], rotate: [60, 0, 60] }}
                transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-24 -right-24 w-72 h-72 sm:w-96 sm:h-96 bg-[#4F83D1]/15 rounded-full blur-3xl"
            />
            <motion.div
                animate={{ y: [0, -40, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 bg-[#9BC2FF]/8 rounded-full blur-3xl"
            />
        </div>
    );
}