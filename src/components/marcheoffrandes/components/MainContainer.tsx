'use client';

const MainContainer = ({ children }: { children: React.ReactNode }) => (
    <div className="mx-auto px-3 mt-16 sm:px-4 lg:px-6 py-6 sm:py-8 max-w-7xl dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {children}
    </div>
);

export default MainContainer;