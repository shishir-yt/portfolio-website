import React from 'react';
import { Button } from '../components/Button';
import { CategoryCard } from '../components/CategoryCard';
import { CATEGORIES } from '../data/categories';

interface CategorySelectionProps {
  selectedCategoryIds: string[];
  onSelectCategory: (id: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const CategorySelection: React.FC<CategorySelectionProps> = ({
  selectedCategoryIds,
  onSelectCategory,
  onContinue,
  onBack
}) => {
  return (
    <div className="flex flex-col w-full max-w-md mx-auto p-6 min-h-screen">
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-8 pt-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
            aria-label="Go back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <h2 className="text-2xl font-bold m-0">Choose a category</h2>
        </div>

        <div className="space-y-3">
          {CATEGORIES.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              isSelected={selectedCategoryIds.includes(category.id)}
              onClick={() => onSelectCategory(category.id)}
            />
          ))}
        </div>
      </div>

      <div className="w-full pb-8 pt-6 bg-game-bg">
        <Button 
          fullWidth 
          size="lg" 
          onClick={onContinue}
          disabled={selectedCategoryIds.length === 0}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
