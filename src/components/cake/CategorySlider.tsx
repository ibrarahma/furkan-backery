import React from 'react';
import { CakeCategory } from '../../types/cake';

interface CategorySliderProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: CakeCategory[];
}

export function CategorySlider({
  selectedCategory,
  onSelectCategory,
  categories,
}: CategorySliderProps) {
  const allOptions = ['All Cakes', ...categories];

  return (
    <div className="w-full">
      {/* Horizontal scrollable track with subtle scroll indicators */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1 -mx-1 scroll-smooth">
        {allOptions.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer border shrink-0 ${
                isSelected
                  ? 'bg-[#2A1E17] text-white border-[#2A1E17] shadow-sm'
                  : 'bg-white text-stone-700 border-[#EADBCE] hover:border-stone-400 hover:bg-[#FAF7F2]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
