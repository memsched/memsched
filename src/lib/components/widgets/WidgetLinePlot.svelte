<script lang="ts">
  import type { WidgetJoinMetricsPreviewPlotData } from '$lib/server/db/schema';
  import Watermark from '$lib/components/svgs/Watermark.svelte';
  import TrendingUpArrow from '$lib/components/svgs/TrendingUpArrow.svelte';

  // SVG plot constants
  const PLOT_WIDTH = 70;
  const PLOT_HEIGHT = 40;
  const PLOT_PADDING = 4;
  const PLOT_VIEW_BOX = `${-PLOT_PADDING} ${-PLOT_PADDING} ${PLOT_WIDTH + 2 * PLOT_PADDING} ${PLOT_HEIGHT + 2 * PLOT_PADDING}`;
  const BOTTOM_PADDING_PERCENT = 0.3; // padding below the lowest point

  const {
    title,
    subtitle,
    metrics,
    imageUrl,
    textIcon,
    imagePlacement = 'left',
    padding = 16,
    border = true,
    borderRadius = 8,
    color = 'black',
    backgroundColor = 'white',
    accentColor = 'lime',
    watermark = true,
  }: WidgetJoinMetricsPreviewPlotData = $props();

  // Helper function to add opacity to a hex color
  function addOpacity(hexColor: string, opacity: number): string {
    // Remove # if present
    const hex = hexColor.replace('#', '');

    // Convert hex to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Return rgba string
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  // Function to create SVG path for line plot
  function createLinePath(
    points: { date: string; value: number }[],
    width: number,
    height: number
  ): string {
    if (!points || points.length === 0) return '';

    // Get min and max values for scaling
    const values = points.map((p) => p.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue || 1; // Avoid division by zero

    // Add bottom padding by adjusting the effective height
    const effectiveHeight = height * (1 - BOTTOM_PADDING_PERCENT);

    // Create points for path
    const pathPoints = points.map((point, index) => {
      const x = (index / (points.length - 1 || 1)) * width;
      const y = effectiveHeight - ((point.value - minValue) / valueRange) * effectiveHeight;
      return `${x},${y}`;
    });

    return `M${pathPoints.join(' L')}`;
  }
</script>

<div
  style:display="flex"
  style:flex-direction="column"
  style:align-items="flex-start"
  style:gap="0.2rem"
>
  <div
    style:border={border ? '1px solid #ededed' : 'none'}
    style:border-radius="{borderRadius}px"
    style:color
    style:background-color={backgroundColor}
    style:padding="{padding}px"
    style:margin="1px"
    style:display="flex"
    style:align-items={(imageUrl || textIcon) && imagePlacement === 'right'
      ? 'flex-start'
      : 'center'}
    style:justify-content="center"
    style:flex-direction={(imageUrl || textIcon) && imagePlacement === 'right' ? 'column' : 'row'}
    style:gap={(imageUrl || textIcon) && imagePlacement === 'right' ? '1rem' : '2rem'}
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
      {:else if textIcon && imagePlacement === 'left'}
        <div
          style:display="flex"
          style:align-items="center"
          style:justify-content="center"
          style:width="48px"
          style:height="48px"
          style:background-color={addOpacity(accentColor, 0.1)}
          style:border-radius="6px"
          style:font-weight="600"
          style:font-size="1.2rem"
          style:color={accentColor}
        >
          {textIcon}
        </div>
      {/if}
      <div
        style:display="flex"
        style:flex-direction="column"
        style:justify-content="center"
        style:gap="0.2rem"
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
      {:else if textIcon && imagePlacement === 'right'}
        <div
          style:display="flex"
          style:align-items="center"
          style:justify-content="center"
          style:width="48px"
          style:height="48px"
          style:background-color={addOpacity(accentColor, 0.1)}
          style:border-radius="6px"
          style:font-weight="600"
          style:font-size="1.2rem"
          style:color={accentColor}
        >
          {textIcon}
        </div>
      {/if}
    </div>
    {#if metrics.length > 0}
      <div style:display="flex" style:gap="1.25rem">
        {#each metrics as metric}
          <div style:display="flex" style:align-items="center" style:gap="0.3rem">
            <div style:display="flex" style:align-items="center">
              {#if metric.plotData && metric.plotData.points && metric.plotData.points.length > 0}
                <svg
                  width={PLOT_WIDTH}
                  height={PLOT_HEIGHT}
                  viewBox={PLOT_VIEW_BOX}
                  style:margin-left="0.25rem"
                  style:vertical-align="middle"
                >
                  <!-- Line plot -->
                  <path
                    d={createLinePath(metric.plotData.points, PLOT_WIDTH, PLOT_HEIGHT)}
                    fill="none"
                    stroke={accentColor}
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <!-- <path
                    d={createLinePath(metric.plotData.points, PLOT_WIDTH, PLOT_HEIGHT)}
                    fill="none"
                    stroke={addOpacity(accentColor, 0.2)}
                    stroke-width="5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  /> -->
                  <!-- Subtle area under the line -->
                  <path
                    d={`${createLinePath(metric.plotData.points, PLOT_WIDTH, PLOT_HEIGHT)} L${PLOT_WIDTH},${PLOT_HEIGHT} L0,${PLOT_HEIGHT} Z`}
                    fill={addOpacity(accentColor, 0.1)}
                    stroke="none"
                  />
                </svg>
              {/if}
            </div>
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
              <div style:font-size="0.8rem">
                {metric.name}
              </div>
            </div>
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
