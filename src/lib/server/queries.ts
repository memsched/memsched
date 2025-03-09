import * as table from './db/schema';
import type { WidgetJoinMetrics } from './db/schema';
import { db } from './db';
import { eq, type ExtractTablesWithRelations } from 'drizzle-orm';
import type { SQLiteTransaction } from 'drizzle-orm/sqlite-core';
import type { ResultSet } from '@libsql/client';

export async function getObjectiveFromWidgetId(id: string) {
  const objectives = await db
    .select({
      objective: table.objective,
    })
    .from(table.widget)
    .innerJoin(table.objective, eq(table.objective.id, table.widget.objectiveId))
    .where(eq(table.widget.id, id))
    .limit(1);

  if (objectives.length === 0) {
    return null;
  }

  return objectives[0].objective;
}

export async function getWidgetWithMetrics(id: string) {
  const widgetWithMetrics = await db
    .select({
      widget: table.widget,
      widgetMetric: table.widgetMetric,
    })
    .from(table.widget)
    .leftJoin(table.widgetMetric, eq(table.widget.id, table.widgetMetric.widgetId))
    .where(eq(table.widget.id, id));

  if (!widgetWithMetrics.length) return null;

  const widgetData = widgetWithMetrics[0].widget;
  const metrics = widgetWithMetrics.map(({ widgetMetric }) => widgetMetric).filter(Boolean);

  return { ...widgetData, metrics } as WidgetJoinMetrics;
}

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

/**
 * Updates all widget metrics associated with an objective
 * @param tx The database transaction
 * @param objectiveId The ID of the objective
 */
export async function updateObjectiveWidgetMetrics(
  tx: SQLiteTransaction<
    'async',
    ResultSet,
    Record<string, never>,
    ExtractTablesWithRelations<Record<string, never>>
  >,
  objectiveId: string
) {
  // Get all widgets associated with this objective
  const widgets = await tx
    .select()
    .from(table.widget)
    .where(eq(table.widget.objectiveId, objectiveId));

  // For each widget, update its metrics
  for (const widgetItem of widgets) {
    // Get all metrics for this widget
    const metrics = await tx
      .select()
      .from(table.widgetMetric)
      .where(eq(table.widgetMetric.widgetId, widgetItem.id));

    // Update each metric with the new computed value
    for (const metric of metrics) {
      const newMetricValue = await computeMetricValue(
        tx,
        objectiveId,
        metric.timeRange,
        metric.valueDecimalPrecision
      );

      // Update the metric value
      await tx
        .update(table.widgetMetric)
        .set({ value: newMetricValue })
        .where(eq(table.widgetMetric.id, metric.id));
    }
  }
}
