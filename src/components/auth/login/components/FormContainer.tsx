'use client';

const FormContainer = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-white text-gray-900">
        <div className="w-full max-w-2xl">
            <div className="rounded-3xl border border-blue-200 bg-white p-6 shadow-[0_8px_32px_-18px_rgba(46,90,166,0.10)] backdrop-blur-xl sm:p-8">
                {children}
            </div>
            <p className="mt-6 text-center text-xs text-gray-400 mb-16">
                © 2026 Lolomaths. Tous droits réservés.
            </p>
        </div>
    </div>
);

export default FormContainer;