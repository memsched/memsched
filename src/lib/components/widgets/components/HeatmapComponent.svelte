<script lang="ts">
  import ValueComponent from '$lib/components/widgets/components/ValueComponent.svelte';
  import type { WidgetMetricDataHeatmap } from '$lib/server/services/metrics/types';
  import { addOpacityRgba } from '$lib/utils';
  interface Props {
    metric: WidgetMetricDataHeatmap;
    accentColor: string;
  }

  const { metric, accentColor }: Props = $props();

  const HEATMAP_POINT_SIZE = 6;
  const HEATMAP_POINT_SPACING = 1;
  const rows = $derived(metric.data.rows);
  const HEATMAP_HEIGHT = $derived(HEATMAP_POINT_SIZE * rows + HEATMAP_POINT_SPACING * (rows - 1));
  const columns = $derived(Math.ceil(metric.data.points?.length / rows));
  const heatmapWidth = $derived(
    columns * HEATMAP_POINT_SIZE + HEATMAP_POINT_SPACING * (columns - 1)
  );

  const minValue = $derived(Math.min(...metric.data.points.map((p) => p.z)));
  const maxValue = $derived(Math.max(...metric.data.points.map((p) => p.z)));

  function getColorIntensity(value: number) {
    const normalizedValue = (value - minValue) / (maxValue - minValue);
    return addOpacityRgba(accentColor, 0.1 + normalizedValue * 0.9);
  }
</script>

<div style:display="flex" style:align-items="center" style:gap="0.5rem">
  <div
    style:display="flex"
    style:flex-direction="column"
    style:gap="{HEATMAP_POINT_SPACING}px"
    style:flex-wrap="wrap"
    style:height="{HEATMAP_HEIGHT}px"
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
    <ValueComponent {metric} {accentColor} valueFontSize="1.5rem" valuePercentFontSize="1rem" />
  {/if}
</div>
