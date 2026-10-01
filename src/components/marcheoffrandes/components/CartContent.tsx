'use client';
import CartList from './CartList';
import CheckoutSection from './CheckoutSection';

const CartContent = ({
    cart,
    cartTotal,
    updateQuantity,
    onPayment
}: {
    cart: any[];
    cartTotal: number;
    updateQuantity: (id: string, delta: number) => void;
    onPayment: () => void;
}) => (
    <>
        <CartList cart={cart} updateQuantity={updateQuantity} />
        <CheckoutSection
            cartTotal={cartTotal}
            cartLength={cart.length}
            onPayment={onPayment}
        />
    </>
);

export default CartContent;