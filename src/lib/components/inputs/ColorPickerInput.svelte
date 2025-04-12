<script lang="ts">
  import { Icon } from 'svelte-icons-pack';
  import { IoColorFillOutline } from 'svelte-icons-pack/io';

  import { cn, hexToHsva, hsvaToHexa, hsvToHex, roundToDecimal } from '$lib/utils';

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
    value = $bindable('#4fc59e'),
    class: className = '',
    disabled = false,
    id = 'color-picker-input',
    name = 'color',
    placeholder: placeholderProp,
    alpha = false,
  }: Props = $props();

  let h = $state(0);
  let s = $state(100);
  let v = $state(100);
  let a = $state(1);

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
    const currentHsva = hexToHsva(value);
    if (currentHsva && !isDraggingSatVal && !isDraggingHue && !isDraggingAlpha) {
      h = currentHsva.h;
      s = currentHsva.s;
      v = currentHsva.v;
      if (alpha && value.length > 7) {
        a = currentHsva.a;
      } else if (alpha && value.length <= 7) {
        a = 1;
      } else {
        a = 1;
      }
    } else if (!currentHsva && alpha) {
      // Handle invalid initial color in alpha mode - maybe default?
      // For now, just keep previous state or default to white opaque
      // h = 0; s = 0; v = 100; a = 1;
    } else if (!currentHsva && !alpha) {
      // Handle invalid initial color in non-alpha mode
      // h = 0; s = 0; v = 100; a = 1;
    }
  });

  $effect(() => {
    const newHex = alpha ? hsvaToHexa(h, s, v, a) : hsvToHex(h, s, v);
    if (value.toLowerCase() !== newHex.toLowerCase()) {
      value = newHex;
    }
  });

  let hueColor = $derived(hsvToHex(h, 100, 100));
  let satValHandleX = $derived(satValRect ? (s / 100) * satValRect.width : 0);
  let satValHandleY = $derived(satValRect ? ((100 - v) / 100) * satValRect.height : 0);
  let hueHandleY = $derived(hueRect ? (h / 360) * hueRect.height : 0);
  let alphaHandleY = $derived(alphaRect ? (1 - a) * alphaRect.height : 0);
  let alphaGradientColor = $derived(hsvToHex(h, s, v));
  let satValHandleStyle = $derived(
    `left: ${satValHandleX}px; top: ${satValHandleY}px; background-color: ${alpha ? hsvaToHexa(h, s, v, a) : hsvToHex(h, s, v)};`
  );

  let placeholder = $derived(placeholderProp ?? (alpha ? '#RRGGBBAA' : '#RRGGBB'));

  function updateSaturationValue(e: PointerEvent) {
    if (!satValRect) return;
    const x = Math.max(0, Math.min(e.clientX - satValRect.left, satValRect.width));
    const y = Math.max(0, Math.min(e.clientY - satValRect.top, satValRect.height));

    s = roundToDecimal((x / satValRect.width) * 100, 2);
    v = roundToDecimal(100 - (y / satValRect.height) * 100, 2);
  }

  function updateHue(e: PointerEvent) {
    if (!hueRect) return;
    const y = Math.max(0, Math.min(e.clientY - hueRect.top, hueRect.height));
    h = roundToDecimal((y / hueRect.height) * 360, 2);
  }

  function updateAlpha(e: PointerEvent) {
    if (!alphaRect) return;
    const y = Math.max(0, Math.min(e.clientY - alphaRect.top, alphaRect.height));
    a = roundToDecimal(1 - y / alphaRect.height, 2);
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
      const newHsva = hexToHsva(inputValue);
      if (newHsva) {
        const checkHex = alpha
          ? hsvaToHexa(newHsva.h, newHsva.s, newHsva.v, newHsva.a)
          : hsvToHex(newHsva.h, newHsva.s, newHsva.v);
        if (checkHex.toLowerCase() !== value.toLowerCase()) {
          h = newHsva.h;
          s = newHsva.s;
          v = newHsva.v;
          if (alpha) {
            a = newHsva.a;
          } else {
            a = 1;
          }
        }
      }
    } else {
      // Handle partially valid input? Or just ignore until valid.
      // For now, do nothing if the pattern doesn't match.
    }
  }
</script>

<Popover.Root>
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
    />
  </Popover.Content>
</Popover.Root>
