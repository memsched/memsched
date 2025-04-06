<script lang="ts">
  import { addOpacityRgba } from '$lib/utils';
  import type { WidgetMetricPreview } from '$lib/server/db/schema';

  interface Props {
    metric: WidgetMetricPreview;
    accentColor: string;
  }

  const { metric, accentColor }: Props = $props();

  const HEATMAP_POINT_SIZE = 6;
  const HEATMAP_POINT_SPACING = 1;
  const ROWS = 7;
  const HEATMAP_HEIGHT = HEATMAP_POINT_SIZE * ROWS + HEATMAP_POINT_SPACING * (ROWS - 1);
  const columns = $derived(Math.ceil(metric.plotData?.points?.length / ROWS));
  const heatmapWidth = $derived(
    columns * HEATMAP_POINT_SIZE + HEATMAP_POINT_SPACING * (columns - 1)
  );

  // Generate heatmap data (placeholder - replace with actual data processing)
  const heatmapData = $derived(
    metric.plotData?.points ||
      Array(25)
        .fill(0)
        .map(() => Math.random())
  );

  const maxValue = $derived(Math.max(...heatmapData.map((point) => point.value)));

  // Calculate color intensity based on value
  function getColorIntensity(value: number) {
    const normalized = maxValue > 0 ? value / maxValue : 0;
    return addOpacityRgba(accentColor, 0.1 + normalized * 0.9);
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
    {#each heatmapData as dataPoint}
      <div
        style:width="{HEATMAP_POINT_SIZE}px"
        style:height="{HEATMAP_POINT_SIZE}px"
        style:background-color={getColorIntensity(dataPoint.value)}
        style:border-radius="2px"
      ></div>
    {/each}
  </div>
  {#if metric.style === 'heatmap-metric'}
    <div style:display="flex" style:flex-direction="column">
      <div
        style:font-size="1.5rem"
        style:font-weight="800"
        style:line-height="1"
        style:display="flex"
        style:align-items="flex-end"
        style:gap={metric.calculationType === 'percentage' ? '0.1rem' : '0.3rem'}
      >
        {metric.value}
      </div>
      {#if metric.name}
        <div style:font-size="0.8rem" style:color="#666">
          {metric.name}
        </div>
      {/if}
    </div>
  {/if}
</div>
