'use client';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { memo, useCallback } from 'react';

const CartItem = memo(({
    item,
    onUpdateQuantity,
}: {
    item: any;
    onUpdateQuantity: (id: string, delta: number) => void;
}) => {
    const itemId = item._id || item.id;

    const handleDecrement = useCallback(() => onUpdateQuantity(itemId, -1), [onUpdateQuantity, itemId]);
    const handleIncrement = useCallback(() => onUpdateQuantity(itemId, 1), [onUpdateQuantity, itemId]);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-md transition-shadow"
        >
            <div className="flex-grow min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base truncate">{item.name}</h3>

                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {item.price.toLocaleString()} F × {item.quantity}
                </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
                <button
                    onClick={handleDecrement}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 active:scale-90 flex items-center justify-center transition-all"
                    aria-label="Diminuer la quantité"
                >
                    <Plus className="w-4 h-4 rotate-45" />
                </button>

                <span className="font-bold text-base sm:text-lg w-6 sm:w-8 text-center text-gray-900 dark:text-white">
                    {item.quantity}
                </span>

                <button
                    onClick={handleIncrement}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 active:scale-90 flex items-center justify-center transition-all"
                    aria-label="Augmenter la quantité"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
});

export default CartItem;