<script lang="ts">
  import type { WidgetMetricComponentValue } from '$lib/server/db/schema';
  import TrendingUpArrow from '$lib/components/svgs/TrendingUpArrow.svelte';

  interface Props {
    metric: WidgetMetricComponentValue;
    accentColor: string;
  }

  const { metric, accentColor }: Props = $props();
</script>

<div style:display="flex" style:flex-direction="column">
  <div
    style:font-size="2rem"
    style:font-weight="800"
    style:line-height="1"
    style:display="flex"
    style:align-items="flex-end"
    style:gap={metric.valueAggregationType === 'percentage' ? '0.1rem' : '0.3rem'}
  >
    {#if metric.valueAggregationType === 'percentage'}
      {metric.data.value}
      <span style:font-size="1.25rem" style:margin-bottom="0.1rem">
        {metric.valueAggregationType === 'percentage' ? '%' : ''}
      </span>
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
