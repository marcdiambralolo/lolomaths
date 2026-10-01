'use client';

const Divider = () => (
    <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
        <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
    </div>
);

export default Divider;