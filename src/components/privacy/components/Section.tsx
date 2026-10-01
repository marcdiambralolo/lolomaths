'use client';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

interface SectionProps {
    title: string;
    number?: number;
    children: React.ReactNode;
    icon?: React.ReactNode;
}

const Section = ({ title, number, children, icon }: SectionProps) => (
    <motion.div
        className="mb-8 last:mb-0"
    >
        <div className="flex items-start gap-3 mb-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center mt-0.5">
                {icon || <FileText className="w-4 h-4 text-purple-600" />}
            </div>
            <h2 className="text-lg font-bold text-gray-800">
                {number && <span className="text-purple-500 mr-2">{number}.</span>}
                {title}
            </h2>
        </div>

        <div className="pl-11 text-sm text-gray-600 leading-relaxed space-y-3">
            {children}
        </div>
    </motion.div>
);

export default Section;