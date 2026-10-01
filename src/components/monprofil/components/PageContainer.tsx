"use client";

const PageContainer = ({ children }: { children: React.ReactNode }) => (
    <main className="relative max-w-2xl mx-auto px-4 py-8 sm:px-6 sm:py-12 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/20">
        {children}
    </main>
);

export default PageContainer;