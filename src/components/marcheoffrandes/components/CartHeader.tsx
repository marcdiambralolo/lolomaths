'use client';
import { ShoppingCart } from 'lucide-react';

const CartHeader = () => (
    <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
                <ShoppingCart className="w-6 h-6" />
                ACHAT DE JETONS
            </h2>
        </div>
    </div>
);

export default CartHeader;