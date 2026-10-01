'use client';
import { SimulationStep } from '@/hooks/marcheoffrandes/useMarcheOffrandesMain';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Loader2, } from 'lucide-react';
import { memo } from 'react';
import SimulationProgress from './SimulationProgress';

const PaymentProgressSection = memo(({ simulationStep }: { simulationStep: SimulationStep }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white dark:bg-gray-800 mt-16 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6"
    >
        <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-white animate-spin" />
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Traitement du paiement
            </h3>
        </div>

        <SimulationProgress step={simulationStep} />

        <AnimatePresence>
            {simulationStep === "success" && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 text-center"
                >
                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
                    <p className="text-green-700 dark:text-green-300 font-semibold">
                        Paiement réussi !
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        Vos jetons ont été ajoutés à votre compte
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
));

export default PaymentProgressSection;