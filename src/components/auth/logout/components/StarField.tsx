'use client';
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const STARS_COUNT = 10;

export const StarField = () => {
  const [stars, setStars] = useState<Array<{
    id: number;
    style: { top: string; left: string };
    delay: number;
  }>>([]);

  useEffect(() => {
    setStars(
      Array.from({ length: STARS_COUNT }, (_, i) => ({
        id: i,
        style: {
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
        },
        delay: Math.random() * 2.5
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white rounded-full"
          style={star.style}
          animate={{ opacity: [0, 0.8, 0], scale: [0, 1.2, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: star.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};