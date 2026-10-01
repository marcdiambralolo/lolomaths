'use client';
import { motion } from 'framer-motion';
import { MapPin, Phone, Users } from 'lucide-react';

const CONTACT_INFO = {
    phone: '+225 07 58 38 53 87',
    address: 'Abidjan, Côte d\'Ivoire',
    company: 'Lolomaths'
};

const ContactCard = () => (
    <motion.div
        className="mt-8 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 p-6"
    >
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-600" />
            Contact
        </h3>
        <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-purple-700">
                <Phone className="w-3.5 h-3.5" />
                <span>{CONTACT_INFO.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-purple-700">
                <MapPin className="w-3.5 h-3.5" />
                <span>{CONTACT_INFO.address}</span>
            </div>
        </div>
    </motion.div>
);

export default ContactCard;