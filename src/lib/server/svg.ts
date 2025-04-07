import type { RequestEvent } from '@sveltejs/kit';
import parse from 'html-react-parser';
import satori from 'satori';
import type { Component } from 'svelte';
import { render } from 'svelte/server';

export async function renderWidget<P extends Record<string, any>>(
  event: RequestEvent,
  Widget: Component<P>,
  props: P,
  renderSvg: boolean = true
) {
  const widget = render<Component<P>>(Widget, { props }).body;
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
    // @ts-ignore
    fonts,
  });

  // TODO: Simplify these regexes
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
}
