import type { RequestHandler } from './$types';
import { type WidgetJoinMetrics } from '$lib/server/db/schema';
import Widget from '$lib/components/Widget.svelte';
import { error } from '@sveltejs/kit';
import { getWidget } from '$lib/server/queries';
import { renderWidget } from '$lib/server/svg';

export const GET: RequestHandler = async (event) => {
  const widget = await getWidget(event.params.id);
  if (!widget) {
    return error(404, 'Widget not found');
  }

  const renderSvg = event.url.searchParams.has('svg');
  return renderWidget<WidgetJoinMetrics>(event, Widget, widget, renderSvg);
};
