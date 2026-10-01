'use client';
import { fadeInUp } from '@/hooks/marcheoffrandes/useMarcheOffrandesMain';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { memo } from 'react';

const ProductCard = memo(({ product, onAddToCart }: { product: any; onAddToCart: () => void }) => (
    <motion.div
        variants={fadeInUp}
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden"
    >
        <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-2 text-center">
            {product.name}
        </h3>

        <div className="text-center mb-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-900/50 dark:to-gray-900/50 rounded-xl">
            <motion.p
                className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            >
                {product.price.toLocaleString()} F
            </motion.p>
        </div>

        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAddToCart}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 text-base"
        >
            <ShoppingCart className="w-5 h-5" />
            Ajouter
        </motion.button>
    </motion.div>
));

export default ProductCard;