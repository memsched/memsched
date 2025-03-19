import type { RequestHandler } from './$types';
import { type WidgetJoinMetrics } from '$lib/server/db/schema';
import Widget from '$lib/components/Widget.svelte';
import { error } from '@sveltejs/kit';
import { getObjectiveFromWidgetId, getWidgetWithMetrics } from '$lib/server/queries';
import { renderWidget } from '$lib/server/svg';
import { generateWidgetEtag } from '$lib/server/utils';

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
  const widget = await getWidgetWithMetrics(event.locals.db, widgetId);
  if (!widget) {
    return error(404, 'Widget not found');
  }

  // Generate a new etag based on widget data
  const newEtag = generateWidgetEtag(widget);

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

  const objective = await getObjectiveFromWidgetId(event.locals.db, widget.id);
  if (!objective) {
    // TODO: Assert this instead as we should never get here (already checked above)
    return error(404, 'Widget not found');
  }

  if (objective.visibility !== 'public' && event.locals.session?.userId !== objective.userId) {
    return error(401, 'Unauthorized');
  }

  // Render the widget
  const rendered = await renderWidget<WidgetJoinMetrics>(event, Widget, widget, renderSvg);
  const renderedContent = await rendered.text();

  // Cache the result
  await event.locals.cache.set(cacheKey, renderedContent, newEtag, {
    visibility: objective.visibility,
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
