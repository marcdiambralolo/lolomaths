'use client';
import { memo } from 'react';

const MainContainer = ({ children }: { children: React.ReactNode }) => (
    <div className="w-full mx-auto max-w-md px-2 flex flex-col gap-4 items-center justify-center">
        {children}
    </div>
);

export default MainContainer;