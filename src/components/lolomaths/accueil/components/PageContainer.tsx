'use client';

const PageContainer = ({ children }: { children: React.ReactNode }) => (
    <div className="w-full mx-auto max-w-md mb-8 mt-8">
        {children}
    </div>
);

export default PageContainer;