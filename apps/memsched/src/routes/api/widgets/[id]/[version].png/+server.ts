import { error } from '@sveltejs/kit';

import { renderWidget } from '$lib/server/renderer';
import { handleDbError } from '$lib/server/utils';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
  const widgetId = event.params.id;
  const dark = event.url.searchParams.has('dark');

  // Get the widget data
  const widgetResult = await event.locals.widgetsService.get(
    widgetId,
    event.locals.session?.userId
  );
  if (widgetResult.isErr()) {
    return error(404, 'Widget not found');
  }

  const widgetDataResult = await event.locals.widgetsService.getWithMetricsData(widgetId);
  if (widgetDataResult.isErr()) {
    return handleDbError(widgetDataResult);
  }

  // Render the widget
  const rendered = await renderWidget(
    {
      ...widgetDataResult.value,
      dark,
    },
    'png'
  );

  return new Response(rendered as BodyInit, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    },
  });
};
