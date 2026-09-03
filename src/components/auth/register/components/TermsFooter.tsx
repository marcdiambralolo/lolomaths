'use client';
import { default as CacheLink } from '@/components/commons/CacheLink';

const TermsFooter = () => (
    <div className="mt-6 text-center">
        <CacheLink
            href="/terms"
            className="text-xs text-blue-700 font-semibold hover:underline transition-colors"
        >
            Conditions générales d'utilisation
        </CacheLink>
    </div>
);

export default TermsFooter;