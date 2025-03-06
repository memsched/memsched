import type { RequestHandler } from './$types';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { objective, type WidgetJoinMetrics } from '$lib/server/db/schema';
import Widget from '$lib/components/Widget.svelte';
import { error } from '@sveltejs/kit';
import { getWidget } from '$lib/server/queries';
import { renderWidget } from '$lib/server/svg';

export const GET: RequestHandler = async (event) => {
  const widget = await getWidget(event.params.id);
  if (!widget) {
    return error(404, 'Widget not found');
  }
  console.log(widget);

  const objectives = await db.select().from(objective).where(eq(objective.id, widget.objectiveId));
  // TODO: This should be fine commented out but we should assert the behavior
  // if (objectives.length === 0 || objectives[0].visibility !== 'public') {
  //   return error(404, 'Widget not found');
  // }
  const ob = objectives[0];

  const props = {
    ...widget,
    metrics: widget.metrics.map((metric) => ({
      ...metric,
      value: ob.value,
    })),
  };
  const renderSvg = event.url.searchParams.has('svg');
  return renderWidget<WidgetJoinMetrics>(event, Widget, props, renderSvg);
};
