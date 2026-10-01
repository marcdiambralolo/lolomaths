'use client';

const SubSection = ({ title, children }: { title?: string; children: React.ReactNode }) => (
    <div className={title ? "mt-4" : ""}>
        {title && <h3 className="font-semibold text-purple-700 mb-2">{title}</h3>}
        <div className="space-y-2">
            {children}
        </div>
    </div>
);

export default SubSection;