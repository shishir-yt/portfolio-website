import React from 'react';

interface ProgressDotsProps {
  total: number;
  current: number; // 0-indexed
}

export const ProgressDots: React.FC<ProgressDotsProps> = ({ total, current }) => {
  return (
    <div className="bg-gray-100/80 backdrop-blur-sm border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm inline-flex items-center justify-center">
      {current + 1} of {total}
    </div>
  );
};
