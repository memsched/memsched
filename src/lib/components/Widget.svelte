<script lang="ts">
  import type { WidgetJoinMetricsPreview } from '$lib/server/db/schema';
  import Watermark from './svgs/Watermark.svelte';
  import TrendingUpArrow from './svgs/TrendingUpArrow.svelte';
  const {
    title,
    subtitle,
    metrics,
    imageUrl,
    imagePlacement = 'left',
    padding = 16,
    border = true,
    borderRadius = 8,
    color = 'black',
    backgroundColor = 'white',
    accentColor = 'lime',
    watermark = true,
  }: WidgetJoinMetricsPreview = $props();
</script>

<div
  style:display="flex"
  style:flex-direction="column"
  style:align-items="flex-start"
  style:gap="0.2rem"
>
  <div
    style:border={border ? '1px solid #e4e4e7' : 'none'}
    style:border-radius="{borderRadius}px"
    style:color
    style:background-color={backgroundColor}
    style:padding="{padding}px"
    style:margin="1px"
    style:display="flex"
    style:align-items={imageUrl && imagePlacement === 'right' ? 'flex-start' : 'center'}
    style:justify-content="center"
    style:flex-direction={imageUrl && imagePlacement === 'right' ? 'column' : 'row'}
    style:gap={imageUrl && imagePlacement === 'right' ? '1rem' : '2rem'}
  >
    <div
      style:display="flex"
      style:justify-content="space-between"
      style:gap={imagePlacement === 'left' ? '1rem' : '2rem'}
      style:align-items="center"
      style:width={imagePlacement === 'left' ? 'auto' : '100%'}
    >
      {#if imageUrl && imagePlacement === 'left'}
        <img
          src={imageUrl}
          alt=""
          width="48"
          height="48"
          loading="eager"
          style:object-fit="contain"
        />
      {/if}
      <div
        style:display="flex"
        style:flex-direction="column"
        style:justify-content="center"
        style:gap="0.3rem"
      >
        <div style:font-size="1.2rem" style:font-weight="600" style:letter-spacing="-0.025em">
          {title}
        </div>
        <div style:font-size="0.8rem" style:max-width="350px" style:overflow="hidden">
          {subtitle}
        </div>
      </div>
      {#if imageUrl && imagePlacement === 'right'}
        <img
          src={imageUrl}
          alt=""
          width="48"
          height="48"
          loading="eager"
          style:object-fit="contain"
        />
      {/if}
    </div>
    {#if metrics.length > 0}
      <div style:display="flex" style:gap="1.25rem">
        {#each metrics as metric}
          <div style:display="flex" style:flex-direction="column">
            <div
              style:font-size="2rem"
              style:font-weight="800"
              style:line-height="1"
              style:display="flex"
              style:align-items="flex-end"
              style:gap="0.3rem"
            >
              {metric.value}
              <TrendingUpArrow style="stroke: {accentColor}; color: {accentColor}" />
            </div>
            <div style:font-size="0.8rem">{metric.name}</div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
  {#if watermark}
    <div
      style:color="#A3A3A3"
      style:font-size="0.6rem"
      style:display="flex"
      style:align-items="center"
      style:justify-content="center"
      style:gap="0.25rem"
    >
      Powered by <Watermark />
    </div>
  {/if}
</div>

<!-- These styles are only aplied to the html version of the widget -->
<style>
  div {
    text-align: start;
    white-space: nowrap;
    line-height: 1.3;
    height: fit-content;
    width: fit-content;
    flex-shrink: 0;
  }
</style>
