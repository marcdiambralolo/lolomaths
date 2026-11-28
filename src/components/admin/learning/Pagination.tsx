'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="flex justify-center items-center gap-2 mt-8 bg-red dark:bg-gray-800 p-4 rounded-lg">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 bg-orange-400 dark:border-gray-700 hover:bg-orange-400 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            {getPageNumbers().map((page, index) => (
                page === '...' ? (
                    <span key={`dots-${index}`} className="px-2 text-gray-400">...</span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page as number)}
                        className={`min-w-[40px] h-10 px-3 rounded-lg font-medium transition ${page === currentPage
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                            : 'border  bg-green-400 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                    >
                        {page}
                    </button>
                )
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300  bg-orange-400 dark:border-gray-700 hover:bg-orange-400 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
}

export default Pagination;