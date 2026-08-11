"use client";

const Divider: React.FC = () => (
    <div className="relative my-12">
        <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200/60"></div>
        </div>
        <div className="relative flex justify-center">
            <span className="px-4 bg-white text-gray-300 text-sm">✦</span>
        </div>
    </div>
);

export default Divider;