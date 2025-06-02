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
  import { formatHex, formatHex8, type Hsv } from 'culori';
  import { Icon } from 'svelte-icons-pack';
  import { IoColorFillOutline } from 'svelte-icons-pack/io';

  import { toHsv } from '$lib/colors';
  import { cn, roundToDecimal } from '$lib/utils';

  import { Button } from '../ui/button';
  import { Input } from '../ui/input';
  import * as Popover from '../ui/popover';

  interface Props {
    value?: string;
    class?: string;
    disabled?: boolean;
    id?: string;
    name?: string;
    placeholder?: string;
    alpha?: boolean;
  }

  let {
    value = $bindable('#000000'),
    class: className = '',
    disabled = false,
    id = 'color-picker-input',
    name = 'color',
    placeholder: placeholderProp,
    alpha = false,
  }: Props = $props();

  let open = $state(false);

  let color = $state<Required<Hsv>>({
    h: 0,
    s: 1,
    v: 1,
    alpha: 1,
    mode: 'hsv',
  });

  let satValRect: DOMRect | undefined = $state();
  let hueRect: DOMRect | undefined = $state();
  let alphaRect: DOMRect | undefined = $state();
  let satValPickerEl: HTMLDivElement | undefined = $state();
  let huePickerEl: HTMLDivElement | undefined = $state();
  let alphaPickerEl: HTMLDivElement | undefined = $state();

  let isDraggingSatVal = $state(false);
  let isDraggingHue = $state(false);
  let isDraggingAlpha = $state(false);

  $effect(() => {
    if (satValPickerEl) {
      satValRect = satValPickerEl.getBoundingClientRect();
    }
  });

  $effect(() => {
    if (huePickerEl) {
      hueRect = huePickerEl.getBoundingClientRect();
    }
  });

  $effect(() => {
    if (alpha && alphaPickerEl) {
      alphaRect = alphaPickerEl.getBoundingClientRect();
    } else {
      alphaRect = undefined;
    }
  });

  $effect(() => {
    if (!isDraggingSatVal && !isDraggingHue && !isDraggingAlpha) {
      const currentHsva = toHsv(value);
      const currentStateHex = alpha ? formatHex8(color) : formatHex(color);

      if (value.toLowerCase() !== currentStateHex.toLowerCase() && currentHsva) {
        color = currentHsva as Required<Hsv>;
      }
    }
  });

  $effect(() => {
    const newHex = alpha ? formatHex8(color) : formatHex(color);
    if (value.toLowerCase() !== newHex.toLowerCase()) {
      value = newHex;
    }
  });

  let hueColor = $derived(formatHex({ h: color.h, s: 1, v: 1, mode: 'hsv' }));
  let satValHandleX = $derived(satValPickerEl ? color.s * satValPickerEl.clientWidth : 0);
  let satValHandleY = $derived(satValPickerEl ? (1 - color.v) * satValPickerEl.clientHeight : 0);
  let hueHandleY = $derived(hueRect ? (color.h / 360) * hueRect.height : 0);
  let alphaHandleY = $derived(alphaRect ? (1 - color.alpha) * alphaRect.height : 0);
  let alphaGradientColor = $derived(formatHex(color));
  let satValHandleStyle = $derived(
    `left: ${satValHandleX}px; top: ${satValHandleY}px; background-color: ${formatHex8(color)};`
  );

  let placeholder = $derived(placeholderProp ?? (alpha ? '#RRGGBBAA' : '#RRGGBB'));

  function updateSaturationValue(e: PointerEvent) {
    if (!satValRect || !satValPickerEl) return;

    const style = window.getComputedStyle(satValPickerEl);
    const borderLeft = parseFloat(style.borderLeftWidth);
    const borderTop = parseFloat(style.borderTopWidth);

    const pickerWidth = satValPickerEl.clientWidth;
    const pickerHeight = satValPickerEl.clientHeight;

    // Calculate pointer position relative to the content box (inside the border)
    const x = Math.max(0, Math.min(e.clientX - satValRect.left - borderLeft, pickerWidth));
    const y = Math.max(0, Math.min(e.clientY - satValRect.top - borderTop, pickerHeight));

    color.s = roundToDecimal(x / pickerWidth, 2);
    color.v = roundToDecimal(1 - y / pickerHeight, 2);
  }

  function updateHue(e: PointerEvent) {
    if (!hueRect) return;
    const y = Math.max(0, Math.min(e.clientY - hueRect.top, hueRect.height));
    color.h = roundToDecimal((y / hueRect.height) * 360, 2);
  }

  function updateAlpha(e: PointerEvent) {
    if (!alphaRect) return;
    const y = Math.max(0, Math.min(e.clientY - alphaRect.top, alphaRect.height));
    color.alpha = roundToDecimal(1 - y / alphaRect.height, 2);
  }

  function handleSatValPointerDown(e: PointerEvent) {
    if (disabled) return;
    isDraggingSatVal = true;
    satValPickerEl?.setPointerCapture(e.pointerId);
    satValRect = satValPickerEl?.getBoundingClientRect();
    updateSaturationValue(e);
  }

  function handleHuePointerDown(e: PointerEvent) {
    if (disabled) return;
    isDraggingHue = true;
    huePickerEl?.setPointerCapture(e.pointerId);
    hueRect = huePickerEl?.getBoundingClientRect();
    updateHue(e);
  }

  function handleAlphaPointerDown(e: PointerEvent) {
    if (disabled || !alpha) return;
    isDraggingAlpha = true;
    alphaPickerEl?.setPointerCapture(e.pointerId);
    alphaRect = alphaPickerEl?.getBoundingClientRect();
    updateAlpha(e);
  }

  function handlePointerMove(e: PointerEvent) {
    e.preventDefault();
    if (isDraggingSatVal) {
      updateSaturationValue(e);
    } else if (isDraggingHue) {
      updateHue(e);
    } else if (isDraggingAlpha && alpha) {
      updateAlpha(e);
    }
  }

  function handlePointerUp(e: PointerEvent) {
    if (isDraggingSatVal) {
      satValPickerEl?.releasePointerCapture(e.pointerId);
      isDraggingSatVal = false;
    } else if (isDraggingHue) {
      huePickerEl?.releasePointerCapture(e.pointerId);
      isDraggingHue = false;
    } else if (isDraggingAlpha) {
      alphaPickerEl?.releasePointerCapture(e.pointerId);
      isDraggingAlpha = false;
    }
  }

  function updateColorFromInput(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
    const inputValue = e.currentTarget.value.toLowerCase();
    const hexPattern = alpha ? /^#[0-9A-Fa-f]{8}$/i : /^#[0-9A-Fa-f]{6}$/i;

    if (hexPattern.test(inputValue)) {
      if (inputValue.toLowerCase() !== value.toLowerCase()) {
        value = inputValue;
      }
    } else {
      // Handle partially valid input? Or just ignore until valid.
      // For now, do nothing if the pattern doesn't match.
    }
  }

  function handleInputKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const target = event.currentTarget as HTMLInputElement;
      updateColorFromInput({ currentTarget: target } as any);
      open = false;
    }
  }
</script>

<Popover.Root bind:open>
  <Popover.Trigger {disabled}>
    {#snippet child({ props })}
      <Button
        variant="outline"
        tabindex={0}
        class={cn(
          'w-full justify-start p-2 text-left font-mono font-normal',
          !value && 'text-muted-foreground',
          className
        )}
        {disabled}
        {...props}
      >
        {#if value}
          <div class="relative mr-2 size-6 flex-shrink-0 overflow-hidden rounded border">
            <div class="absolute inset-0" style="background-color: {value}"></div>
          </div>
        {:else}
          <Icon src={IoColorFillOutline} className="mr-2 size-6 !text-muted-foreground" />
        {/if}
        <span class="overflow-hidden text-ellipsis whitespace-nowrap"
          >{value ? value.toUpperCase() : 'Pick a color'}</span
        >
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content
    class="w-fit p-4"
    onpointermove={handlePointerMove}
    onpointerup={handlePointerUp}
  >
    <div class="flex gap-3">
      <div
        bind:this={satValPickerEl}
        class="relative h-40 w-40 cursor-crosshair select-none overflow-hidden rounded border"
        style:background-color={hueColor}
        onpointerdown={handleSatValPointerDown}
        aria-label="Saturation and Value Picker"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-white to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <div
          class="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow ring-1 ring-black/50"
          style={satValHandleStyle}
        ></div>
      </div>

      <div
        bind:this={huePickerEl}
        class="relative h-40 w-5 cursor-ns-resize select-none overflow-hidden rounded border"
        style="background: linear-gradient(to bottom, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)"
        onpointerdown={handleHuePointerDown}
        aria-label="Hue Slider"
      >
        <div
          class="pointer-events-none absolute h-1 w-full -translate-y-1/2 border-y border-black/50 bg-white shadow"
          style:top="{hueHandleY}px"
        ></div>
      </div>

      {#if alpha}
        <div
          bind:this={alphaPickerEl}
          class="relative h-40 w-5 cursor-ns-resize select-none overflow-hidden rounded border bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==')] bg-repeat"
          onpointerdown={handleAlphaPointerDown}
          aria-label="Opacity Slider"
        >
          <div
            class="absolute inset-0"
            style="background: linear-gradient(to top, transparent, {alphaGradientColor})"
          ></div>
          <div
            class="pointer-events-none absolute h-1 w-full -translate-y-1/2 border-y border-black/50 bg-white shadow"
            style:top="{alphaHandleY}px"
          ></div>
        </div>
      {/if}
    </div>

    <Input
      class="mt-4 w-full font-mono text-sm"
      {id}
      {name}
      value={value.toUpperCase()}
      oninput={updateColorFromInput}
      maxlength={alpha ? 9 : 7}
      {placeholder}
      {disabled}
      aria-label="Hex Color Input"
      onkeydown={handleInputKeydown}
    />
  </Popover.Content>
</Popover.Root>
