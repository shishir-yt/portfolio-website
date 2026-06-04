import React from 'react';
import type { Category } from '../types/game';

interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  onClick: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 no-tap-highlight min-h-[88px] flex items-center gap-4 ${
        isSelected 
          ? 'border-game-primary bg-game-primary/5 shadow-md shadow-game-primary/10 translate-y-[-2px]' 
          : 'border-gray-100 bg-white shadow-sm hover:border-gray-200 hover:shadow-md hover:translate-y-[-1px]'
      }`}
      aria-pressed={isSelected}
    >
      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl flex-shrink-0 shadow-sm border border-gray-100" aria-hidden="true">
        {category.icon}
      </div>
      <div className="flex-1">
        <h3 className={`font-bold text-lg m-0 transition-colors ${isSelected ? 'text-game-primary' : 'text-game-text'}`}>{category.name}</h3>
        <p className="text-gray-500 text-sm m-0 mt-0.5 leading-snug">{category.description}</p>
      </div>
      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
        isSelected 
          ? 'bg-game-primary border-game-primary text-white scale-110 shadow-sm' 
          : 'border-gray-300 bg-transparent'
      }`}>
        {isSelected && (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="animate-in zoom-in duration-200">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        )}
      </div>
    </button>
  );
};
