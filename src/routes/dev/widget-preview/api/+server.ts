import { error, json } from '@sveltejs/kit';

import { dev } from '$app/environment';
import Widget from '$lib/components/widgets/Widget.svelte';
import type { WidgetJoinMetricsData } from '$lib/server/services/metrics/types';
import { renderWidget } from '$lib/server/svg';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
  // Only allow in development mode
  if (!dev) {
    return error(404, 'Not found');
  }

  const configParam = event.url.searchParams.get('config');
  if (!configParam) {
    return error(400, 'Missing widget config');
  }

  let config: WidgetJoinMetricsData;
  try {
    config = JSON.parse(decodeURIComponent(configParam));
  } catch (err) {
    console.error(err);
    return error(400, 'Invalid widget config');
  }

  const renderSvg = event.url.searchParams.has('svg');

  // Return the raw SVG as requested
  if (event.url.searchParams.has('raw')) {
    return await renderWidget<WidgetJoinMetricsData>(Widget, config, renderSvg);
  }

  // Return the SVG string for display in the UI
  const response = await renderWidget<WidgetJoinMetricsData>(Widget, config, true);
  const svgText = await response.text();

  return json({ svg: svgText });
};
