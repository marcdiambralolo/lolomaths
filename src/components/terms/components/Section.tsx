'use client';
import { motion, useReducedMotion } from 'framer-motion';
import React, { memo } from 'react';
import { fadeInUp } from './constantes';

interface SectionProps {
    number: string;
    title: string;
    icon: React.ElementType;
    iconColor: string;
    children: React.ReactNode;
}

const Section = memo<SectionProps>(({ number, title, icon: Icon, iconColor, children }) => {
    const reduceMotion = useReducedMotion();

    return (
        <motion.section
            variants={fadeInUp}
            className="mb-8 scroll-mt-24 group"
            id={`section-${number}`}
        >
            <div className="flex items-start gap-3 mb-4">
                <motion.div
                    whileHover={reduceMotion ? undefined : { scale: 1.05, rotate: 5 }}
                    className={`${iconColor} p-2 rounded-xl shadow-sm flex-shrink-0`}
                >
                    <Icon className="w-5 h-5" />
                </motion.div>
                <div className="flex-1">
                    <h2 className="text-lg font-bold text-purple-900">
                        <span className="text-purple-500 mr-2">{number}.</span>
                        {title}
                    </h2>
                    <div className="mt-1 h-0.5 w-12 bg-gradient-to-r from-purple-400 to-transparent rounded-full group-hover:w-24 transition-all duration-500" />
                </div>
            </div>

            <div className="pl-11 space-y-2 text-sm text-purple-700 leading-relaxed">
                {children}
            </div>
        </motion.section>
    );
});

export default Section;