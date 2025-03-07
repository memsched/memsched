import * as table from './db/schema';
import type { WidgetJoinMetrics } from './db/schema';
import { db } from './db';
import { eq, type ExtractTablesWithRelations } from 'drizzle-orm';
import type { SQLiteTransaction } from 'drizzle-orm/sqlite-core';
import type { ResultSet } from '@libsql/client';

export async function getWidget(id: string) {
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
