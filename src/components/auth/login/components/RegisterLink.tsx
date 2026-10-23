'use client';
import CacheLink from '@/components/commons/CacheLink';

const RegisterLink = () => (
    <div className="text-center">
        <p className="text-sm text-gray-700">
            Si vous n'avez pas encore de compte {' '}
            <CacheLink
                href="/auth/register"
                className="text-blue-700 font-semibold hover:underline transition-colors"
            >
                Cliquez-ci
            </CacheLink>
        </p>
    </div>
);

export default RegisterLink;