import type { RequestHandler } from './$types';
import { render } from 'svelte/server';
import satori from 'satori';
import parse from 'html-react-parser';
import Widget from '$lib/components/Widget.svelte';

const props = {
  title: 'Pages Read',
  subtitle: 'Understanding Deep Learning',
  // borderRadius: 20,
  // color: 'lightgray',
  // border: false,
  // backgroundColor: 'black',
  imageUrl: 'https://hatscripts.github.io/circle-flags/flags/us.svg',
  imagePlacement: 'right',
  metrics: [
    {
      value: 94,
      name: 'today',
    },
    {
      value: 94,
      name: 'today',
    },
  ],
};

export const GET: RequestHandler = async (event) => {
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
