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
  format: string | null
) {
  if (format === 'svg') {
    const widget = render<Component<P>>(Widget, { props }).body;
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

  if (format === 'png') {
    const widget = render<Component<P>>(Widget, { props: { ...props, margin: 16 } }).body;
    const svg = await getSatoriInstance()(parse(widget, { trim: true }));

    const opts = {
      background: 'rgb(255, 255, 255)',
      fitTo: {
        mode: 'height' as const,
        value: 512,
      },
      font: {
        loadSystemFonts: false,
      },
    };

    let resvg;
    if (import.meta.env.DEV) {
      resvg = await import('@cf-wasm/resvg/node');
    } else {
      resvg = await import('@cf-wasm/resvg');
    }
    const renderer = await resvg.Resvg.create(svg, opts);
    const pngData = renderer.render();
    const pngBuffer = pngData.asPng();

    return new Response(pngBuffer, {
      headers: {
        'Content-Type': 'image/png',
      },
    });
  }

  const widget = render<Component<P>>(Widget, { props }).body;
  return new Response(widget, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
