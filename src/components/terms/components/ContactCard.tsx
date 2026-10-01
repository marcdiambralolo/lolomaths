'use client';
import { motion } from 'framer-motion';
import { ExternalLink, MapPin, Phone, Shield } from 'lucide-react';
import { memo } from 'react';
import { fadeInUp } from './constantes';

const ContactCard = memo(() => (
    <motion.div
        variants={fadeInUp}
        className="mt-8 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 p-6 border border-purple-100"
    >
        <div className="flex items-center gap-2 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-200 to-transparent" />
            <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-purple-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
                    Support technique
                </span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-200 to-transparent" />
        </div>

        <h3 className="text-center text-sm font-semibold text-purple-800 mb-4">
            Une question sur le jeu ? Notre équipe est là pour vous aider
        </h3>

        <div className="space-y-3">
            <motion.a
                whileHover={{ x: 4 }}
                href="tel:+2250758385387"
                className="flex items-center gap-3 rounded-xl bg-white p-3 transition-all hover:shadow-md border border-purple-100"
            >
                <div className="rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 p-2">
                    <Phone className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Téléphone
                    </div>
                    <div className="text-sm font-semibold text-purple-800">+225 07 58 38 53 87</div>
                </div>
                <ExternalLink className="h-4 w-4 text-gray-300" />
            </motion.a>

            <div className="flex items-center gap-3 rounded-xl bg-white p-3 border border-purple-100">
                <div className="rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 p-2">
                    <MapPin className="h-4 w-4 text-white" />
                </div>
                <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        En ligne
                    </div>
                    <div className="text-sm font-medium text-purple-700">
                        Disponible partout dans le monde entier
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
));

export default ContactCard;