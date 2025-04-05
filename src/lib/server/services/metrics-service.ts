import type { DBType } from '../db';
import * as table from '../db/schema';
import { eq, sql, and, gte } from 'drizzle-orm';
import { wrapResultAsync, wrapResultAsyncFn } from '../db/types';
import type { CacheService } from '../cache';
import { ResultAsync } from 'neverthrow';
import type { FormSchema } from '$lib/components/forms/widget-form/schema';
import type { z } from 'zod';
import type { GithubMetricsService, GithubStatType } from './github-metrics-service';
import { roundToDecimal } from '$lib/utils';

export class MetricsService {
  constructor(
    private readonly db: DBType,
    private readonly githubMetricsService: GithubMetricsService
  ) {}

  public getMetricsFromWidgetId(widgetId: string) {
    return wrapResultAsync(
      this.db.select().from(table.widgetMetric).where(eq(table.widgetMetric.widgetId, widgetId))
    );
  }

  public updateMetricValues(metrics: table.WidgetMetric[], cache: CacheService) {
    return ResultAsync.combine(
      metrics.map((metric) => {
        // Handle the githubStatType, cast it as the correct type or use default
        const githubStatType = (metric as any).githubStatType as GithubStatType | undefined;

        return this.computeMetricValue(
          metric.metricType,
          metric.objectiveId,
          metric.calculationType,
          metric.valueDecimalPrecision,
          metric.githubUsername,
          githubStatType || 'commits'
        ).andThen((value) => this.updateMetricValue(metric.id, value, cache));
      })
    );
  }

  public updateMetricValue(metricId: string, value: number, cache: CacheService) {
    return wrapResultAsyncFn(async () => {
      await this.db
        .update(table.widgetMetric)
        .set({ value })
        .where(eq(table.widgetMetric.id, metricId));

      // Invalidate the widget cache - run in parallel
      await Promise.all([
        cache.delete(`widget:${metricId}:html`),
        cache.delete(`widget:${metricId}:svg`),
      ]);
    });
  }

  public computeMetricValue(
    metricType: string,
    objectiveId: string | null,
    calculationType: table.WidgetMetric['calculationType'],
    valueDecimalPrecision: number,
    githubUsername?: string | null | undefined,
    githubStatType: GithubStatType = 'commits'
  ) {
    return wrapResultAsyncFn(async () => {
      // Handle GitHub metrics
      if (metricType === 'github' && typeof githubUsername === 'string') {
        const githubStatsResult = await this.githubMetricsService.fetchGitHubStats(
          githubUsername,
          calculationType as table.GithubStatsCache['timeRange'],
          githubStatType
        );

        if (githubStatsResult.isErr()) {
          throw githubStatsResult.error;
        }

        return githubStatsResult.value;
      }

      // Handle objective metrics
      if (metricType === 'objective' && objectiveId) {
        if (calculationType === 'percentage') {
          const objective = await this.db
            .select()
            .from(table.objective)
            .where(eq(table.objective.id, objectiveId));

          if (
            objective.length === 0 ||
            objective[0].goalType !== 'fixed' ||
            !objective[0].endValue
          ) {
            return 0;
          }

          // Calculate percentage of completion
          const percentage = (objective[0].value / objective[0].endValue) * 100;
          return roundToDecimal(percentage, valueDecimalPrecision);
        }

        if (calculationType === 'all time') {
          // No time filter needed for all time calculation
          const result = await this.db
            .select({
              total: sql<number>`SUM(${table.objectiveLog.value})`,
            })
            .from(table.objectiveLog)
            .where(eq(table.objectiveLog.objectiveId, objectiveId));

          const value = result[0]?.total || 0;
          return roundToDecimal(value, valueDecimalPrecision);
        } else {
          // Define time filter based on calculation type
          const timeAgo = new Date();
          if (calculationType === 'day') {
            timeAgo.setDate(timeAgo.getDate() - 1);
          } else if (calculationType === 'week') {
            timeAgo.setDate(timeAgo.getDate() - 7);
          } else if (calculationType === 'month') {
            timeAgo.setMonth(timeAgo.getMonth() - 1);
          } else if (calculationType === 'year') {
            timeAgo.setFullYear(timeAgo.getFullYear() - 1);
          } else {
            return 0; // Unknown calculation type
          }

          // Use SQL to filter by date and calculate sum in one operation
          const result = await this.db
            .select({
              total: sql<number>`SUM(${table.objectiveLog.value})`,
            })
            .from(table.objectiveLog)
            .where(
              and(
                eq(table.objectiveLog.objectiveId, objectiveId),
                gte(table.objectiveLog.loggedAt, timeAgo)
              )
            );

          const value = result[0]?.total || 0;
          return roundToDecimal(value, valueDecimalPrecision);
        }
      }

      // Default return if no conditions are met
      return 0;
    });
  }

  public async computePreviewMetricValues(metrics: z.infer<FormSchema>['metrics']) {
    // Process metrics sequentially to avoid type issues with ResultAsync.combine
    const results = [];
    for (const metric of metrics) {
      let value = 0;

      try {
        if (metric.metricType === 'github' && typeof metric.githubUsername === 'string') {
          // Use mock data for previews to avoid GitHub API rate limits
          const statType = (metric.githubStatType || 'commits') as GithubStatType;
          value = this.githubMetricsService.getMockGitHubData(
            statType,
            metric.calculationType as table.GithubStatsCache['timeRange']
          );
        } else if (metric.metricType === 'objective' && metric.objectiveId) {
          const result = await this.computeMetricValue(
            'objective',
            metric.objectiveId,
            metric.calculationType,
            metric.valueDecimalPrecision,
            null
          );
          if (result.isOk()) {
            value = result.value;
          }
        }
      } catch (error) {
        console.error('Error computing metric value:', error);
      }

      results.push(value);
    }

    return wrapResultAsync(Promise.resolve(results));
  }
}
