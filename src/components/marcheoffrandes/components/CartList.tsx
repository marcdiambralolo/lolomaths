'use client';
import { AnimatePresence } from 'framer-motion';
import CartItem from './CartItem';

const CartList = ({ cart, updateQuantity }: { cart: any[]; updateQuantity: (id: string, delta: number) => void }) => (
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
);

export default CartList;