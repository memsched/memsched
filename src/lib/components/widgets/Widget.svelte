<script lang="ts">
  import type { ComponentProps } from 'svelte';

  import { addOpacityRgba, getMutedHexColor, lightenHexColor, smartInvertColor } from '$lib/colors';
  import Watermark from '$lib/components/svgs/Watermark.svelte';
  import HeatmapComponent from '$lib/components/widgets/components/HeatmapComponent.svelte';
  import PlotComponent from '$lib/components/widgets/components/PlotComponent.svelte';
  import ValueComponent from '$lib/components/widgets/components/ValueComponent.svelte';
  import WidgetEditComponent from '$lib/components/widgets/utils/WidgetEditComponent.svelte';
  import type { WidgetData, WidgetMetricData } from '$lib/server/services/metrics/types';
  import type { PartialBy } from '$lib/types';

  interface Props {
    onTitleClick?: () => void;
    onSubtitleClick?: () => void;
    onImageClick?: () => void;
    onImageClose?: (e: MouseEvent) => void;
    onMetricClick?: (index: number) => void;
    onMetricClose?: (e: MouseEvent, index: number) => void;
    onMetricDrag?: (fromIndex: number, toIndex: number) => void;
  }

  interface WidgetProps extends Partial<WidgetData>, Props {
    metrics?: PartialBy<WidgetMetricData, 'data'>[];
    dark?: boolean;
  }

  const {
    title,
    subtitle,
    metrics,
    imageUrl,
    textIcon,
    imagePlacement = 'left',
    padding = 16,
    borderWidth = 1,
    borderRadius = 8,
    borderColor = '#ededed',
    color = 'black',
    backgroundColor = 'white',
    accentColor = 'lime',
    watermark = true,
    onTitleClick,
    onSubtitleClick,
    onImageClick,
    onImageClose,
    onMetricClick,
    onMetricClose,
    onMetricDrag,
    dark = false,
  }: WidgetProps = $props();

  const effectiveBorderColor = $derived(
    dark ? lightenHexColor(smartInvertColor(borderColor), 15) : borderColor
  );
  const effectiveColor = $derived(dark ? smartInvertColor(color) : color);
  const effectiveBackgroundColor = $derived(
    dark ? smartInvertColor(backgroundColor) : backgroundColor
  );

  let draggedIndex = $state(-1);
  let dragOverIndex = $state(-1);

  function handleDragStart(index: number) {
    draggedIndex = index;
  }

  function handleDragOver(e: DragEvent, index: number) {
    e.preventDefault();
    dragOverIndex = index;
  }

  function handleDrop(e: DragEvent, index: number) {
    e.preventDefault();
    if (draggedIndex !== -1 && draggedIndex !== index && onMetricDrag) {
      onMetricDrag(draggedIndex, index);
    }
    draggedIndex = -1;
    dragOverIndex = -1;
  }

  function handleDragEnd() {
    draggedIndex = -1;
    dragOverIndex = -1;
  }
</script>

<div
  style:display="flex"
  style:flex-direction="column"
  style:align-items="flex-start"
  style:gap="0.2rem"
>
  <div
    style:border={`${borderWidth}px solid ${effectiveBorderColor}`}
    style:border-radius="{borderRadius}px"
    style:color={effectiveColor}
    style:background-color={effectiveBackgroundColor}
    style:padding="{padding}px"
    style:margin="1px"
    style:display="flex"
    style:align-items={(imageUrl || textIcon || onImageClick !== undefined) &&
    imagePlacement === 'right'
      ? 'flex-start'
      : 'center'}
    style:justify-content="center"
    style:flex-direction={(imageUrl || textIcon || onImageClick !== undefined) &&
    imagePlacement === 'right'
      ? 'column'
      : 'row'}
    style:gap={(imageUrl || textIcon || onImageClick !== undefined) && imagePlacement === 'right'
      ? '1rem'
      : '2rem'}
  >
    <div
      style:display="flex"
      style:justify-content="space-between"
      style:gap={imagePlacement === 'right' && (imageUrl || textIcon || onImageClick !== undefined)
        ? '2rem'
        : '1rem'}
      style:align-items="center"
      style:width={imagePlacement === 'right' &&
      (imageUrl || textIcon || onImageClick !== undefined)
        ? '100%'
        : 'auto'}
    >
      {#if imagePlacement === 'left'}
        <WidgetEditComponent
          onclick={onImageClick}
          onclose={onImageClose}
          width="48px"
          height="48px"
          label="Image"
          value={imageUrl || textIcon}
        >
          {#if imageUrl}
            <img
              src={imageUrl}
              alt=""
              width="48"
              height="48"
              loading="eager"
              style:object-fit="contain"
            />
          {:else if textIcon}
            <div
              style:display="flex"
              style:align-items="center"
              style:justify-content="center"
              style:width="48px"
              style:height="48px"
              style:background-color={addOpacityRgba(accentColor, 0.1)}
              style:border-radius="6px"
              style:font-weight="600"
              style:font-size="1.2rem"
              style:color={accentColor}
            >
              {textIcon}
            </div>
          {/if}
        </WidgetEditComponent>
      {/if}
      <div
        style:display="flex"
        style:flex-direction="column"
        style:justify-content="center"
        style:gap="0.2rem"
      >
        <WidgetEditComponent
          onclick={onTitleClick}
          width="150px"
          height="1.2rem"
          label="Title"
          value={title}
        >
          <div style:font-size="1.2rem" style:font-weight="600" style:letter-spacing="-0.025em">
            {title}
          </div>
        </WidgetEditComponent>
        <WidgetEditComponent
          onclick={onSubtitleClick}
          width="100px"
          height="0.8rem"
          label="Subtitle"
          value={subtitle || ''}
        >
          <div
            style:font-size="0.8rem"
            style:max-width="350px"
            style:overflow="hidden"
            style:color={getMutedHexColor(effectiveColor, 1.0)}
          >
            {subtitle}
          </div>
        </WidgetEditComponent>
      </div>
      {#if imagePlacement === 'right'}
        <WidgetEditComponent
          onclick={onImageClick}
          onclose={onImageClose}
          width="48px"
          height="48px"
          label="Image"
          value={imageUrl || textIcon}
        >
          {#if imageUrl}
            <img
              src={imageUrl}
              alt=""
              width="48"
              height="48"
              loading="eager"
              style:object-fit="contain"
            />
          {:else if textIcon}
            <div
              style:display="flex"
              style:align-items="center"
              style:justify-content="center"
              style:width="48px"
              style:height="48px"
              style:background-color={addOpacityRgba(accentColor, 0.1)}
              style:border-radius="6px"
              style:font-weight="600"
              style:font-size="1.2rem"
              style:color={accentColor}
            >
              {textIcon}
            </div>
          {/if}
        </WidgetEditComponent>
      {/if}
    </div>
    <div style:display="flex" style:gap="1.25rem" style:align-items="center">
      {#if metrics && metrics.length > 0}
        {#each metrics as metric, i}
          <WidgetEditComponent
            onclick={onMetricClick ? () => onMetricClick(i) : undefined}
            onclose={onMetricClose ? (e) => onMetricClose(e, i) : undefined}
            width="80px"
            height="48px"
            label={`Metric ${i + 1}`}
            value={metric.style}
            ondragstart={() => handleDragStart(i)}
            ondragover={(e) => handleDragOver(e, i)}
            ondrop={(e) => handleDrop(e, i)}
            ondragend={handleDragEnd}
            isDragged={draggedIndex === i}
            isDragOver={dragOverIndex === i}
          >
            {#if metric.style.startsWith('metric')}
              <ValueComponent
                metric={metric as ComponentProps<typeof ValueComponent>['metric']}
                {accentColor}
                color={effectiveColor}
              />
            {:else if metric.style.startsWith('plot')}
              <PlotComponent
                metric={metric as ComponentProps<typeof PlotComponent>['metric']}
                {accentColor}
                color={effectiveColor}
              />
            {:else if metric.style.startsWith('heatmap')}
              <HeatmapComponent
                metric={metric as ComponentProps<typeof HeatmapComponent>['metric']}
                {accentColor}
                color={effectiveColor}
              />
            {/if}
          </WidgetEditComponent>
        {/each}
      {/if}
    </div>
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
