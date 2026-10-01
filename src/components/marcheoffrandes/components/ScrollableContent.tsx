'use client';

const ScrollableContent = ({ children }: { children: React.ReactNode }) => (
    <div className="p-4 max-h-[600px] overflow-y-auto">
        {children}
    </div>
);

export default ScrollableContent;