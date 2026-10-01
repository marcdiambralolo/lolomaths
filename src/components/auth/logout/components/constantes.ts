import { Variants } from "framer-motion";

export const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.92, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 250, damping: 22, mass: 0.8 } },
    exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.15 } }
};

export const checkVariants: Variants = {
    hidden: { scale: 0, rotate: -180, opacity: 0 },
    visible: { scale: 1, rotate: 0, opacity: 1, transition: { delay: 0.15, type: "spring", stiffness: 220, damping: 18 } }
};

export const CELEBRATION_STARS = 6;

export const STARS_COUNT = 10;