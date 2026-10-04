'use client';
import { useMarcheOffrandesMain } from '@/hooks/marcheoffrandes/useMarcheOffrandesMain';
import { AnimatePresence } from 'framer-motion';
import { CreditCard, ShoppingCart } from 'lucide-react';
import CartItem from './components/CartItem';
import CartSummary from './components/CartSummary';
import PaymentProgressSection from './components/PaymentProgressSection';
import ProductCard from './components/ProductCard';

export default function MarcheOffrandesMain() {
  const {
    cart, cartTotal, monoffre, simulationStep, showPaymentProgress,
    updateQuantity, handleAddToCart, handleSimulatedPayment,
  } = useMarcheOffrandesMain();

  if (showPaymentProgress) {
    return <PaymentProgressSection simulationStep={simulationStep} />;
  }

  return (
    <div className="mx-auto px-3 mt-16 sm:px-4 lg:px-6 py-6 sm:py-8 max-w-7xl  dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            ACHAT DE JETONS
          </h2>
        </div>
      </div>

      <div className="p-4 max-h-[600px] overflow-y-auto">
        {!(cart.length > 0) ? (
          <ProductCard product={monoffre} onAddToCart={handleAddToCart} />
        ) : (
          <>
            <div className="space-y-3 mb-4">
              <AnimatePresence mode="popLayout">
                {cart.map((item) => (
                  <CartItem
                    key={item._id || item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                  />
                ))}
              </AnimatePresence>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <CartSummary cartTotal={cartTotal} />

              <button
                onClick={handleSimulatedPayment}
                disabled={!(cart.length > 0)}
                className="w-full bg-gradient-to-r text-3xl from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CreditCard className="w-5 h-5" />
                Acquerir GRATUITEMENT
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}