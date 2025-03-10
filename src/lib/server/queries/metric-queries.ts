import * as table from '../db/schema';
import { eq } from 'drizzle-orm';
import type { SQLiteTransaction } from 'drizzle-orm/sqlite-core';
import type { ResultSet } from '@libsql/client';
import type { ExtractTablesWithRelations } from 'drizzle-orm';
import { db } from '../db';

/**
 * Gets metrics from a widget ID
 * @param widgetId The ID of the widget
 * @param tx The database transaction
 * @returns The metrics
 */
export async function getMetricsFromWidgetId(
  widgetId: string,
  tx?: SQLiteTransaction<
    'async',
    ResultSet,
    Record<string, never>,
    ExtractTablesWithRelations<Record<string, never>>
  >
) {
  const metrics = await (tx ?? db)
    .select()
    .from(table.widgetMetric)
    .where(eq(table.widgetMetric.widgetId, widgetId));

  return metrics;
}

/**
 * Updates a metric value
 * @param metricId The ID of the metric
 * @param tx The database transaction
 * @param value The new value
 */
export async function updateMetricValue(
  metricId: string,
  value: number,
  tx?: SQLiteTransaction<
    'async',
    ResultSet,
    Record<string, never>,
    ExtractTablesWithRelations<Record<string, never>>
  >
) {
  await (tx ?? db)
    .update(table.widgetMetric)
    .set({ value })
    .where(eq(table.widgetMetric.id, metricId));
}

/**
 * Computes metric values for objectives
 * @param tx The database transaction
 * @param objectiveId The ID of the objective
 * @param timeRange The time range to compute the metric value for
 * @param valueDecimalPrecision The number of decimal places to round the metric value to
 * @returns The computed metric value
 */
export async function computeMetricValue(
  tx: SQLiteTransaction<
    'async',
    ResultSet,
    Record<string, never>,
    ExtractTablesWithRelations<Record<string, never>>
  >,
  objectiveId: string,
  timeRange: string,
  valueDecimalPrecision: number
) {
  const logs = await tx
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
