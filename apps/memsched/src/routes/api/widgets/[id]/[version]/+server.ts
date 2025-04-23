import { error } from '@sveltejs/kit';

import Widget from '$lib/components/widgets/Widget.svelte';
import { renderWidget } from '$lib/server/svg';
import { handleDbError } from '$lib/server/utils';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
  const widgetId = event.params.id;
  const format = event.url.searchParams.get('f');
  const contentType =
    format === 'svg' ? 'image/svg+xml' : format === 'png' ? 'image/png' : 'text/html';
  const dark = event.url.searchParams.has('dark');
  const cacheKey = `widget:${widgetId}:${format}:${dark ? 'dark' : 'light'}`;
  const cacheEnabled =
    format !== 'png' &&
    (import.meta.env.VITE_DEBUG_DISABLE_WIDGET_CACHE !== '1' || !import.meta.env.DEV);

  let cachedWidget: Awaited<ReturnType<typeof event.locals.cache.get>> = null;
  let isAllowedToAccessWidget = false;

  if (cacheEnabled) {
    const clientEtag = event.request.headers.get('If-None-Match');
    cachedWidget = await event.locals.cache.get(cacheKey);

    // If client's etag matches our cached etag, return 304 Not Modified
    isAllowedToAccessWidget =
      cachedWidget?.metadata.visibility === 'public' ||
      cachedWidget?.metadata.userId === event.locals.session?.userId;

    if (clientEtag && cachedWidget && clientEtag === cachedWidget.etag && isAllowedToAccessWidget) {
      return new Response(null, {
        status: 304,
        headers: {
          ETag: cachedWidget.etag,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      });
    }
  }

  // Get the widget data
  const widgetResult = await event.locals.widgetsService.get(
    widgetId,
    event.locals.session?.userId
  );
  if (widgetResult.isErr()) {
    return handleDbError(widgetResult);
  }
  if (widgetResult.isErr()) {
    return error(404, 'Widget not found');
  }

  const widgetDataResult = await event.locals.widgetsService.getWithMetricsData(widgetId);
  if (widgetDataResult.isErr()) {
    return handleDbError(widgetDataResult);
  }

  // Generate a new etag based on widget data
  const newEtag = event.locals.widgetsService.generateEtag(widgetDataResult.value);

  // If we have a cached version with the same etag, use it
  if (cachedWidget && cachedWidget.etag === newEtag && isAllowedToAccessWidget) {
    return new Response(cachedWidget.value, {
      headers: {
        'Content-Type': contentType,
        ETag: newEtag,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  }

  // Render the widget
  const rendered = await renderWidget(
    Widget,
    {
      ...widgetDataResult.value,
      dark,
    },
    format
  );

  // Cache the result
  if (cacheEnabled) {
    await event.locals.cache.set(cacheKey, rendered as string, newEtag, {
      visibility: widgetResult.value.visibility,
      userId: event.locals.session?.userId ?? null,
    });
  }

  // Return the rendered response with the new etag header
  return new Response(rendered, {
    headers: {
      'Content-Type': contentType,
      ETag: newEtag,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    },
  });
};
