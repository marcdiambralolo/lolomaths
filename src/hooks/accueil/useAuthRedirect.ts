"use client";
import { useAuthStore } from '@/lib/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useAuthRedirect = () => {
    const router = useRouter();
    const { user } = useAuthStore();
    
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        if (user && user.secretCode) {
            setIsRedirecting(true);
            router.replace('/star/profil');
        }
    }, [user, router]);

    return isRedirecting;
};