"use client";
import { motion } from "framer-motion";
import { Bell, } from "lucide-react";
import { memo } from "react";

const EmptyState = memo(function EmptyState({ filter }: { filter: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
        >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Bell className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {filter === "all" ? "Aucune notification" : "Aucune notification pour ce filtre"}
            </h3>
            <p className="text-sm text-gray-500">
                {filter === "all"
                    ? "Vous n'avez aucune notification pour le moment."
                    : "Essayez de modifier le filtre pour afficher davantage d'éléments."}
            </p>
        </motion.div>
    );
});

export default EmptyState;