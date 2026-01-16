import { GitHubSearchResponse, GitHubRepository, Hook } from './types';
import { categorizeHook } from './categories';

const GITHUB_API_BASE = 'https://api.github.com';

// Curated list of known Claude hooks repositories
const CURATED_REPOS = [
  'disler/claude-code-hooks-mastery',
  'johnlindquist/claude-hooks',
  'ChrisWiles/claude-code-showcase',
  'disler/claude-code-hooks-multi-agent-observability',
  'carlrannaberg/claudekit',
  'decider/claude-hooks',
];

/**
 * Fetch repositories with the claude-hooks topic from GitHub
 */
export async function searchClaudeHooks(
  token?: string
): Promise<GitHubRepository[]> {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    // Search for repositories with claude-hooks topic
    const searchQuery = 'topic:claude-hooks stars:>0 archived:false';
    const url = `${GITHUB_API_BASE}/search/repositories?q=${encodeURIComponent(
      searchQuery
    )}&sort=stars&order=desc&per_page=100`;

    const response = await fetch(url, { headers });

    if (!response.ok) {
      // Check for rate limiting
      if (response.status === 403) {
        const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
        if (rateLimitRemaining === '0') {
          throw new Error('GitHub API rate limit exceeded');
        }
      }
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data: GitHubSearchResponse = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error fetching Claude hooks from GitHub:', error);
    throw error;
  }
}

/**
 * Fetch a specific repository by owner/repo
 */
export async function fetchRepository(
  fullName: string,
  token?: string
): Promise<GitHubRepository> {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${GITHUB_API_BASE}/repos/${fullName}`;
  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`Failed to fetch repository ${fullName}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch multiple curated repositories
 */
export async function fetchCuratedRepos(token?: string): Promise<GitHubRepository[]> {
  const promises = CURATED_REPOS.map(repo =>
    fetchRepository(repo, token).catch(err => {
      console.warn(`Failed to fetch curated repo ${repo}:`, err);
      return null;
    })
  );

  const results = await Promise.all(promises);
  return results.filter((repo): repo is GitHubRepository => repo !== null);
}

/**
 * Transform GitHub repository data to Hook format
 */
export function transformToHook(repo: GitHubRepository): Hook {
  const category = categorizeHook(
    repo.name,
    repo.description || '',
    repo.topics || []
  );

  return {
    id: repo.full_name,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description || 'No description provided',
    category,
    repoUrl: repo.html_url,
    stars: repo.stargazers_count,
    lastUpdated: repo.updated_at,
    owner: {
      login: repo.owner.login,
      avatarUrl: repo.owner.avatar_url,
    },
    language: repo.language,
    topics: repo.topics || [],
    license: repo.license?.name || null,
  };
}

/**
 * Fetch all Claude hooks (search + curated)
 */
export async function fetchAllHooks(token?: string): Promise<Hook[]> {
  try {
    // Fetch from search API
    const searchResults = await searchClaudeHooks(token);

    // Fetch curated repos
    const curatedResults = await fetchCuratedRepos(token);

    // Combine and deduplicate by full_name
    const allRepos = [...searchResults, ...curatedResults];
    const uniqueRepos = Array.from(
      new Map(allRepos.map(repo => [repo.full_name, repo])).values()
    );

    // Transform to Hook format
    const hooks = uniqueRepos.map(transformToHook);

    // Sort by stars descending
    hooks.sort((a, b) => b.stars - a.stars);

    return hooks;
  } catch (error) {
    console.error('Error fetching all hooks:', error);
    throw error;
  }
}

/**
 * Check GitHub API rate limit status
 */
export async function checkRateLimit(token?: string): Promise<{
  limit: number;
  remaining: number;
  reset: number;
}> {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${GITHUB_API_BASE}/rate_limit`, { headers });
  const data = await response.json();

  return {
    limit: data.rate.limit,
    remaining: data.rate.remaining,
    reset: data.rate.reset,
  };
}
