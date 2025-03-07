import { widget, widgetMetric, type WidgetJoinMetrics } from './db/schema';
import { db } from './db';
import { eq } from 'drizzle-orm';

export async function getWidget(id: string) {
  const widgetWithMetrics = await db
    .select({
      widget,
      widgetMetric,
    })
    .from(widget)
    .leftJoin(widgetMetric, eq(widget.id, widgetMetric.widgetId))
    .where(eq(widget.id, id));

  if (!widgetWithMetrics.length) return null;

  const widgetData = widgetWithMetrics[0].widget;
  const metrics = widgetWithMetrics.map(({ widgetMetric }) => widgetMetric).filter(Boolean);

  return { ...widgetData, metrics } as WidgetJoinMetrics;
}
