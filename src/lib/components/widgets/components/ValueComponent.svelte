<script lang="ts">
  import TrendingUpArrow from '$lib/components/svgs/TrendingUpArrow.svelte';
  import MetricSkeleton from '$lib/components/widgets/utils/MetricSkeleton.svelte';
  import type {
    WidgetMetricDataHeatmapMetric,
    WidgetMetricDataPlotMetric,
    WidgetMetricDataValue,
  } from '$lib/server/services/metrics/types';
  import type { PartialBy } from '$lib/types';

  interface Props {
    metric:
      | PartialBy<WidgetMetricDataValue, 'data'>
      | PartialBy<WidgetMetricDataPlotMetric, 'data'>
      | PartialBy<WidgetMetricDataHeatmapMetric, 'data'>;
    accentColor: string;
    valueFontSize?: string;
    valuePercentFontSize?: string;
  }

  const {
    metric,
    accentColor,
    valueFontSize = '2rem',
    valuePercentFontSize = '1.25rem',
  }: Props = $props();
</script>

{#if !metric.data}
  <MetricSkeleton />
{:else}
  <div style:display="flex" style:flex-direction="column" style:align-items="flex-start">
    <div
      style:font-size={valueFontSize}
      style:font-weight="800"
      style:line-height="1"
      style:display="flex"
      style:align-items="flex-end"
      style:gap={metric.valuePercent ? '0.1rem' : '0.3rem'}
    >
      {#if metric.valuePercent}
        {metric.data.value}
        <span style:font-size={valuePercentFontSize} style:margin-bottom="0.1rem">%</span>
      {:else}
        {metric.data.value}
        {#if metric.style === 'metric-trend'}
          <TrendingUpArrow style="stroke: {accentColor}; color: {accentColor}" />
        {/if}
      {/if}
    </div>
    {#if metric.name}
      <div style:font-size="0.8rem" style:color="#666">
        {metric.name}
      </div>
    {/if}
  </div>
{/if}
