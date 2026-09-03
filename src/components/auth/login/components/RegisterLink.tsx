'use client';
import CacheLink from '@/components/commons/CacheLink';

const RegisterLink = () => (
    <div className="text-center">
        <p className="text-sm text-gray-700">
            Pas encore de compte ?{' '}
            <CacheLink
                href="/auth/register"
                className="text-blue-700 font-semibold hover:underline transition-colors"
            >
                Inscription
            </CacheLink>
        </p>
    </div>
);

export default RegisterLink;