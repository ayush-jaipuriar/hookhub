'use client';

import { Hook } from '@/lib/types';
import { getCategoryInfo } from '@/lib/categories';
import { formatRelativeTime, formatNumber, getLanguageColor, truncateText } from '@/lib/utils';
import Image from 'next/image';

interface HookCardProps {
  hook: Hook;
  onClick: () => void;
}

export default function HookCard({ hook, onClick }: HookCardProps) {
  const categoryInfo = getCategoryInfo(hook.category);

  return (
    <button
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 p-6 text-left w-full group hover:scale-[1.02] border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
    >
      {/* Owner Avatar + Username */}
      <div className="flex items-center gap-3 mb-4">
        <Image
          src={hook.owner.avatarUrl}
          alt={`${hook.owner.login} avatar`}
          width={40}
          height={40}
          className="rounded-full ring-2 ring-gray-100 dark:ring-gray-700"
        />
        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          {hook.owner.login}
        </span>
      </div>

      {/* Hook Name */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {hook.name}
      </h3>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
        {truncateText(hook.description, 120)}
      </p>

      {/* Category Badge */}
      {categoryInfo && (
        <div className="mb-4">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${categoryInfo.color}`}
          >
            {categoryInfo.label}
          </span>
        </div>
      )}

      {/* Footer: Stars + Language + Last Updated */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          {/* Stars */}
          <div className="flex items-center gap-1 text-yellow-500">
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {formatNumber(hook.stars)}
            </span>
          </div>

          {/* Language */}
          {hook.language && (
            <div className="flex items-center gap-1">
              <span className={`w-3 h-3 rounded-full ${getLanguageColor(hook.language)}`} />
              <span className="text-gray-600 dark:text-gray-400 text-xs">
                {hook.language}
              </span>
            </div>
          )}
        </div>

        {/* Last Updated */}
        <span className="text-xs text-gray-500 dark:text-gray-500">
          {formatRelativeTime(hook.lastUpdated)}
        </span>
      </div>
    </button>
  );
}
