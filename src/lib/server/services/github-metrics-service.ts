import type { DBType } from '../db';
import * as table from '../db/schema';
import { eq, and, gt } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { wrapResultAsyncFn } from '../db/types';

// Valid GitHub stat types
export type GithubStatType = 'commits' | 'repositories' | 'followers';

// Mock data for previews
export const MOCK_GITHUB_DATA = {
  commits: {
    day: 3,
    week: 12,
    month: 47,
    year: 230,
    'all time': 580,
  },
  repositories: {
    day: 0,
    week: 1,
    month: 3,
    year: 8,
    'all time': 15,
  },
  followers: {
    day: 1,
    week: 5,
    month: 12,
    year: 45,
    'all time': 120,
  },
};

export class GithubMetricsService {
  constructor(private readonly db: DBType) {}

  // Try to get GitHub stats from cache
  public async getGitHubStatsFromCache(
    username: string,
    statType: GithubStatType,
    timeRange: table.GithubStatsCache['timeRange']
  ) {
    const now = new Date();

    const cachedStats = await this.db
      .select()
      .from(table.githubStatsCache)
      .where(
        and(
          eq(table.githubStatsCache.username, username),
          eq(table.githubStatsCache.statType, statType),
          eq(table.githubStatsCache.timeRange, timeRange),
          gt(table.githubStatsCache.expiresAt, now)
        )
      );

    if (cachedStats.length > 0) {
      return cachedStats[0].value;
    }

    return null;
  }

  // Save GitHub stats to cache
  public async saveGitHubStatsToCache(
    username: string,
    statType: GithubStatType,
    timeRange: table.GithubStatsCache['timeRange'],
    value: number
  ) {
    const now = new Date();

    // Calculate expiration time (cache for 1 hour)
    const expiresAt = new Date(now.getTime() + 3600 * 1000);

    // Check if we have an existing record
    const existingCache = await this.db
      .select()
      .from(table.githubStatsCache)
      .where(
        and(
          eq(table.githubStatsCache.username, username),
          eq(table.githubStatsCache.statType, statType),
          eq(table.githubStatsCache.timeRange, timeRange)
        )
      );

    if (existingCache.length > 0) {
      // Update existing record
      await this.db
        .update(table.githubStatsCache)
        .set({
          value,
          lastUpdated: now,
          expiresAt,
        })
        .where(eq(table.githubStatsCache.id, existingCache[0].id));
    } else {
      // Insert new record
      await this.db.insert(table.githubStatsCache).values({
        id: uuidv4(),
        username,
        statType,
        timeRange,
        value,
        lastUpdated: now,
        expiresAt,
      });
    }

    return value;
  }

  // Method to fetch different types of GitHub data
  public async fetchGitHubData(
    username: string,
    statType: GithubStatType,
    fromDate?: Date
  ): Promise<number> {
    try {
      switch (statType) {
        case 'commits': {
          // If fromDate is provided, filter commits by date
          if (fromDate) {
            const fromDateStr = fromDate.toISOString().split('T')[0];
            const url = `https://api.github.com/search/commits?q=author:${username}+author-date:>${fromDateStr}&per_page=1`;
            const response = await fetch(url, {
              headers: {
                Accept: 'application/vnd.github.v3+json',
                'User-Agent': 'request',
              },
            });

            if (!response.ok) {
              throw new Error(`GitHub API error: ${response.statusText}`);
            }

            const data = (await response.json()) as { total_count: number };
            return data.total_count || 0;
          } else {
            // Get all commits if no date constraint
            const url = `https://api.github.com/search/commits?q=author:${username}&per_page=1`;
            const response = await fetch(url, {
              headers: {
                Accept: 'application/vnd.github.v3+json',
                'User-Agent': 'request',
              },
            });

            if (!response.ok) {
              throw new Error(`GitHub API error: ${response.statusText}`);
            }

            const data = (await response.json()) as { total_count: number };
            return data.total_count || 0;
          }
        }
        case 'repositories': {
          // Get user's repositories count
          const reposUrl = `https://api.github.com/users/${username}`;
          const reposResponse = await fetch(reposUrl, {
            headers: {
              'User-Agent': 'request',
            },
          });

          if (!reposResponse.ok) {
            throw new Error(`GitHub API error: ${reposResponse.statusText}`);
          }

          const userData = (await reposResponse.json()) as {
            public_repos: number;
          };

          return userData.public_repos || 0;
        }

        case 'followers': {
          // Get user's followers count
          const followersUrl = `https://api.github.com/users/${username}`;
          const followersResponse = await fetch(followersUrl, {
            headers: {
              'User-Agent': 'request',
            },
          });

          if (!followersResponse.ok) {
            throw new Error(`GitHub API error: ${followersResponse.statusText}`);
          }

          const followersData = (await followersResponse.json()) as {
            followers: number;
          };

          return followersData.followers || 0;
        }

        default:
          return 0;
      }
    } catch (error) {
      console.error(`Error fetching GitHub ${statType}:`, error);
      throw error;
    }
  }

  // Method to fetch GitHub stats for a user
  public fetchGitHubStats(
    username: string,
    timeRange: table.GithubStatsCache['timeRange'],
    statType: GithubStatType = 'commits',
    useCache = true
  ) {
    return wrapResultAsyncFn(async () => {
      // Check cache first if enabled
      if (useCache) {
        const cachedValue = await this.getGitHubStatsFromCache(username, statType, timeRange);
        if (cachedValue !== null) {
          return cachedValue;
        }
      }

      // For repositories and followers, the time range doesn't matter
      // since we're getting the current count
      if (statType === 'repositories' || statType === 'followers') {
        const value = await this.fetchGitHubData(username, statType);

        // Save to cache if caching is enabled
        if (useCache) {
          await this.saveGitHubStatsToCache(username, statType, timeRange, value);
        }

        return value;
      }

      // For commits, determine the time range
      const now = new Date();
      let fromDate = new Date();

      switch (timeRange) {
        case 'day':
          fromDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          fromDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          fromDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          fromDate.setFullYear(now.getFullYear() - 1);
          break;
        case 'all time':
          // No date restriction for all time
          fromDate = new Date(0);
          break;
        default:
          fromDate.setDate(now.getDate() - 7); // Default to week
      }

      const value = await this.fetchGitHubData(username, statType, fromDate);

      // Save to cache if caching is enabled
      if (useCache) {
        await this.saveGitHubStatsToCache(username, statType, timeRange, value);
      }

      return value;
    });
  }

  // Get mock data for previews
  public getMockGitHubData(
    statType: GithubStatType,
    timeRange: table.GithubStatsCache['timeRange']
  ): number {
    return MOCK_GITHUB_DATA[statType][timeRange] || 0;
  }
}
