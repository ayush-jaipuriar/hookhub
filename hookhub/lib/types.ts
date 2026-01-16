// Core types for HookHub application

export type HookCategory =
  | 'monitoring'
  | 'validation'
  | 'automation'
  | 'tools'
  | 'ai-enhancement'
  | 'security'
  | 'uncategorized';

export interface Hook {
  id: string;                    // Unique identifier (repo full_name)
  name: string;                  // Repository name
  fullName: string;              // owner/repo format
  description: string;           // Repository description
  category: HookCategory;        // Assigned category
  repoUrl: string;              // GitHub repository URL
  stars: number;                 // Star count
  lastUpdated: string;           // ISO date string
  owner: {
    login: string;               // Owner username
    avatarUrl: string;           // Owner avatar URL
  };
  language: string | null;       // Primary language (Python, TypeScript, etc.)
  topics: string[];              // GitHub topics
  license: string | null;        // License type (MIT, Apache, etc.)
  readme?: string;               // README content (for modal)
  hookFiles?: HookFile[];        // List of hook scripts (for modal)
}

export interface HookFile {
  name: string;                  // File name (e.g., "pre-commit.py")
  path: string;                  // Full path in repo
  type: 'python' | 'typescript' | 'other'; // File type
  url: string;                   // GitHub file URL
}

export interface CategoryInfo {
  id: HookCategory;
  label: string;
  description: string;
  color: string;                 // Tailwind color class
  keywords: string[];            // Keywords for auto-categorization
}

export interface HooksResponse {
  hooks: Hook[];
  totalCount: number;
  fetchedAt: string;             // ISO timestamp
  cached?: boolean;              // Whether data is from cache
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  updated_at: string;
  language: string | null;
  topics: string[];
  owner: {
    login: string;
    avatar_url: string;
  };
  license: {
    key: string;
    name: string;
  } | null;
}

export interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepository[];
}
