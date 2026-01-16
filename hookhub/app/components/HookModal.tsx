'use client';

import { useEffect } from 'react';
import { Hook } from '@/lib/types';
import { getCategoryInfo } from '@/lib/categories';
import { formatRelativeTime, formatNumber } from '@/lib/utils';
import Image from 'next/image';

interface HookModalProps {
  hook: Hook | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function HookModal({ hook, isOpen, onClose }: HookModalProps) {
  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !hook) return null;

  const categoryInfo = getCategoryInfo(hook.category);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Image
                src={hook.owner.avatarUrl}
                alt={`${hook.owner.login} avatar`}
                width={48}
                height={48}
                className="rounded-full ring-2 ring-gray-100 dark:ring-gray-700"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {hook.name}
                </h2>
                <a
                  href={`https://github.com/${hook.owner.login}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  @{hook.owner.login}
                </a>
              </div>
            </div>

            {/* Category Badge */}
            {categoryInfo && (
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${categoryInfo.color}`}
              >
                {categoryInfo.label}
              </span>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Description
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {hook.description}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-yellow-500 mb-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Stars</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(hook.stars)}
              </p>
            </div>

            {hook.language && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Language
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {hook.language}
                </p>
              </div>
            )}

            {hook.license && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  License
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {hook.license}
                </p>
              </div>
            )}

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Updated
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatRelativeTime(hook.lastUpdated)}
              </p>
            </div>
          </div>

          {/* Topics */}
          {hook.topics.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {hook.topics.map(topic => (
                  <span
                    key={topic}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Installation Hint */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
              💡 Installation
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Visit the repository to find installation instructions and hook files in the{' '}
              <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900 rounded text-xs">
                .claude/hooks/
              </code>{' '}
              directory.
            </p>
          </div>
        </div>

        {/* Footer - CTA Button */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6">
          <a
            href={hook.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            View on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
