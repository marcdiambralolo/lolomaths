"use client";

const DetailRow = ({ label, value, mono = false, small = false }: { label: string; value: string; mono?: boolean; small?: boolean }) => (
    <div className="flex justify-between text-sm">
        <span className="text-gray-500">{label}</span>
        <span className={`font-medium text-gray-800 ${mono ? 'font-mono' : ''} ${small ? 'text-xs bg-gray-100 px-2 py-1 rounded' : ''}`}>
            {value}
        </span>
    </div>
);

export default DetailRow;