'use client';
import { motion } from 'framer-motion';

const Footer = () => (
    <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-[10px] text-purple-400 mt-8"
    >
        © 2026 Lolomaths · Tous droits réservés.
    </motion.p>
);

export default Footer;