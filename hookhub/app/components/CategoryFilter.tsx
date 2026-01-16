'use client';

import { HookCategory } from '@/lib/types';
import { HOOK_CATEGORIES } from '@/lib/categories';

interface CategoryFilterProps {
  selectedCategory: HookCategory | 'all';
  onCategoryChange: (category: HookCategory | 'all') => void;
  counts: Record<HookCategory | 'all', number>;
}

export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
  counts,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {/* All category */}
      <button
        onClick={() => onCategoryChange('all')}
        className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
          selectedCategory === 'all'
            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        All <span className="ml-1 opacity-70">({counts.all || 0})</span>
      </button>

      {/* Category buttons */}
      {HOOK_CATEGORIES.map(category => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
            selectedCategory === category.id
              ? `${category.color} text-white`
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {category.label}{' '}
          <span className="ml-1 opacity-70">
            ({counts[category.id] || 0})
          </span>
        </button>
      ))}
    </div>
  );
}
