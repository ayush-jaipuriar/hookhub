import { CategoryInfo, HookCategory } from './types';

// Category definitions with colors and keywords for auto-categorization
export const HOOK_CATEGORIES: readonly CategoryInfo[] = [
  {
    id: 'monitoring',
    label: 'Monitoring & Observability',
    description: 'Real-time tracking, logging, and debugging tools',
    color: 'bg-blue-500',
    keywords: [
      'monitor', 'observability', 'tracking', 'log', 'logging',
      'debug', 'debugging', 'trace', 'analytics', 'metrics',
      'telemetry', 'watch', 'real-time'
    ],
  },
  {
    id: 'validation',
    label: 'Validation & Quality',
    description: 'Code quality checks, linting, and testing',
    color: 'bg-green-500',
    keywords: [
      'validate', 'validation', 'test', 'testing', 'lint', 'linting',
      'quality', 'check', 'verify', 'assertion', 'coverage',
      'type-check', 'format', 'prettier', 'eslint'
    ],
  },
  {
    id: 'automation',
    label: 'Automation & Workflow',
    description: 'Task automation, CI/CD integration, and deployment',
    color: 'bg-purple-500',
    keywords: [
      'automate', 'automation', 'workflow', 'ci', 'cd', 'deploy',
      'deployment', 'build', 'pipeline', 'action', 'trigger',
      'schedule', 'cron', 'github-action'
    ],
  },
  {
    id: 'tools',
    label: 'Development Tools',
    description: 'Utilities, helpers, and code generation',
    color: 'bg-orange-500',
    keywords: [
      'util', 'utility', 'helper', 'tool', 'generate', 'generator',
      'scaffold', 'template', 'boilerplate', 'cli', 'command',
      'setup', 'config', 'configuration'
    ],
  },
  {
    id: 'ai-enhancement',
    label: 'AI Enhancement',
    description: 'Prompt engineering, context management, and memory',
    color: 'bg-pink-500',
    keywords: [
      'ai', 'prompt', 'context', 'memory', 'agent', 'llm',
      'gpt', 'claude', 'model', 'enhance', 'improvement',
      'optimization', 'learning', 'training'
    ],
  },
  {
    id: 'security',
    label: 'Security & Compliance',
    description: 'Security scanning, secret detection, and compliance checks',
    color: 'bg-red-500',
    keywords: [
      'security', 'secure', 'secret', 'credential', 'token',
      'compliance', 'audit', 'vulnerability', 'scan', 'check',
      'permission', 'access', 'auth', 'authentication'
    ],
  },
] as const;

// Map for quick lookup
export const CATEGORY_MAP = new Map(
  HOOK_CATEGORIES.map(cat => [cat.id, cat])
);

/**
 * Categorize a hook based on its description, name, and topics
 * Uses keyword matching to assign the most relevant category
 */
export function categorizeHook(
  name: string,
  description: string,
  topics: string[]
): HookCategory {
  const text = `${name} ${description} ${topics.join(' ')}`.toLowerCase();

  // Count keyword matches for each category
  const scores = HOOK_CATEGORIES.map(category => ({
    id: category.id,
    score: category.keywords.filter(keyword =>
      text.includes(keyword.toLowerCase())
    ).length,
  }));

  // Sort by score descending
  scores.sort((a, b) => b.score - a.score);

  // Return category with highest score, or 'uncategorized' if no matches
  return scores[0].score > 0 ? scores[0].id : 'uncategorized';
}

/**
 * Get category info by ID
 */
export function getCategoryInfo(categoryId: HookCategory): CategoryInfo | undefined {
  return CATEGORY_MAP.get(categoryId);
}

/**
 * Get all category IDs including 'uncategorized'
 */
export function getAllCategoryIds(): HookCategory[] {
  return [...HOOK_CATEGORIES.map(c => c.id), 'uncategorized'];
}
