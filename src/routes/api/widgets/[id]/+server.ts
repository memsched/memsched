import type { RequestHandler } from './$types';
import { type WidgetJoinMetrics } from '$lib/server/db/schema';
import Widget from '$lib/components/Widget.svelte';
import { error } from '@sveltejs/kit';
import { getObjectiveFromWidgetId, getWidgetWithMetrics } from '$lib/server/queries';
import { renderWidget } from '$lib/server/svg';

export const GET: RequestHandler = async (event) => {
  const widget = await getWidgetWithMetrics(event.params.id);
  if (!widget) {
    return error(404, 'Widget not found');
  }
  const objective = await getObjectiveFromWidgetId(widget.id);
  if (!objective) {
    // TODO: Assert this instead as we should never get here (already checked above)
    return error(404, 'Widget not found');
  }
  if (objective.visibility !== 'public' && event.locals.session?.userId !== objective.userId) {
    return error(401, 'Unauthorized');
  }

  event.setHeaders({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  });

  const renderSvg = event.url.searchParams.has('svg');
  return renderWidget<WidgetJoinMetrics>(event, Widget, widget, renderSvg);
};
