<script lang="ts">
  import type { WidgetMetricComponentPlot } from '$lib/server/db/schema';
  import { addOpacityRgba } from '$lib/utils';

  interface Props {
    metric: WidgetMetricComponentPlot;
    accentColor: string;
  }

  const { metric, accentColor }: Props = $props();

  const PLOT_WIDTH = 70;
  const PLOT_HEIGHT = 40;
  const PLOT_PADDING = 4;
  const PLOT_VIEW_BOX = `${-PLOT_PADDING} ${-PLOT_PADDING} ${PLOT_WIDTH + 2 * PLOT_PADDING} ${PLOT_HEIGHT + 2 * PLOT_PADDING}`;
  const BOTTOM_PADDING_PERCENT = 0.3; // padding below the lowest point

  // Function to create SVG path for line plot
  function createLinePath(
    points: WidgetMetricComponentPlot['data']['points'],
    width: number,
    height: number
  ): string {
    if (!points || points.length === 0) {
      const defaultValue = 0;
      points = [{ y: defaultValue }, { y: defaultValue }];
    } else if (points.length === 1) {
      points = [{ y: points[0].y }, { y: points[0].y }];
    }

    // Get min and max values for scaling
    const values = points.map((p) => p.y);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue || 1; // Avoid division by zero

    // Add bottom padding by adjusting the effective height
    const effectiveHeight = height * (1 - BOTTOM_PADDING_PERCENT);

    // Create points for path
    const pathPoints = points.map((point, index) => {
      const x = (index / (points.length - 1 || 1)) * width;
      const y = effectiveHeight - ((point.y - minValue) / valueRange) * effectiveHeight;
      return `${x},${y}`;
    });

    return `M${pathPoints.join(' L')}`;
  }
</script>

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
        d={createLinePath(metric.data.points, PLOT_WIDTH, PLOT_HEIGHT)}
        fill="none"
        stroke={accentColor}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <!-- <path
    d={createLinePath(metric.data.points, PLOT_WIDTH, PLOT_HEIGHT)}
    fill="none"
    stroke={addOpacityRgba(accentColor, 0.2)}
    stroke-width="5"
    stroke-linecap="round"
    stroke-linejoin="round"
  /> -->
      <!-- Subtle area under the line -->
      <path
        d={`${createLinePath(metric.data.points, PLOT_WIDTH, PLOT_HEIGHT)} L${PLOT_WIDTH},${PLOT_HEIGHT} L0,${PLOT_HEIGHT} Z`}
        fill={addOpacityRgba(accentColor, 0.1)}
        stroke="none"
      />
    </svg>
  </div>
  {#if metric.style === 'plot-metric'}
    <div style:display="flex" style:flex-direction="column">
      <div
        style:font-size="1.5rem"
        style:font-weight="800"
        style:line-height="1"
        style:display="flex"
        style:align-items="flex-end"
        style:gap={metric.valueAggregationType === 'percentage' ? '0.1rem' : '0.3rem'}
      >
        {metric.data.value}
      </div>
      {#if metric.name}
        <div style:font-size="0.8rem" style:color="#666">
          {metric.name}
        </div>
      {/if}
    </div>
  {/if}
</div>
