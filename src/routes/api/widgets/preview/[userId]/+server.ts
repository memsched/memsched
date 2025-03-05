import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { render } from 'svelte/server';
import type { Component } from 'svelte';
import { eq } from 'drizzle-orm';
import satori from 'satori';
import parse from 'html-react-parser';
import { objective, type WidgetJoinMetricsPreview } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { formSchema } from '$lib/components/forms/widget-form/schema';
import Widget from '$lib/components/Widget.svelte';

export const GET: RequestHandler = async (event) => {
  if (!event.locals.session || event.params.userId !== event.locals.session.userId) {
    return error(401, 'Unauthorized');
  }

  const base64Config = event.url.searchParams.get('config');
  if (!base64Config) {
    return error(400, 'Missing widget config');
  }
  let config;
  try {
    const decodedConfig = JSON.parse(atob(base64Config));
    config = formSchema.parse(decodedConfig);
  } catch (e) {
    return error(400, 'Invalid widget config');
  }

  const objectives = await db.select().from(objective).where(eq(objective.id, config.objectiveId));
  if (objectives.length === 0 || objectives[0].visibility !== 'public') {
    return error(404, 'Objective not found');
  }
  const ob = objectives[0];

  const props = {
    ...config,
    metrics: config.metrics.map((metric) => ({
      ...metric,
      value: ob.value,
    })),
  };

  // const renderSvg = event.url.searchParams.has('svg');
  const renderSvg = true;
  const widget = render<Component<WidgetJoinMetricsPreview>>(Widget, { props }).body;
  if (!renderSvg) {
    return new Response(widget, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }

  const fonts = await Promise.all([
    event.fetch('/fonts/inter/Inter_18pt-Regular.ttf').then((res) =>
      res.arrayBuffer().then((buffer) => ({
        name: 'Inter',
        data: buffer,
        weight: 400,
        style: 'normal',
      }))
    ),
    event.fetch('/fonts/inter/Inter_18pt-SemiBold.ttf').then((res) =>
      res.arrayBuffer().then((buffer) => ({
        name: 'Inter',
        data: buffer,
        weight: 600,
        style: 'normal',
      }))
    ),

    event.fetch('/fonts/inter/Inter_18pt-ExtraBold.ttf').then((res) =>
      res.arrayBuffer().then((buffer) => ({
        name: 'Inter',
        data: buffer,
        weight: 800,
        style: 'normal',
      }))
    ),
  ]);

  let svg = await satori(parse(widget, { trim: true }), {
    // debug: true,
    // @ts-ignore
    fonts,
  });
  svg = svg.replace(/<svg[^>]*height="[^"]*"[^>]*>/, (match) =>
    match.replace(/height="[^"]*"/, '')
  );
  svg = svg.replace(/<svg[^>]*width="[^"]*"[^>]*>/, (match) =>
    match.replace(/width="[^"]*"/, 'width="100%"')
  );

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
    },
  });
};
