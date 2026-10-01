'use client';
import { CreditCard } from 'lucide-react';
import CartSummary from './CartSummary';

const CheckoutSection = ({
    cartTotal,
    cartLength,
    onPayment
}: {
    cartTotal: number;
    cartLength: number;
    onPayment: () => void;
}) => (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <CartSummary cartTotal={cartTotal} />

        <button
            onClick={onPayment}
            disabled={!(cartLength > 0)}
            className="w-full bg-gradient-to-r text-3xl from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <CreditCard className="w-5 h-5" />
            Acquerir GRATUITEMENT
        </button>
    </div>
);

export default CheckoutSection;