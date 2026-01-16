'use client';

import { Hook } from '@/lib/types';
import HookCard from './HookCard';

interface HookGridProps {
  hooks: Hook[];
  onHookClick: (hook: Hook) => void;
}

export default function HookGrid({ hooks, onHookClick }: HookGridProps) {
  if (hooks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No hooks found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {hooks.map(hook => (
        <HookCard key={hook.id} hook={hook} onClick={() => onHookClick(hook)} />
      ))}
    </div>
  );
}
