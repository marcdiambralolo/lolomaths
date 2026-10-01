'use client';
import { memo } from 'react';

const CartSummary = memo(({ cartTotal }: { cartTotal: number }) => (
    <>
        <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 dark:text-gray-400">Sous-total</span>
            <span className="font-bold text-gray-900 dark:text-white">
                {cartTotal.toLocaleString()} F
            </span>
        </div>

        <div className="flex items-center justify-between mb-4 pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                {cartTotal.toLocaleString()} F
            </span>
        </div>
    </>
));

export default CartSummary;