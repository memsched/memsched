import type { RequestHandler } from './$types';
import { render } from 'svelte/server';
import satori from 'satori';
import parse from 'html-react-parser';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { objective } from '$lib/server/db/schema';
import Widget from '$lib/components/Widget.svelte';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
  const objectiveId = event.params.id;
  const objectives = await db.select().from(objective).where(eq(objective.id, objectiveId));
  if (objectives.length === 0 || objectives[0].visibility !== 'public') {
    return error(404, 'Widget not found');
  }
  const ob = objectives[0];

  const props = {
    title: ob.name,
    subtitle: ob.description,
    // borderRadius: 20,
    // color: 'lightgray',
    // border: false,
    // backgroundColor: 'black',
    metrics: [
      {
        value: ob.value,
        description: 'pages read',
      },
    ],
  };

  const renderSvg = event.url.searchParams.has('svg');
  const widget = render(Widget, { props }).body;

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
