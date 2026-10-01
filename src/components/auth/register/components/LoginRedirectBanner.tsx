'use client';
import { default as CacheLink } from '@/components/commons/CacheLink';

const LoginRedirectBanner = () => (
    <div className="relative group w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative p-2 hover:border-blue-200/50 transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1 text-center">
                <span className="text-sm font-medium">
                    Si vous possédez déjà un compte Diambra
                </span>

                <CacheLink
                    href="/auth/login"
                    className="inline-flex items-center gap-2 px-2 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300 group/link"
                >
                    <span className="text-sm font-medium">Cliquez ici</span>
                    <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <div className="absolute inset-0 -translate-x-full group-hover/link:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </CacheLink>
            </div>
        </div>
    </div>
);

export default LoginRedirectBanner;