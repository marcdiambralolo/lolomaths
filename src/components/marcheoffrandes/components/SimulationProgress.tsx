'use client';
import { SIMULATION_STEPS, SimulationStep, STEP_WIDTHS, STEPS } from '@/hooks/marcheoffrandes/useMarcheOffrandesMain';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { memo } from 'react';

const SimulationProgress = memo(({ step }: { step: SimulationStep }) => {
    const currentIndex = STEPS.indexOf(step);
    const progressWidth = STEP_WIDTHS[step] || "0%";

    return (
        <div className="space-y-4">
            <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-orange-600"
                    initial={{ width: "0%" }}
                    animate={{ width: progressWidth }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </div>

            <div className="flex justify-between items-center">
                {STEPS.map((s, idx) => {
                    const isActive = idx <= currentIndex;
                    const isCurrent = s === step;

                    return (
                        <motion.div
                            key={s}
                            className="flex flex-col items-center gap-2"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                                opacity: isActive ? 1 : 0.4,
                                scale: isCurrent ? 1.1 : 1
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                  ${isActive
                                        ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20"
                                        : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                                    }`}
                            >
                                {isCurrent && <Loader2 className="w-4 h-4 animate-spin" />}
                                {isActive && !isCurrent && <CheckCircle2 className="w-4 h-4" />}
                            </div>
                            <span className={`text-xs font-medium ${isActive ? "text-gray-900 dark:text-gray-100" : "text-gray-400"}`}>
                                {idx + 1}
                            </span>
                        </motion.div>
                    );
                })}
            </div>

            <motion.p
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-sm font-medium text-gray-700 dark:text-gray-300"
            >
                {SIMULATION_STEPS[step as keyof typeof SIMULATION_STEPS]?.label || "Préparation..."}
            </motion.p>
        </div>
    );
});

export default SimulationProgress;