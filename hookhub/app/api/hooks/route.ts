import { NextResponse } from 'next/server';
import { fetchAllHooks } from '@/lib/github';
import { HooksResponse } from '@/lib/types';

// Revalidate every hour (3600 seconds)
export const revalidate = 3600;

/**
 * GET /api/hooks
 * Fetches all Claude hooks from GitHub API
 */
export async function GET() {
  try {
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      console.warn('GITHUB_TOKEN not set. API rate limits will be restrictive.');
    }

    // Fetch hooks from GitHub
    const hooks = await fetchAllHooks(token);

    const response: HooksResponse = {
      hooks,
      totalCount: hooks.length,
      fetchedAt: new Date().toISOString(),
      cached: false,
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('Error in /api/hooks:', error);

    // Check if it's a rate limit error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isRateLimit = errorMessage.includes('rate limit');

    return NextResponse.json(
      {
        error: isRateLimit
          ? 'GitHub API rate limit exceeded. Please try again later.'
          : 'Failed to fetch hooks from GitHub',
        message: errorMessage,
      },
      {
        status: isRateLimit ? 429 : 500,
      }
    );
  }
}
