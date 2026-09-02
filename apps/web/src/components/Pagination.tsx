import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  className = ''
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) return null;

  const startItem = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers to display with sliding window
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
    <div className={`flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E3E0D4] ${className}`}>
      {/* Item summary counter */}
      <div className="text-xs text-stone-500 font-medium">
        Showing <span className="font-bold text-stone-800 font-mono">{startItem}</span> to{' '}
        <span className="font-bold text-stone-800 font-mono">{endItem}</span> of{' '}
        <span className="font-bold text-stone-800 font-mono">{totalItems}</span> records
      </div>

      {/* Pagination button controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-xl text-xs font-bold transition flex items-center justify-center ${
            currentPage === 1
              ? 'text-stone-300 bg-stone-100 cursor-not-allowed'
              : 'text-stone-700 bg-white hover:bg-[#EFECE6] border border-[#DBD7C9] cursor-pointer shadow-2xs'
          }`}
          title="Previous Page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) => {
            if (p === '...') {
              return (
                <span key={`ellipsis-${idx}`} className="px-2 text-stone-400 text-xs select-none">
                  ...
                </span>
              );
            }
            const isCurrent = p === currentPage;
            return (
              <button
                key={`page-${p}`}
                onClick={() => onPageChange(Number(p))}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer font-mono flex items-center justify-center ${
                  isCurrent
                    ? 'bg-[#E36138] text-white shadow-2xs shadow-orange-500/20'
                    : 'bg-white text-stone-700 hover:bg-[#EFECE6] border border-[#DBD7C9]'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-xl text-xs font-bold transition flex items-center justify-center ${
            currentPage === totalPages
              ? 'text-stone-300 bg-stone-100 cursor-not-allowed'
              : 'text-stone-700 bg-white hover:bg-[#EFECE6] border border-[#DBD7C9] cursor-pointer shadow-2xs'
          }`}
          title="Next Page"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
