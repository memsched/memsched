import * as table from '../db/schema';
import { eq } from 'drizzle-orm';
import { type DBType } from '../db';

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
 */
export async function updateMetricValue(db: DBType, metricId: string, value: number) {
  await db.update(table.widgetMetric).set({ value }).where(eq(table.widgetMetric.id, metricId));
}

/**
 * Computes metric values for objectives
 * @param db The database instance
 * @param objectiveId The ID of the objective
 * @param timeRange The time range to compute the metric value for
 * @param valueDecimalPrecision The number of decimal places to round the metric value to
 * @returns The computed metric value
 */
export async function computeMetricValue(
  db: DBType,
  objectiveId: string,
  timeRange: string,
  valueDecimalPrecision: number
) {
  const logs = await db
    .select()
    .from(table.objectiveLog)
    .where(eq(table.objectiveLog.objectiveId, objectiveId));

  if (logs.length === 0) {
    return 0;
  }

  let value = 0;
  if (timeRange === 'all time') {
    value = logs.reduce((acc, log) => acc + log.value, 0);
  }

  return Math.round(value * 10 ** valueDecimalPrecision) / 10 ** valueDecimalPrecision;
}
