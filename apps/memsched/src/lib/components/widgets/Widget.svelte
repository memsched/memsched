<!--
MEMsched - A memory scheduling and objective tracking application.
Copyright (C) 2025 Leonard Cseres

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
-->
<script lang="ts">
  import { formatHex8 } from 'culori';
  import type { ComponentProps } from 'svelte';

  import { brighten, getMutedColor, setOpacity, smartInvert } from '$lib/colors';
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
    marginX?: number;
    marginY?: number;
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
    marginX = 0,
    marginY = 0,
  }: WidgetProps = $props();

  const effectiveColor = $derived(dark ? formatHex8(smartInvert(color)) : color);
  const effectiveBackgroundColor = $derived(
    dark ? formatHex8(smartInvert(backgroundColor)) : backgroundColor
  );
  const effectiveAccentColor = $derived(
    dark ? formatHex8(brighten(smartInvert(accentColor), 0.2)) : accentColor
  );
  const effectiveBorderColor = $derived(
    dark ? formatHex8(brighten(smartInvert(borderColor), 0.125)) : borderColor
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
  style:margin-left="{marginX}px"
  style:margin-right="{marginX}px"
  style:margin-top="{marginY}px"
  style:margin-bottom="{marginY}px"
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
              style:background-color={formatHex8(setOpacity(accentColor, 0.15))}
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
            style:color={formatHex8(getMutedColor(effectiveColor, 1.0))}
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
              style:background-color={formatHex8(setOpacity(accentColor, 0.15))}
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
                accentColor={effectiveAccentColor}
                color={effectiveColor}
              />
            {:else if metric.style.startsWith('plot')}
              <PlotComponent
                metric={metric as ComponentProps<typeof PlotComponent>['metric']}
                accentColor={effectiveAccentColor}
                color={effectiveColor}
              />
            {:else if metric.style.startsWith('heatmap')}
              <HeatmapComponent
                metric={metric as ComponentProps<typeof HeatmapComponent>['metric']}
                accentColor={effectiveAccentColor}
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
