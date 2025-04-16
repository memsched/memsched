<script lang="ts">
  import { formatHex8 } from 'culori';
  import type { ComponentProps } from 'svelte';

  import { setOpacity } from '$lib/colors';
  import ValueComponent from '$lib/components/widgets/components/ValueComponent.svelte';
  import MetricSkeleton from '$lib/components/widgets/utils/MetricSkeleton.svelte';
  import type { WidgetMetricDataHeatmap } from '$lib/server/services/metrics/types';
  import type { PartialBy } from '$lib/types';

  interface Props {
    metric: PartialBy<WidgetMetricDataHeatmap, 'data'>;
    color: string;
    accentColor: string;
  }

  const { metric, color, accentColor }: Props = $props();

  const HEATMAP_POINT_SIZE = 7;
  const HEATMAP_POINT_SPACING = 2;
  const data = $derived(metric.data || { cols: 0, points: [] });
  const cols = $derived(data.cols);
  const heatmapWidth = $derived(HEATMAP_POINT_SIZE * cols + HEATMAP_POINT_SPACING * (cols - 1));
  const rows = $derived(Math.ceil(data.points.length / cols));
  const heatmapHeight = $derived(rows * HEATMAP_POINT_SIZE + HEATMAP_POINT_SPACING * (rows - 1));

  const minValue = $derived(Math.min(...data.points.map((p) => p.z)));
  const maxValue = $derived(Math.max(...data.points.map((p) => p.z)));

  function getColorIntensity(value: number) {
    const normalizedValue = (value - minValue) / (maxValue - minValue);
    // Set alpha based on normalized value (0.25 to 1)
    return formatHex8(setOpacity(accentColor, 0.25 + normalizedValue * 0.75));
  }
</script>

{#if !metric.data}
  <MetricSkeleton />
{:else}
  <div style:display="flex" style:align-items="center" style:gap="0.5rem">
    <div
      style:display="flex"
      style:gap="{HEATMAP_POINT_SPACING}px"
      style:flex-wrap="wrap"
      style:height="{heatmapHeight}px"
      style:width="{heatmapWidth}px"
    >
      {#each metric.data.points as dataPoint}
        <div
          style:width="{HEATMAP_POINT_SIZE}px"
          style:height="{HEATMAP_POINT_SIZE}px"
          style:background-color={getColorIntensity(dataPoint.z)}
          style:border-radius="2px"
        ></div>
      {/each}
    </div>
    {#if metric.style === 'heatmap-metric'}
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
