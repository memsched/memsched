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

  // For time-based calculations
  const logs = await db
    .select()
    .from(table.objectiveLog)
    .where(eq(table.objectiveLog.objectiveId, objectiveId));

  if (logs.length === 0) {
    return 0;
  }

  // Get current date for time range calculations
  const now = new Date();
  let value = 0;

  if (calculationType === 'all time') {
    value = logs.reduce((acc, log) => acc + log.value, 0);
  } else if (calculationType === 'day') {
    // Filter logs from the past 24 hours
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const recentLogs = logs.filter(
      (log) => new Date(log.loggedAt).getTime() >= oneDayAgo.getTime()
    );
    value = recentLogs.reduce((acc, log) => acc + log.value, 0);
  } else if (calculationType === 'week') {
    // Filter logs from the past 7 days
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentLogs = logs.filter(
      (log) => new Date(log.loggedAt).getTime() >= oneWeekAgo.getTime()
    );
    value = recentLogs.reduce((acc, log) => acc + log.value, 0);
  } else if (calculationType === 'month') {
    // Filter logs from the past 30 days
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentLogs = logs.filter(
      (log) => new Date(log.loggedAt).getTime() >= oneMonthAgo.getTime()
    );
    value = recentLogs.reduce((acc, log) => acc + log.value, 0);
  } else if (calculationType === 'year') {
    // Filter logs from the past 365 days
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    const recentLogs = logs.filter(
      (log) => new Date(log.loggedAt).getTime() >= oneYearAgo.getTime()
    );
    value = recentLogs.reduce((acc, log) => acc + log.value, 0);
  }

  return Math.round(value * 10 ** valueDecimalPrecision) / 10 ** valueDecimalPrecision;
}
