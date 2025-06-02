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
  import { setMode, userPrefersMode } from 'mode-watcher';
  import { onMount } from 'svelte';

  import { browser } from '$app/environment';

  // Types
  type ColorPair = {
    base: string;
    foreground: string;
    label: string;
  };

  type StandaloneVariable = {
    name: string;
    label: string;
  };

  type ThemeMode = 'system' | 'light' | 'dark';

  // Configuration
  const INITIAL_POSITION = { x: 20, y: 80 };

  // Color variable pairs (base and foreground)
  const COLOR_PAIRS: ColorPair[] = [
    { base: 'primary', foreground: 'primary-foreground', label: 'Primary' },
    { base: 'secondary', foreground: 'secondary-foreground', label: 'Secondary' },
    { base: 'destructive', foreground: 'destructive-foreground', label: 'Destructive' },
    { base: 'accent', foreground: 'accent-foreground', label: 'Accent' },
    { base: 'background', foreground: 'foreground', label: 'Background' },
    { base: 'muted', foreground: 'muted-foreground', label: 'Muted' },
    { base: 'card', foreground: 'card-foreground', label: 'Card' },
    { base: 'popover', foreground: 'popover-foreground', label: 'Popover' },
  ];

  // Standalone variables
  const STANDALONE_VARIABLES: StandaloneVariable[] = [
    { name: 'border', label: 'Border' },
    { name: 'input', label: 'Input' },
    { name: 'ring', label: 'Ring' },
    { name: 'back', label: 'Back' },
  ];

  // Theme modes
  const THEME_MODES: ThemeMode[] = ['system', 'light', 'dark'];

  // State
  let hue = $state(190);
  let saturation = $state(40);
  let lightness = $state(95);
  let selectedPair = $state<ColorPair | null>(COLOR_PAIRS[0]);
  let isEditingForeground = $state(false);
  let selectedStandalone = $state<StandaloneVariable | null>(null);
  let copySuccess = $state(false);
  let copyTimeout: number | null = null;
  let currentTheme = $state<ThemeMode>('system');

  // Store all color values
  let colorValues = $state<Record<string, string>>({});

  // Dragging state
  let isDragging = $state(false);
  let position = $state(INITIAL_POSITION);
  let startPosition = $state({ x: 0, y: 0 });
  let startDragPosition = $state({ x: 0, y: 0 });

  // Collapsed state
  let isCollapsed = $state(false);

  // Derived values
  let currentVariable = $derived(
    isEditingForeground && selectedPair
      ? selectedPair.foreground
      : selectedStandalone
        ? selectedStandalone.name
        : selectedPair?.base || ''
  );
  let currentLabel = $derived(
    isEditingForeground && selectedPair
      ? `${selectedPair.label} Foreground`
      : selectedStandalone
        ? selectedStandalone.label
        : selectedPair?.label || ''
  );

  // Color preview styles
  let currentStyle = $derived(`background-color: hsl(${hue}, ${saturation}%, ${lightness}%);`);

  // Slider gradient styles
  let saturationGradient = $derived(
    `background: linear-gradient(to right, hsl(${hue}, 0%, ${lightness}%), hsl(${hue}, 100%, ${lightness}%));`
  );
  let lightnessGradient = $derived(
    `background: linear-gradient(to right, hsl(${hue}, ${saturation}%, 0%), hsl(${hue}, ${saturation}%, 50%), hsl(${hue}, ${saturation}%, 100%));`
  );

  // Update CSS variables when color changes
  function updateColorVariable() {
    if (!browser) return;

    const value = `${hue} ${saturation}% ${lightness}%`;
    document.documentElement.style.setProperty(`--${currentVariable}`, value);

    // Update our stored value
    colorValues[currentVariable] = value;
  }

  // Copy current color variable(s) to clipboard
  function copyCurrentToClipboard() {
    if (!browser) return;

    let cssText = '';

    if (selectedPair && !selectedStandalone) {
      // Copy the current pair (both base and foreground)
      const baseValue =
        colorValues[selectedPair.base] ||
        getComputedStyle(document.documentElement)
          .getPropertyValue(`--${selectedPair.base}`)
          .trim();
      const foregroundValue =
        colorValues[selectedPair.foreground] ||
        getComputedStyle(document.documentElement)
          .getPropertyValue(`--${selectedPair.foreground}`)
          .trim();

      if (baseValue) {
        cssText += `--${selectedPair.base}: ${baseValue};\n`;
      }
      if (foregroundValue) {
        cssText += `--${selectedPair.foreground}: ${foregroundValue};\n`;
      }
    } else if (selectedStandalone) {
      // Copy just the standalone variable
      const value =
        colorValues[selectedStandalone.name] ||
        getComputedStyle(document.documentElement)
          .getPropertyValue(`--${selectedStandalone.name}`)
          .trim();

      if (value) {
        cssText += `--${selectedStandalone.name}: ${value};`;
      }
    }

    if (cssText) {
      navigator.clipboard.writeText(cssText).then(() => {
        copySuccess = true;

        if (copyTimeout) {
          clearTimeout(copyTimeout);
        }

        copyTimeout = window.setTimeout(() => {
          copySuccess = false;
          copyTimeout = null;
        }, 2000);
      });
    }
  }

  // Toggle between base and foreground
  function toggleForeground() {
    if (selectedStandalone) return; // No toggle for standalone variables
    isEditingForeground = !isEditingForeground;

    // Load the appropriate color values
    if (selectedPair) {
      const variableName = isEditingForeground ? selectedPair.foreground : selectedPair.base;
      loadColorFromCSS(variableName);
    }
  }

  // Handle variable selection change
  function handleVariableChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const value = select.value;

    // Check if it's a standalone variable
    const standalone = STANDALONE_VARIABLES.find((v) => v.name === value);
    if (standalone) {
      selectedPair = null;
      selectedStandalone = standalone;
      isEditingForeground = false;
      loadColorFromCSS(value);
      return;
    }

    // Otherwise it's a pair
    const pair = COLOR_PAIRS.find((p) => p.base === value);
    if (pair) {
      selectedPair = pair;
      selectedStandalone = null;
      isEditingForeground = false; // Reset to base when changing pairs
      loadColorFromCSS(pair.base);
    }
  }

  // Load all color values from CSS
  function loadAllColorValues() {
    if (!browser) return;

    const computedStyle = getComputedStyle(document.documentElement);

    // Load all color pairs
    for (const pair of COLOR_PAIRS) {
      const baseVar = computedStyle.getPropertyValue(`--${pair.base}`).trim();
      const foregroundVar = computedStyle.getPropertyValue(`--${pair.foreground}`).trim();

      if (baseVar) colorValues[pair.base] = baseVar;
      if (foregroundVar) colorValues[pair.foreground] = foregroundVar;
    }

    // Load all standalone variables
    for (const variable of STANDALONE_VARIABLES) {
      const varValue = computedStyle.getPropertyValue(`--${variable.name}`).trim();
      if (varValue) colorValues[variable.name] = varValue;
    }
  }

  // Load color values from CSS variable
  function loadColorFromCSS(variableName: string) {
    if (!browser) return;

    const computedStyle = getComputedStyle(document.documentElement);
    const colorVar = computedStyle.getPropertyValue(`--${variableName}`).trim();

    if (colorVar) {
      const [h, s, l] = colorVar.split(' ').map((val) => parseFloat(val));
      if (!isNaN(h) && !isNaN(s) && !isNaN(l)) {
        hue = h;
        saturation = parseInt(s.toString());
        lightness = parseInt(l.toString());

        // Store the value
        colorValues[variableName] = colorVar;
      }
    }
  }

  // Dragging functionality
  function startDrag(event: MouseEvent) {
    isDragging = true;
    startPosition = { x: position.x, y: position.y };
    startDragPosition = { x: event.clientX, y: event.clientY };

    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', endDrag);
  }

  function onDrag(event: MouseEvent) {
    if (!isDragging) return;

    position = {
      x: startPosition.x + (event.clientX - startDragPosition.x),
      y: startPosition.y + (event.clientY - startDragPosition.y),
    };
  }

  function endDrag() {
    isDragging = false;
    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('mouseup', endDrag);
  }

  function toggleCollapse() {
    isCollapsed = !isCollapsed;
  }

  // Theme toggle functions
  function handleThemeToggle(selectedMode: ThemeMode) {
    if (!browser) return;

    if (selectedMode === 'system') {
      setMode('system');
    } else {
      setMode(selectedMode);
    }

    currentTheme = selectedMode;
  }

  // Initialize from current CSS variables
  onMount(() => {
    if (!browser) return;

    // Load all color values
    loadAllColorValues();

    // Load the initial selected variable
    if (selectedPair) {
      loadColorFromCSS(selectedPair.base);
    } else if (selectedStandalone) {
      loadColorFromCSS(selectedStandalone.name);
    }

    // Get current theme mode
    const prefersMode = userPrefersMode.current;
    if (prefersMode === 'system') {
      currentTheme = 'system';
    } else {
      currentTheme = prefersMode as ThemeMode;
    }
  });

  // Update CSS when color values change
  $effect(() => {
    if (browser) {
      updateColorVariable();
    }
  });
</script>

<div
  class="fixed z-[9999] w-64 select-none overflow-hidden rounded-lg border border-border bg-background font-sans text-sm shadow-md"
  style="left: {position.x}px; top: {position.y}px;"
>
  <!-- Header -->
  <div
    class="flex h-8 cursor-move items-center justify-between border-b border-border bg-muted px-2.5 py-1"
    onmousedown={startDrag}
    role="button"
    aria-label="Drag to move color picker"
    tabindex="0"
  >
    <span class="text-sm font-semibold">Theme Color Editor</span>
    <div class="flex items-center gap-1">
      <button
        class="flex h-5 w-5 cursor-pointer items-center justify-center rounded border-none bg-transparent text-xs hover:bg-muted-foreground/10"
        onclick={copyCurrentToClipboard}
        title="Copy current color to clipboard"
      >
        {#if copySuccess}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        {:else}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
        {/if}
      </button>
      <button
        class="flex h-5 w-5 cursor-pointer items-center justify-center rounded border-none bg-transparent text-xs hover:bg-muted-foreground/10"
        onclick={toggleCollapse}
        aria-label={isCollapsed ? 'Expand' : 'Collapse'}
      >
        {#if isCollapsed}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        {:else}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m18 15-6-6-6 6" />
          </svg>
        {/if}
      </button>
    </div>
  </div>

  <!-- Content -->
  {#if !isCollapsed}
    <div class="p-3">
      <!-- Theme Mode Toggle -->
      <div class="mb-3 border-b border-border pb-3">
        <div class="mb-2 text-xs font-medium">Theme Mode:</div>
        <div class="flex items-center justify-between gap-2">
          {#each THEME_MODES as mode}
            <button
              class="flex-1 rounded border border-border px-2 py-1 text-xs transition-colors"
              class:bg-primary={currentTheme === mode}
              class:text-primary-foreground={currentTheme === mode}
              onclick={() => handleThemeToggle(mode)}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          {/each}
        </div>
      </div>

      <!-- Variable Selector -->
      <div class="mb-3">
        <label class="flex flex-col gap-1.5 text-xs font-medium">
          Color Variable:
          <div class="flex gap-2">
            <select
              class="flex-1 rounded border border-border bg-background px-2 py-1 text-xs"
              onchange={handleVariableChange}
              value={selectedStandalone ? selectedStandalone.name : selectedPair?.base}
            >
              <optgroup label="Color Pairs">
                {#each COLOR_PAIRS as pair}
                  <option value={pair.base}>{pair.label}</option>
                {/each}
              </optgroup>
              <optgroup label="Standalone Colors">
                {#each STANDALONE_VARIABLES as variable}
                  <option value={variable.name}>{variable.label}</option>
                {/each}
              </optgroup>
            </select>

            {#if selectedPair && !selectedStandalone}
              <button
                class="rounded border border-border bg-background px-2 py-1 text-xs hover:bg-muted/50"
                onclick={toggleForeground}
                title="Toggle between base and foreground"
              >
                {isEditingForeground ? 'Base' : 'FG'}
              </button>
            {/if}
          </div>
        </label>
      </div>

      <!-- Color Preview -->
      <div class="mb-3">
        <div class="flex flex-col gap-1">
          <div class="h-[30px] w-full rounded border border-border" style={currentStyle}></div>
          <span class="text-center text-[10px] leading-tight">{currentLabel}</span>
        </div>
      </div>

      <!-- Sliders -->
      <div class="flex flex-col gap-3">
        <label class="flex flex-col gap-1.5 text-xs font-medium">
          Hue: {hue}
          <input type="range" min="0" max="360" bind:value={hue} class="hue-slider" />
        </label>

        <label class="flex flex-col gap-1.5 text-xs font-medium">
          Saturation: {saturation}%
          <input
            type="range"
            min="0"
            max="100"
            bind:value={saturation}
            style={saturationGradient}
          />
        </label>

        <label class="flex flex-col gap-1.5 text-xs font-medium">
          Lightness: {lightness}%
          <input type="range" min="0" max="100" bind:value={lightness} style={lightnessGradient} />
        </label>
      </div>
    </div>
  {/if}
</div>

<style>
  /* Custom slider styling that can't be easily done with Tailwind */
  input[type='range'] {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 6px;
    border-radius: 3px;
    outline: none;
    margin: 0;
  }

  /* Slider thumb */
  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #000000;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    transition: background 0.2s ease;
  }

  input[type='range']::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #000000;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    transition: background 0.2s ease;
  }

  /* Hue slider gradient */
  .hue-slider {
    background: linear-gradient(
      to right,
      #ff0000 0%,
      #ffff00 17%,
      #00ff00 33%,
      #00ffff 50%,
      #0000ff 67%,
      #ff00ff 83%,
      #ff0000 100%
    );
  }

  /* Dark mode support for slider thumb */
  :global(.dark) input[type='range']::-webkit-slider-thumb {
    background: #000000;
    border-color: #ffffff;
  }

  :global(.dark) input[type='range']::-moz-range-thumb {
    background: #000000;
    border-color: #ffffff;
  }

  /* Select styling */
  select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    background-size: 0.75em;
    padding-right: 2rem;
  }
</style>
