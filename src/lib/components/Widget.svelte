<script lang="ts">
  import type { WidgetJoinMetricsPreview } from '$lib/server/db/schema';
  import Watermark from './svgs/Watermark.svelte';

  const {
    title,
    subtitle,
    metrics,
    padding = 16,
    border = true,
    borderRadius = 8,
    color = 'black',
    backgroundColor = 'white',
    watermark = true,
  }: WidgetJoinMetricsPreview = $props();
</script>

<div
  style:border={border ? '1px solid lightgray' : 'none'}
  style:border-radius="{borderRadius}px"
  style:color
  style:background-color={backgroundColor}
  style:padding="{padding}px"
  style:margin="1px"
  style:display="flex"
  style:align-items="center"
  style:justify-content="center"
  style:gap="2.5rem"
>
  <div
    style:display="flex"
    style:justify-content="center"
    style:gap="1rem"
    style:align-items="center"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 512 512"
      ><mask id="a"><circle cx="256" cy="256" r="256" fill="#fff" /></mask><g mask="url(#a)"
        ><path fill="#0052b4" d="M512 170v172l-256 32L0 342V170l256-32z" /><path
          fill="#eee"
          d="M512 0v170H0V0Z"
        /><path fill="#d80027" d="M512 342v170H0V342Z" /></g
      ></svg
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
      <div style:font-size="0.8rem" style:max-width="350px" style:overflow="hidden">
        {subtitle}
      </div>
    </div>
  </div>
  {#if metrics.length > 0}
    <div style:display="flex" style:gap="1.25rem">
      {#each metrics as metric}
        <div style:display="flex" style:flex-direction="column">
          <div style:font-size="2rem" style:font-weight="800" style:line-height="1">
            {metric.value}
          </div>
          <div style:font-size="0.8rem">{metric.name}</div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<!-- These styles are only aplied to the html version of the widget -->
<style>
  div {
    white-space: nowrap;
    line-height: 1.3;
  }
</style>
