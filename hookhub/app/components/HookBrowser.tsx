'use client';

import { useState, useMemo } from 'react';
import { Hook, HookCategory } from '@/lib/types';
import { applyFilters, countByCategory } from '@/lib/utils';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';
import HookGrid from './HookGrid';
import HookModal from './HookModal';

interface HookBrowserProps {
  initialHooks: Hook[];
}

export default function HookBrowser({ initialHooks }: HookBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<HookCategory | 'all'>('all');
  const [selectedHook, setSelectedHook] = useState<Hook | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Apply filters
  const filteredHooks = useMemo(
    () => applyFilters(initialHooks, searchQuery, selectedCategory),
    [initialHooks, searchQuery, selectedCategory]
  );

  // Count hooks by category
  const counts = useMemo(() => countByCategory(initialHooks), [initialHooks]);

  const handleHookClick = (hook: Hook) => {
    setSelectedHook(hook);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedHook(null), 300);
  };

  return (
    <>
      {/* Search and Filter Section */}
      <div className="space-y-6 mb-8">
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search hooks by name, description, or topics..."
        />
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          counts={counts}
        />
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredHooks.length}</span> of{' '}
          <span className="font-semibold text-gray-900 dark:text-white">{initialHooks.length}</span> hooks
        </p>
      </div>

      {/* Hooks Grid */}
      <HookGrid hooks={filteredHooks} onHookClick={handleHookClick} />

      {/* Modal */}
      <HookModal hook={selectedHook} isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}
