import type { DBType } from '../db';
import * as table from '../db/schema';
import { eq, sql, and, gte } from 'drizzle-orm';
import { wrapResultAsync, wrapResultAsyncFn } from '../db/types';
import type { CacheService } from '../cache';
import { ResultAsync } from 'neverthrow';
import type { FormSchema } from '$lib/components/forms/widget-form/schema';
import type { z } from 'zod';

export class MetricsService {
  constructor(private readonly db: DBType) {}

  public getMetricsFromWidgetId(widgetId: string) {
    return wrapResultAsync(
      this.db.select().from(table.widgetMetric).where(eq(table.widgetMetric.widgetId, widgetId))
    );
  }

  public updateMetricValues(metrics: table.WidgetMetric[], cache: CacheService) {
    return ResultAsync.combine(
      metrics.map((metric) =>
        this.computeMetricValue(
          metric.objectiveId,
          metric.calculationType,
          metric.valueDecimalPrecision
        ).andThen((value) => this.updateMetricValue(metric.id, value, cache))
      )
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
    objectiveId: string,
    calculationType: string,
    valueDecimalPrecision: number
  ) {
    return wrapResultAsyncFn(async () => {
      if (calculationType === 'percentage') {
        const objective = await this.db
          .select()
          .from(table.objective)
          .where(eq(table.objective.id, objectiveId));

        if (objective.length === 0 || objective[0].goalType !== 'fixed' || !objective[0].endValue) {
          return 0;
        }

        // Calculate percentage of completion
        const percentage = (objective[0].value / objective[0].endValue) * 100;
        return Math.round(percentage * 10 ** valueDecimalPrecision) / 10 ** valueDecimalPrecision;
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
        return Math.round(value * 10 ** valueDecimalPrecision) / 10 ** valueDecimalPrecision;
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
        return Math.round(value * 10 ** valueDecimalPrecision) / 10 ** valueDecimalPrecision;
      }
    });
  }

  public computePreviewMetricValues(metrics: z.infer<FormSchema>['metrics']) {
    return ResultAsync.combine(
      metrics.map((metric) =>
        this.computeMetricValue(
          metric.objectiveId,
          metric.calculationType,
          metric.valueDecimalPrecision
        )
      )
    );
  }
}
