<!--
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
-->
<script lang="ts">
  import { formatHex8 } from 'culori';
  import type { ComponentProps } from 'svelte';

  import { setOpacity } from '$lib/colors';
  import ValueComponent from '$lib/components/widgets/components/ValueComponent.svelte';
  import MetricSkeleton from '$lib/components/widgets/utils/MetricSkeleton.svelte';
  import type { WidgetMetricDataPlot } from '$lib/server/services/metrics/types';
  import type { PartialBy } from '$lib/types';

  interface Props {
    metric: PartialBy<WidgetMetricDataPlot, 'data'>;
    color: string;
    accentColor: string;
  }

  const { metric, color, accentColor }: Props = $props();

  const PLOT_WIDTH = 80;
  const PLOT_HEIGHT = 45;
  const PLOT_PADDING_TOP = 10;
  const PLOT_PADDING_BOTTOM = 0;
  const PLOT_VIEW_BOX = `${-PLOT_PADDING_TOP} ${-PLOT_PADDING_BOTTOM} ${PLOT_WIDTH + 2 * PLOT_PADDING_TOP} ${PLOT_HEIGHT + 2 * PLOT_PADDING_BOTTOM}`;
  const BOTTOM_PADDING_PERCENT = 0.3; // padding below the lowest point
  const EFFECTIVE_HEIGHT = PLOT_HEIGHT * (1 - BOTTOM_PADDING_PERCENT);
  const CURVE_SMOOTHNESS = 0.4; // Controls curve smoothness: 0-0.5, where higher values = smoother curves
  const TENSION = 0.5; // Controls how much neighboring points influence the curve (0-1)

  const values = $derived(
    metric.data?.points && metric.data.points.length > 1
      ? metric.data?.points.map((p) => p.y)
      : [0, 0]
  );
  const minValue = $derived(Math.min(...values));
  const maxValue = $derived(Math.max(...values));
  const valueRange = $derived(maxValue - minValue || 1);

  // Function to create SVG path for line plot with smooth curves
  function createLinePath(): string {
    if (values.length === 1) {
      // If only one point, draw a horizontal line
      const y = EFFECTIVE_HEIGHT - ((values[0] - minValue) / valueRange) * EFFECTIVE_HEIGHT;
      return `M0,${y} L${PLOT_WIDTH},${y}`;
    }

    // Calculate points
    const points = values.map((value, index) => {
      const x = (index / (values.length - 1 || 1)) * PLOT_WIDTH;
      const y = EFFECTIVE_HEIGHT - ((value - minValue) / valueRange) * EFFECTIVE_HEIGHT;
      return { x, y };
    });

    // Generate a smooth curve using cubic bezier curves
    let path = `M${points[0].x},${points[0].y}`;

    // Calculate tangents for each point using neighboring points
    const tangents = [];
    for (let i = 0; i < points.length; i++) {
      if (i === 0) {
        // For first point, use the vector to the second point
        const dx = points[1].x - points[0].x;
        const dy = points[1].y - points[0].y;
        tangents.push({ x: dx, y: dy });
      } else if (i === points.length - 1) {
        // For last point, use the vector from the second-to-last point
        const dx = points[i].x - points[i - 1].x;
        const dy = points[i].y - points[i - 1].y;
        tangents.push({ x: dx, y: dy });
      } else {
        // For middle points, average the vectors to the adjacent points
        const dx = points[i + 1].x - points[i - 1].x;
        const dy = points[i + 1].y - points[i - 1].y;
        tangents.push({ x: dx, y: dy });
      }
    }

    // Generate the path with cardinal spline method
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];

      // Scale tangent vectors by tension and distance
      const deltaX = (next.x - current.x) * CURVE_SMOOTHNESS;

      // Calculate control points using tangents
      const controlPointX1 = current.x + deltaX;
      const controlPointY1 = current.y + tangents[i].y * TENSION * CURVE_SMOOTHNESS;

      const controlPointX2 = next.x - deltaX;
      const controlPointY2 = next.y - tangents[i + 1].y * TENSION * CURVE_SMOOTHNESS;

      path += ` C${controlPointX1},${controlPointY1} ${controlPointX2},${controlPointY2} ${next.x},${next.y}`;
    }

    return path;
  }
</script>

{#if !metric.data}
  <MetricSkeleton />
{:else}
  <div style:display="flex" style:align-items="center" style:gap="0.3rem">
    <div style:display="flex" style:align-items="center">
      <svg
        width={PLOT_WIDTH}
        height={PLOT_HEIGHT}
        viewBox={PLOT_VIEW_BOX}
        style:margin-left="0.25rem"
        style:vertical-align="middle"
        class="widget-metric"
      >
        <!-- Line plot -->
        <path
          d={createLinePath()}
          fill="none"
          stroke={accentColor}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <!-- Subtle area under the line -->
        <path
          d={`${createLinePath()} L${PLOT_WIDTH},${PLOT_HEIGHT} L0,${PLOT_HEIGHT} Z`}
          fill={formatHex8(setOpacity(accentColor, 0.15))}
          stroke="none"
        />
      </svg>
    </div>
    {#if metric.style === 'plot-metric'}
      <ValueComponent
        metric={metric as ComponentProps<typeof ValueComponent>['metric']}
        {color}
        {accentColor}
        valueFontSize="1.5rem"
        valuePercentFontSize="1rem"
      />
    {/if}
  </div>
{/if}
