'use client';
import { default as React } from 'react';
import WelcomePageClient from '../../login/welcome/WelcomePageClient';

const FormContainer = ({ children }: { children: React.ReactNode }) => (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-2">
        <div className="bg-white p-4">
            {children}
        </div>
        <WelcomePageClient />
    </div>
);

export default FormContainer;