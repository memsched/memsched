/*
MEMsched - A memory scheduling and objective tracking application.
Copyright (C) 2025 Leonard Cseres

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
import parse from 'html-react-parser';
import satori from 'satori';
import type { ComponentProps } from 'svelte';
import { render } from 'svelte/server';

import Widget from '$lib/components/widgets/Widget.svelte';
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

function extractSvgDimensions(svgString: string): { width: number; height: number } {
  const widthMatch = svgString.match(/width="([^"]*?)"/);
  const heightMatch = svgString.match(/height="([^"]*?)"/);

  const width = widthMatch ? parseFloat(widthMatch[1]) : 0;
  const height = heightMatch ? parseFloat(heightMatch[1]) : 0;

  return { width, height };
}

function calculateMargins(
  width: number,
  height: number,
  baseMarginX: number = 24,
  baseMarginY: number = 24
): { marginX: number; marginY: number } {
  // Target aspect ratio is 2:1 (width:height)
  const targetRatio = 2;

  // Calculate the required width and height based on the base margins
  const requiredWidth = width + 2 * baseMarginX;
  const requiredHeight = height + 2 * baseMarginY;

  // Determine the final dimensions based on the larger dimension after adding base margins
  let finalWidth: number;
  let finalHeight: number;

  if (requiredWidth / requiredHeight >= targetRatio) {
    // Width is the dominant dimension, or aspect ratio is already correct/wider
    finalWidth = requiredWidth;
    finalHeight = finalWidth / targetRatio;
  } else {
    // Height is the dominant dimension
    finalHeight = requiredHeight;
    finalWidth = finalHeight * targetRatio;
  }

  // Calculate the total margins needed to achieve the final dimensions
  const totalMarginX = (finalWidth - width) / 2;
  const totalMarginY = (finalHeight - height) / 2;

  // Ensure margins are at least the base margins
  const marginX = Math.max(baseMarginX, totalMarginX);
  const marginY = Math.max(baseMarginY, totalMarginY);

  return { marginX, marginY };
}

export async function renderWidget(props: ComponentProps<typeof Widget>, format: string | null) {
  if (format === 'svg') {
    const widget = render<typeof Widget>(Widget, { props }).body;
    const svg = await getSatoriInstance()(parse(widget, { trim: true }));

    // TODO: Simplify these regexes
    // svg = svg.replace(/<svg[^>]*height="[^"]*"[^>]*>/, (match) =>
    //   match.replace(/height="[^"]*"/, '')
    // );
    // svg = svg.replace(/<svg[^>]*width="[^"]*"[^>]*>/, (match) =>
    //   match.replace(/width="[^"]*"/, 'width="100%"')
    // );

    return svg;
  }

  if (format === 'png') {
    // First render to get dimensions
    const widget = render<typeof Widget>(Widget, { props }).body;
    let svg = await getSatoriInstance()(parse(widget, { trim: true }));

    // Extract dimensions and calculate margins for 2:1 aspect ratio
    const dimensions = extractSvgDimensions(svg);
    const margins = calculateMargins(dimensions.width, dimensions.height);

    // Re-render with calculated margins
    const widgetWithMargins = render<typeof Widget>(Widget, {
      props: {
        ...props,
        marginX: margins.marginX,
        marginY: margins.marginY,
      },
    }).body;
    svg = await getSatoriInstance()(parse(widgetWithMargins, { trim: true }));

    const opts = {
      background: props.dark ? 'rgb(25, 25, 25)' : 'rgb(255, 255, 255)',
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

    return pngBuffer;
  }

  return render<typeof Widget>(Widget, { props }).body;
}
