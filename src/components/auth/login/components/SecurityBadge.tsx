'use client';
import { Lock } from 'lucide-react';

const SecurityBadge = () => (
    <div className="flex items-center justify-center gap-2 text-xs text-blue-400">
        <Lock className="w-3 h-3" />
        <span>Connexion sécurisée et cryptée</span>
    </div>
);

export default SecurityBadge;