import { format } from 'date-fns';
import { and, eq, gt } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

import type { DBType } from '../db';
import * as table from '../db/schema';
import { wrapResultAsyncFn } from '../db/types';

// Valid time ranges
export type GithubTimeRange = 'day' | 'week' | 'month' | 'year' | 'all time';

// Time-series data point for GitHub metrics
export type GithubDataPoint = {
  date: string;
  value: number;
};

export class GithubMetricsService {
  constructor(private readonly db: DBType) {}

  // Try to get GitHub stats from cache
  public async getGitHubStatsFromCache(
    username: string,
    statType: table.GithubStatsCache['statType'],
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
    statType: table.GithubStatsCache['statType'],
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

  // Method to fetch commits data with optional pagination
  private async fetchCommitsWithPagination(
    username: string,
    fromDate?: Date,
    shouldPaginate = false,
    maxPages = 10
  ): Promise<number> {
    // TODO: Use this API: https://docs.github.com/en/rest/metrics/statistics?apiVersion=2022-11-28#get-the-last-year-of-commit-activity
    const dateQuery = fromDate ? `+author-date:>${fromDate.toISOString().split('T')[0]}` : '';
    const baseUrl = `https://api.github.com/search/commits?q=author:${username}${dateQuery}&per_page=100`;

    try {
      // First make a request to get the total count
      const response = await fetch(baseUrl, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'request',
        },
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      const data = (await response.json()) as {
        total_count: number;
        items: any[];
        incomplete_results: boolean;
      };

      // If not paginating, just return the total count from the first page
      if (!shouldPaginate) {
        return data.total_count || 0;
      }

      // Otherwise, paginate to get actual commits
      let page = 2; // Start from page 2 since we already fetched page 1
      let totalCommits = data.items.length;
      let hasMorePages =
        data.items.length < data.total_count &&
        !data.incomplete_results &&
        data.items.length === 100;

      while (hasMorePages && page <= maxPages) {
        const url = `${baseUrl}&page=${page}`;
        const pageResponse = await fetch(url, {
          headers: {
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'request',
          },
        });

        if (!pageResponse.ok) {
          throw new Error(`GitHub API error: ${pageResponse.statusText}`);
        }

        const pageData = (await pageResponse.json()) as {
          items: any[];
          incomplete_results: boolean;
        };

        totalCommits += pageData.items.length;
        hasMorePages = pageData.items.length === 100 && !pageData.incomplete_results;

        page++;

        // Rate limiting safety - pause between requests
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      return totalCommits;
    } catch (error) {
      console.error('Error fetching commits with pagination:', error);
      throw error;
    }
  }

  // Method to fetch different types of GitHub data
  public async fetchGitHubData(
    username: string,
    statType: table.GithubStatsCache['statType'],
    fromDate?: Date
  ): Promise<number> {
    try {
      switch (statType) {
        case 'commits': {
          // Use pagination=false since we just need the total count
          return this.fetchCommitsWithPagination(username, fromDate, false);
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

  // Method to fetch time-series data for plotting
  public fetchGitHubTimeSeries(
    username: string,
    statType: table.GithubStatsCache['statType'],
    _timeRange: GithubTimeRange,
    formatString: string
  ) {
    return wrapResultAsyncFn(async () => {
      const now = new Date();
      // const dataPoints: GithubDataPoint[] = [];

      // For repositories and followers, we just get the current count
      if (statType === 'repositories' || statType === 'followers') {
        const value = await this.fetchGitHubData(username, statType);
        return [
          {
            date: format(now, formatString),
            value,
          },
        ];
      }
      // TODO: Implement commits time series data
      throw new Error('Commits time series data not implemented');
    });
  }

  // Method to fetch GitHub stats for a user
  public fetchGitHubStats(
    username: string,
    timeRange: table.GithubStatsCache['timeRange'],
    statType: table.GithubStatsCache['statType'] = 'commits',
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

      // Use pagination=false since we just need the total count
      const value = await this.fetchGitHubData(username, statType, fromDate);

      // Save to cache if caching is enabled
      if (useCache) {
        await this.saveGitHubStatsToCache(username, statType, timeRange, value);
      }

      return value;
    });
  }
}
