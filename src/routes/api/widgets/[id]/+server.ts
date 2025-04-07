import type { RequestHandler } from './$types';
import { type WidgetJoinMetricsData } from '$lib/server/services/metrics/types';
import Widget from '$lib/components/widgets/Widget.svelte';
import { error } from '@sveltejs/kit';
import { renderWidget } from '$lib/server/svg';
import { handleDbError } from '$lib/server/utils';

export const GET: RequestHandler = async (event) => {
  const widgetId = event.params.id;
  const renderSvg = event.url.searchParams.has('svg');
  const cacheKey = `widget:${widgetId}:${renderSvg ? 'svg' : 'html'}`;

  const clientEtag = event.request.headers.get('If-None-Match');
  const cachedWidget = await event.locals.cache.get(cacheKey);

  // If client's etag matches our cached etag, return 304 Not Modified
  const isAllowedToAccessWidget =
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
        'Content-Type': renderSvg ? 'image/svg+xml' : 'text/html',
        ETag: newEtag,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  }

  // Render the widget
  const rendered = await renderWidget<WidgetJoinMetricsData>(
    event,
    Widget,
    widgetDataResult.value,
    renderSvg
  );
  const renderedContent = await rendered.text();

  // Cache the result
  await event.locals.cache.set(cacheKey, renderedContent, newEtag, {
    visibility: widgetResult.value.visibility,
    userId: event.locals.session?.userId ?? null,
  });

  return new Response(renderedContent, {
    headers: {
      'Content-Type': renderSvg ? 'image/svg+xml' : 'text/html',
      ETag: newEtag,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    },
  });
};
