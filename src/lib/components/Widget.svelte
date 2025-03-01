<script module lang="ts">
  export interface Metric {
    value: number;
    description: string;
  }

  export interface WidgetProps {
    title: string;
    subtitle: string;
    metrics: Metric[];

    padding?: number;
    border?: boolean;
    borderRadius?: number;
    color?: string;
    backgroundColor?: string;
    watermark?: boolean;
  }
</script>

<script lang="ts">
  import Watermark from './svgs/Watermark.svelte';

  const {
    title,
    subtitle,
    metrics,
    padding = 1.2,
    border = true,
    borderRadius = 8,
    color = 'black',
    backgroundColor = 'white',
    watermark = true,
  }: WidgetProps = $props();
</script>

<div
  style:border={border ? '1px solid lightgray' : 'none'}
  style:border-radius="{borderRadius}px"
  style:color
  style:background-color={backgroundColor}
  style:padding="{padding}rem"
  style:margin="1px"
  style:display="flex"
  style:justify-content="space-between"
  style:align-items="center"
  style:gap="2.5rem"
>
  <div
    style:display="flex"
    style:flex-direction="column"
    style:justify-content="center"
    style:gap="0.3rem"
  >
    {#if watermark}
      <Watermark />
    {/if}
    <div style:font-size="1.2rem" style:font-weight="600">
      {title}
    </div>
    <div style:font-size="0.8rem">{subtitle}</div>
  </div>
  <div style:display="flex" style:gap="1.25rem">
    {#each metrics as metric}
      <div style:display="flex" style:flex-direction="column">
        <div style:font-size="2rem" style:font-weight="800" style:line-height="1">
          {metric.value}
        </div>
        <div style:font-size="0.8rem">{metric.description}</div>
      </div>
    {/each}
  </div>
</div>

<!-- These styles are only aplied to the html version of the widget -->
<style>
  div {
    white-space: nowrap;
    line-height: 1.3;
  }
</style>
