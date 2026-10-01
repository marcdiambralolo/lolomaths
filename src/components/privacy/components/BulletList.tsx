'use client';

const BulletList = ({ items, className = "" }: { items: string[]; className?: string }) => (
    <ul className={`list-disc pl-5 space-y-1.5 ${className}`}>
        {items.map((item, index) => (
            <li key={index} className="text-gray-600">{item}</li>
        ))}
    </ul>
);

export default BulletList;