import { Hook, HookCategory } from './types';

/**
 * Filter hooks by search query (name and description)
 */
export function filterHooksBySearch(hooks: Hook[], query: string): Hook[] {
  if (!query.trim()) return hooks;

  const lowerQuery = query.toLowerCase();
  return hooks.filter(
    hook =>
      hook.name.toLowerCase().includes(lowerQuery) ||
      hook.description.toLowerCase().includes(lowerQuery) ||
      hook.topics.some(topic => topic.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Filter hooks by category
 */
export function filterHooksByCategory(
  hooks: Hook[],
  category: HookCategory | 'all'
): Hook[] {
  if (category === 'all') return hooks;
  return hooks.filter(hook => hook.category === category);
}

/**
 * Format date to relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
  if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
}

/**
 * Truncate text to a maximum length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Format number with K suffix (e.g., 1500 -> 1.5K)
 */
export function formatNumber(num: number): string {
  if (num < 1000) return num.toString();
  return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
}

/**
 * Get language icon/color based on programming language
 */
export function getLanguageColor(language: string | null): string {
  const colors: Record<string, string> = {
    Python: 'text-blue-400',
    TypeScript: 'text-blue-600',
    JavaScript: 'text-yellow-400',
    Go: 'text-cyan-500',
    Rust: 'text-orange-600',
    Java: 'text-red-500',
  };

  return colors[language || ''] || 'text-gray-400';
}

/**
 * Combine multiple filters
 */
export function applyFilters(
  hooks: Hook[],
  searchQuery: string,
  category: HookCategory | 'all'
): Hook[] {
  let filtered = hooks;

  if (searchQuery.trim()) {
    filtered = filterHooksBySearch(filtered, searchQuery);
  }

  if (category !== 'all') {
    filtered = filterHooksByCategory(filtered, category);
  }

  return filtered;
}

/**
 * Count hooks by category
 */
export function countByCategory(hooks: Hook[]): Record<HookCategory | 'all', number> {
  const counts: Record<string, number> = { all: hooks.length };

  hooks.forEach(hook => {
    counts[hook.category] = (counts[hook.category] || 0) + 1;
  });

  return counts as Record<HookCategory | 'all', number>;
}

/**
 * Debounce function for search input
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}
