"use client";

const PageContainer = ({ children }: { children: React.ReactNode }) => (
    <div className="mx-auto w-full max-w-xl px-4 py-8 sm:px-6 sm:py-12">
        {children}
    </div>
);

export default PageContainer;