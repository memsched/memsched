import parse from 'html-react-parser';
import satori from 'satori';
import type { Component } from 'svelte';
import { render } from 'svelte/server';

import { fontOptions } from '$lib/server/fonts';

let satoriInstance: ((markup: ReturnType<typeof render>) => ReturnType<typeof satori>) | null =
  null;

function getSatoriInstance() {
  if (!satoriInstance) {
    satoriInstance = (markup) =>
      satori(markup, { fonts: fontOptions } as Parameters<typeof satori>[1]);
  }
  return satoriInstance;
}

export async function renderWidget<P extends Record<string, any>>(
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

  let svg = await getSatoriInstance()(parse(widget, { trim: true }));

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
