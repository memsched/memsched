<script lang="ts">
  import type { ComponentProps } from 'svelte';

  import ValueComponent from '$lib/components/widgets/components/ValueComponent.svelte';
  import MetricSkeleton from '$lib/components/widgets/utils/MetricSkeleton.svelte';
  import type { WidgetMetricDataPlot } from '$lib/server/services/metrics/types';
  import type { PartialBy } from '$lib/types';
  import { addOpacityRgba } from '$lib/utils';

  interface Props {
    metric: PartialBy<WidgetMetricDataPlot, 'data'>;
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
    points: WidgetMetricDataPlot['data']['points'],
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
          d={createLinePath(metric.data.points, PLOT_WIDTH, PLOT_HEIGHT)}
          fill="none"
          stroke={accentColor}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <!-- Subtle area under the line -->
        <path
          d={`${createLinePath(metric.data.points, PLOT_WIDTH, PLOT_HEIGHT)} L${PLOT_WIDTH},${PLOT_HEIGHT} L0,${PLOT_HEIGHT} Z`}
          fill={addOpacityRgba(accentColor, 0.1)}
          stroke="none"
        />
      </svg>
    </div>
    {#if metric.style === 'plot-metric'}
      <ValueComponent
        metric={metric as ComponentProps<typeof ValueComponent>['metric']}
        {accentColor}
        valueFontSize="1.5rem"
        valuePercentFontSize="1rem"
      />
    {/if}
  </div>
{/if}
