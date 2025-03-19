import * as table from '../db/schema';
import { eq, sql, and, gte } from 'drizzle-orm';
import { type DBType } from '../db';
import type { CacheService } from '../cache';

/**
 * Gets metrics from a widget ID
 * @param widgetId The ID of the widget
 * @param db The database instance
 * @returns The metrics
 */
export async function getMetricsFromWidgetId(db: DBType, widgetId: string) {
  const metrics = await db
    .select()
    .from(table.widgetMetric)
    .where(eq(table.widgetMetric.widgetId, widgetId));

  return metrics;
}

/**
 * Updates a metric value
 * @param db The database instance
 * @param metricId The ID of the metric
 * @param value The new value
 * @param cache The cache instance
 */
export async function updateMetricValue(
  db: DBType,
  metricId: string,
  value: number,
  cache: CacheService
) {
  await db.update(table.widgetMetric).set({ value }).where(eq(table.widgetMetric.id, metricId));

  // Invalidate the widget cache - run in parallel
  await Promise.all([
    cache.delete(`widget:${metricId}:html`),
    cache.delete(`widget:${metricId}:svg`),
  ]);
}

/**
 * Computes metric values for objectives
 * @param db The database instance
 * @param objectiveId The ID of the objective
 * @param calculationType The calculation type ('day', 'week', 'month', 'year', 'all time', 'percentage')
 * @param valueDecimalPrecision The number of decimal places to round the metric value to
 * @returns The computed metric value
 */
export async function computeMetricValue(
  db: DBType,
  objectiveId: string,
  calculationType: string,
  valueDecimalPrecision: number
) {
  // For percentage calculation, get the objective data first
  if (calculationType === 'percentage') {
    const objective = await db
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
    const result = await db
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
    const result = await db
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
}
