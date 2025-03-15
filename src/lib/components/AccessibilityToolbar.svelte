<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount, onDestroy } from 'svelte';

  // Configuration
  const INITIAL_POSITION = { x: 20, y: 200 };

  // Types
  type Landmark = {
    role: string;
    label: string | null;
    element: string;
    count: number;
  };

  type HeadingElement = {
    level: number;
    text: string;
    id: string;
    depth: number;
    element: HTMLHeadingElement; // Store reference to the DOM element
  };

  type ContrastIssue = {
    element: HTMLElement;
    text: string;
    foregroundColor: string;
    backgroundColor: string;
    ratio: number;
    requiredRatio: number;
    isLargeText: boolean;
    passes: boolean;
  };

  // State
  let headingElements = $state<HeadingElement[]>([]);
  let landmarkElements = $state<Landmark[]>([]);
  let contrastIssues = $state<ContrastIssue[]>([]);
  let isDragging = $state(false);
  let position = $state(INITIAL_POSITION);
  let startPosition = $state({ x: 0, y: 0 });
  let startDragPosition = $state({ x: 0, y: 0 });
  let isCollapsed = $state(false);
  let activeTab = $state<'headings' | 'contrast' | 'landmarks'>('headings');
  let rescanInterval: ReturnType<typeof setInterval> | null = null;
  let isScanning = $state(false);

  // Generate a unique ID for elements that don't have one
  function generateTempId(prefix: string, index: number): string {
    return `a11y-toolbar-${prefix}-${index}`;
  }

  // List of temporary IDs we've added to the document
  let tempIds: string[] = [];

  // Functions to scan the page for accessibility issues
  function scanHeadings() {
    if (!browser) return;

    const headings = Array.from(
      document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    ) as HTMLHeadingElement[];

    // Reset headings array
    headingElements = [];

    // Previous level to track proper hierarchy
    let prevLevel = 0;
    let currentDepth = 0;

    // Clean up previous temporary IDs to avoid polluting the DOM
    tempIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el && el.hasAttribute('data-a11y-temp-id')) {
        el.removeAttribute('id');
        el.removeAttribute('data-a11y-temp-id');
      }
    });

    tempIds = [];

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.substring(1));
      const text = heading.textContent?.trim() || '[Empty heading]';
      let id = heading.id;

      // If the heading doesn't have an ID, assign a temporary one
      if (!id) {
        id = generateTempId('heading', index);
        heading.id = id;
        heading.setAttribute('data-a11y-temp-id', 'true');
        tempIds.push(id);
      }

      // Calculate visual depth for indentation
      // If heading level increases by more than 1, it's an error in hierarchy
      if (level > prevLevel) {
        // Only increase depth by 1 even if level jumps by more
        currentDepth += 1;
      } else if (level < prevLevel) {
        // Decrease depth accordingly
        currentDepth = Math.max(0, currentDepth - (prevLevel - level));
      }

      prevLevel = level;

      headingElements = [
        ...headingElements,
        {
          level,
          text,
          id,
          depth: currentDepth,
          element: heading,
        },
      ];
    });
  }

  function scanLandmarks() {
    if (!browser) return;

    // Reset landmarks array
    landmarkElements = [];

    // Common ARIA landmarks and their HTML element equivalents
    const landmarks = [
      { role: 'banner', elements: ['header[role="banner"]', 'body > header:not([role])'] },
      { role: 'navigation', elements: ['nav', '[role="navigation"]'] },
      { role: 'main', elements: ['main', '[role="main"]'] },
      { role: 'complementary', elements: ['aside', '[role="complementary"]'] },
      {
        role: 'contentinfo',
        elements: ['footer[role="contentinfo"]', 'body > footer:not([role])'],
      },
      { role: 'search', elements: ['[role="search"]'] },
      { role: 'form', elements: ['form[aria-labelledby], form[aria-label]', '[role="form"]'] },
      {
        role: 'region',
        elements: [
          'section[aria-labelledby], section[aria-label]',
          '[role="region"][aria-labelledby], [role="region"][aria-label]',
        ],
      },
    ];

    // Track unique roles to detect duplicates
    const roleCounts: Record<string, number> = {};

    // Process each landmark type
    landmarks.forEach((landmark) => {
      const selector = landmark.elements.join(', ');
      const elements = document.querySelectorAll(selector);

      if (elements.length > 0) {
        // Increment the count for this role
        roleCounts[landmark.role] = (roleCounts[landmark.role] || 0) + elements.length;

        // Process each element
        elements.forEach((el) => {
          const ariaLabel = el.getAttribute('aria-label');
          const labelledBy = el.getAttribute('aria-labelledby');
          let label = null;

          if (ariaLabel) {
            label = ariaLabel;
          } else if (labelledBy) {
            const labelElement = document.getElementById(labelledBy);
            if (labelElement) {
              label = labelElement.textContent?.trim() || null;
            }
          }

          // Add to landmarks array if not already there
          const existingLandmark = landmarkElements.find(
            (l) => l.role === landmark.role && l.label === label
          );

          if (!existingLandmark) {
            landmarkElements = [
              ...landmarkElements,
              {
                role: landmark.role,
                label: label,
                element: el.tagName.toLowerCase(),
                count: 1,
              },
            ];
          } else {
            // Update the count if the landmark already exists
            existingLandmark.count++;
          }
        });
      }
    });
  }

  // Contrast checking functions
  function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    // Remove the hash if it exists
    hex = hex.replace(/^#/, '');

    // Parse RGB components
    const bigint = parseInt(hex, 16);

    // Handle different hex formats (3, 6, or 8 digits)
    if (hex.length === 3) {
      const r = ((bigint >> 8) & 15) * 17;
      const g = ((bigint >> 4) & 15) * 17;
      const b = (bigint & 15) * 17;
      return { r, g, b };
    } else if (hex.length === 6 || hex.length === 8) {
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return { r, g, b };
    }

    return null;
  }

  function getRgbFromColor(color: string): { r: number; g: number; b: number } | null {
    if (!color) return null;

    // Handle hex values
    if (color.startsWith('#')) {
      return hexToRgb(color);
    }

    // Handle RGB / RGBA
    if (color.startsWith('rgb')) {
      const rgbRegex = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/i;
      const match = color.match(rgbRegex);
      if (match) {
        return {
          r: parseInt(match[1], 10),
          g: parseInt(match[2], 10),
          b: parseInt(match[3], 10),
        };
      }
    }

    // Handle named colors by creating a temporary element
    if (browser) {
      const tempEl = document.createElement('div');
      tempEl.style.color = color;
      document.body.appendChild(tempEl);
      const computedColor = getComputedStyle(tempEl).color;
      document.body.removeChild(tempEl);

      // Recursive call with computed color (should be rgb)
      return getRgbFromColor(computedColor);
    }

    return null;
  }

  function getLuminance(color: { r: number; g: number; b: number }): number {
    // Convert RGB to luminance following the WCAG formula
    const { r, g, b } = color;

    const [rSRGB, gSRGB, bSRGB] = [r / 255, g / 255, b / 255].map((val) => {
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rSRGB + 0.7152 * gSRGB + 0.0722 * bSRGB;
  }

  function getContrastRatio(
    fg: { r: number; g: number; b: number },
    bg: { r: number; g: number; b: number }
  ): number {
    const fgLuminance = getLuminance(fg);
    const bgLuminance = getLuminance(bg);

    // Formula: (lighter + 0.05) / (darker + 0.05)
    const lighter = Math.max(fgLuminance, bgLuminance);
    const darker = Math.min(fgLuminance, bgLuminance);

    return (lighter + 0.05) / (darker + 0.05);
  }

  function isLargeText(element: HTMLElement): boolean {
    if (!browser) return false;

    const computedStyle = getComputedStyle(element);
    const fontSize = parseFloat(computedStyle.fontSize);
    const fontWeight = computedStyle.fontWeight;

    // Large text is defined as 18pt (24px) or 14pt (18.67px) and bold
    return fontSize >= 24 || (fontSize >= 18.67 && parseInt(fontWeight, 10) >= 700);
  }

  async function scanContrast() {
    if (!browser) return;

    isScanning = true;
    contrastIssues = [];

    try {
      // Select all visible text elements
      const textSelectors = [
        'p',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'a',
        'button',
        'label',
        'li',
        'td',
        'th',
        'span',
        'div',
        'figcaption',
      ];

      const elements = Array.from(
        document.querySelectorAll(textSelectors.join(','))
      ) as HTMLElement[];

      // Process elements in batches to avoid long-running script warnings
      const batchSize = 50;

      for (let i = 0; i < elements.length; i += batchSize) {
        const batch = elements.slice(i, i + batchSize);

        // Use a promise to allow UI updates between batches
        await new Promise<void>((resolve) => {
          setTimeout(() => {
            batch.forEach((element) => {
              // Skip elements with no visible text or elements that are not visible
              const text = element.textContent?.trim() || '';
              const computedStyle = getComputedStyle(element);

              if (
                text === '' ||
                computedStyle.display === 'none' ||
                computedStyle.visibility === 'hidden' ||
                computedStyle.opacity === '0'
              ) {
                return;
              }

              // Get text and background colors
              const foregroundColor = computedStyle.color;
              const backgroundColor = getEffectiveBackgroundColor(element);

              // Parse colors
              const fg = getRgbFromColor(foregroundColor);
              const bg = getRgbFromColor(backgroundColor);

              if (!fg || !bg) return;

              const largeText = isLargeText(element);
              const requiredRatio = largeText ? 3 : 4.5;
              const ratio = getContrastRatio(fg, bg);
              const passes = ratio >= requiredRatio;

              // If it fails, add to issues list
              if (!passes) {
                contrastIssues = [
                  ...contrastIssues,
                  {
                    element,
                    text: text.length > 30 ? text.substring(0, 30) + '...' : text,
                    foregroundColor,
                    backgroundColor,
                    ratio,
                    requiredRatio,
                    isLargeText: largeText,
                    passes,
                  },
                ];
              }
            });
            resolve();
          }, 0);
        });
      }

      // Sort issues by contrast ratio (worst first)
      contrastIssues = contrastIssues.sort((a, b) => a.ratio - b.ratio);
    } catch (error) {
      console.error('Error scanning for contrast issues:', error);
    } finally {
      isScanning = false;
    }
  }

  function getEffectiveBackgroundColor(element: HTMLElement): string {
    if (!browser) return '';

    // If there's no parent, return the document background color
    if (!element.parentElement) {
      return getComputedStyle(document.body).backgroundColor;
    }

    // Get computed style of the element
    const computedStyle = getComputedStyle(element);

    // If element has a backgroundColor that is not transparent, use that
    if (
      computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
      computedStyle.backgroundColor !== 'transparent'
    ) {
      return computedStyle.backgroundColor;
    }

    // Otherwise, get the background color from the parent
    return getEffectiveBackgroundColor(element.parentElement);
  }

  function scrollToElement(element: HTMLElement) {
    if (!browser) return;

    element.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Highlight the element temporarily
    const originalOutline = element.style.outline;
    const originalBackground = element.style.backgroundColor;
    const originalTransition = element.style.transition;

    element.style.transition = 'all 0.3s ease';
    element.style.outline = '2px solid rgba(255, 0, 0, 0.8)';
    element.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';

    setTimeout(() => {
      element.style.outline = originalOutline;
      element.style.backgroundColor = originalBackground;
      element.style.transition = originalTransition;
    }, 1500);
  }

  function formatContrastRatio(ratio: number): string {
    return ratio.toFixed(2) + ':1';
  }

  function scrollToHeading(headingData: HeadingElement) {
    if (!browser) return;

    const element = headingData.element;
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Highlight the element temporarily
      const originalOutline = element.style.outline;
      const originalBackground = element.style.backgroundColor;
      const originalTransition = element.style.transition;

      element.style.transition = 'all 0.3s ease';
      element.style.backgroundColor = 'rgba(255, 215, 0, 0.3)';
      element.style.outline = '2px solid rgba(255, 165, 0, 0.8)';

      setTimeout(() => {
        element.style.backgroundColor = originalBackground;
        element.style.outline = originalOutline;
        element.style.transition = originalTransition;
      }, 1500);
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

  function handleTabChange(tab: 'headings' | 'contrast' | 'landmarks') {
    activeTab = tab;

    // Rescan when changing tabs
    if (tab === 'headings') {
      scanHeadings();
    } else if (tab === 'landmarks') {
      scanLandmarks();
    } else if (tab === 'contrast') {
      scanContrast();
    }
  }

  // Initialize and set up listeners
  onMount(() => {
    if (!browser) return;

    // Initial scan
    scanHeadings();

    // Set up interval to rescan the page for changes
    rescanInterval = setInterval(() => {
      if (activeTab === 'headings') {
        scanHeadings();
      } else if (activeTab === 'landmarks') {
        scanLandmarks();
      }
    }, 2000); // Rescan every 2 seconds

    // Listen for DOM changes that might affect headings
    const observer = new MutationObserver(() => {
      if (activeTab === 'headings') {
        scanHeadings();
      } else if (activeTab === 'landmarks') {
        scanLandmarks();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  });

  onDestroy(() => {
    if (rescanInterval) {
      clearInterval(rescanInterval);
    }

    // Clean up any temporary IDs we added
    if (browser) {
      tempIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.hasAttribute('data-a11y-temp-id')) {
          el.removeAttribute('id');
          el.removeAttribute('data-a11y-temp-id');
        }
      });
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
  >
    <span class="text-sm font-semibold">Accessibility Toolbar</span>
    <div class="flex items-center gap-1">
      <button
        class="flex h-5 w-5 cursor-pointer items-center justify-center rounded border-none bg-transparent text-xs hover:bg-muted-foreground/10"
        onclick={() => {
          if (activeTab === 'headings') scanHeadings();
          else if (activeTab === 'landmarks') scanLandmarks();
          else if (activeTab === 'contrast') scanContrast();
        }}
        title="Rescan page"
      >
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
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
          <path d="M16 21h5v-5" />
        </svg>
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
      <!-- Tabs -->
      <div class="mb-3 flex border-b border-border">
        <button
          class="flex-1 border-b-2 px-2 py-1 text-xs transition-colors"
          class:border-primary={activeTab === 'headings'}
          class:border-transparent={activeTab !== 'headings'}
          class:font-semibold={activeTab === 'headings'}
          onclick={() => handleTabChange('headings')}
        >
          Headings
        </button>
        <button
          class="flex-1 border-b-2 px-2 py-1 text-xs transition-colors"
          class:border-primary={activeTab === 'landmarks'}
          class:border-transparent={activeTab !== 'landmarks'}
          class:font-semibold={activeTab === 'landmarks'}
          onclick={() => handleTabChange('landmarks')}
        >
          Landmarks
        </button>
        <button
          class="flex-1 border-b-2 px-2 py-1 text-xs transition-colors"
          class:border-primary={activeTab === 'contrast'}
          class:border-transparent={activeTab !== 'contrast'}
          class:font-semibold={activeTab === 'contrast'}
          onclick={() => handleTabChange('contrast')}
        >
          Contrast
        </button>
      </div>

      <!-- Headings Tab -->
      {#if activeTab === 'headings'}
        <div class="mb-2 text-xs font-semibold">Heading Hierarchy:</div>

        {#if headingElements.length === 0}
          <div class="py-2 text-xs text-muted-foreground">No headings detected on this page.</div>
        {:else}
          <div class="max-h-[300px] overflow-y-auto">
            {#each headingElements as heading, index}
              {@const prevHeading = index > 0 ? headingElements[index - 1] : null}
              <div
                class="mb-1 flex cursor-pointer items-start rounded px-1 py-0.5 text-xs hover:bg-muted/50"
                class:text-destructive={prevHeading &&
                  heading.level > prevHeading.level &&
                  heading.level - prevHeading.level > 1}
                style="padding-left: {heading.depth * 12 + 4}px;"
                onclick={() => scrollToHeading(heading)}
                title="Click to scroll to this heading"
              >
                <div class="mr-1 font-mono text-primary">H{heading.level}</div>
                <div class="truncate">{heading.text}</div>
              </div>
            {/each}
          </div>

          <!-- Heading Stats -->
          <div class="mt-3 rounded border border-border bg-muted/30 p-2 text-[10px]">
            <div class="font-medium">Heading Statistics:</div>
            {#each [1, 2, 3, 4, 5, 6] as level}
              {@const count = headingElements.filter((h) => h.level === level).length}
              <div class="flex justify-between">
                <span>H{level}:</span>
                <span>{count}</span>
              </div>
            {/each}
          </div>
        {/if}
      {/if}

      <!-- Landmarks Tab -->
      {#if activeTab === 'landmarks'}
        <div class="mb-2 text-xs font-semibold">ARIA Landmarks:</div>

        {#if landmarkElements.length === 0}
          <div class="py-2 text-xs text-muted-foreground">
            No ARIA landmarks detected on this page.
            <button class="mt-1 text-primary underline" onclick={() => scanLandmarks()}>
              Scan for landmarks
            </button>
          </div>
        {:else}
          <div class="max-h-[300px] overflow-y-auto">
            {#each landmarkElements as landmark}
              <div class="mb-2 rounded border border-border p-1.5 text-xs">
                <div class="flex justify-between">
                  <span class="font-medium">{landmark.role}</span>
                  {#if landmark.count > 1}
                    <span
                      class="rounded bg-amber-100 px-1 text-amber-800 dark:bg-amber-800 dark:text-amber-100"
                      >×{landmark.count}</span
                    >
                  {/if}
                </div>
                {#if landmark.label}
                  <div class="mt-0.5 text-[10px]">Label: {landmark.label}</div>
                {/if}
                <div class="mt-0.5 text-[10px] text-muted-foreground">
                  Element: &lt;{landmark.element}&gt;
                </div>
              </div>
            {/each}
          </div>

          <!-- Missing Landmarks Warning -->
          {@const hasMain = landmarkElements.some((l) => l.role === 'main')}
          {@const hasNav = landmarkElements.some((l) => l.role === 'navigation')}

          {#if !hasMain || !hasNav}
            <div
              class="mt-3 rounded border border-destructive bg-destructive/10 p-2 text-[10px] text-destructive"
            >
              <div class="font-medium">Missing recommended landmarks:</div>
              {#if !hasMain}
                <div>• main: Primary content area</div>
              {/if}
              {#if !hasNav}
                <div>• navigation: Navigation links</div>
              {/if}
            </div>
          {/if}
        {/if}
      {/if}

      <!-- Contrast Tab -->
      {#if activeTab === 'contrast'}
        <div class="mb-2 text-xs font-semibold">Color Contrast:</div>

        {#if isScanning}
          <div class="py-4 text-center text-xs">
            <div class="mb-2">Scanning page for contrast issues...</div>
            <div class="h-1 w-full overflow-hidden rounded-full bg-muted">
              <div class="h-full animate-pulse rounded-full bg-primary"></div>
            </div>
          </div>
        {:else if contrastIssues.length === 0}
          <div class="py-2 text-xs text-muted-foreground">
            No contrast issues detected.
            <button class="mt-1 text-primary underline" onclick={() => scanContrast()}>
              Scan for contrast issues
            </button>
          </div>
        {:else}
          <div class="mb-2 text-xs">
            Found {contrastIssues.length} elements with insufficient contrast.
            <button class="ml-1 text-primary underline" onclick={() => scanContrast()}>
              Rescan
            </button>
          </div>

          <div class="max-h-[300px] overflow-y-auto">
            {#each contrastIssues as issue}
              <div
                class="mb-2 cursor-pointer rounded border border-border p-2 text-xs hover:bg-muted/50"
                onclick={() => scrollToElement(issue.element)}
              >
                <div class="mb-1 truncate font-medium">{issue.text}</div>

                <div class="mb-1 flex gap-1">
                  <!-- Color swatches -->
                  <span
                    class="h-4 w-4 rounded border border-border"
                    style="background-color: {issue.foregroundColor};"
                    title="Text color: {issue.foregroundColor}"
                  ></span>
                  <span
                    class="h-4 w-4 rounded border border-border"
                    style="background-color: {issue.backgroundColor};"
                    title="Background color: {issue.backgroundColor}"
                  ></span>

                  <!-- Contrast ratio -->
                  <span class="flex-1 text-right">
                    <span
                      class="rounded px-1.5 py-0.5 text-[10px]"
                      class:bg-red-100={issue.ratio < issue.requiredRatio}
                      class:text-red-800={issue.ratio < issue.requiredRatio}
                      class:dark:bg-red-950={issue.ratio < issue.requiredRatio}
                      class:dark:text-red-300={issue.ratio < issue.requiredRatio}
                    >
                      {formatContrastRatio(issue.ratio)}
                    </span>
                  </span>
                </div>

                <div class="text-[10px] text-muted-foreground">
                  Required: {formatContrastRatio(issue.requiredRatio)} ({issue.isLargeText
                    ? 'Large'
                    : 'Normal'} text)
                </div>
              </div>
            {/each}
          </div>

          <!-- WCAG Guidelines -->
          <div class="mt-3 rounded border border-border bg-muted/30 p-2 text-[10px]">
            <div class="font-medium">WCAG Guidelines:</div>
            <div class="mt-1">• Normal text: minimum ratio of 4.5:1</div>
            <div>• Large text: minimum ratio of 3:1</div>
            <div class="mt-1 text-muted-foreground">
              Large text is 18pt (24px) or 14pt (18.67px) if bold
            </div>
          </div>
        {/if}
      {/if}
    </div>
  {/if}
</div>

<style>
  /* Custom scrollbar */
  :global(.dark) div {
    scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
  }

  div {
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
  }

  div::-webkit-scrollbar {
    width: 6px;
  }

  div::-webkit-scrollbar-track {
    background: transparent;
  }

  div::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }

  :global(.dark) div::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
  }

  /* Animation */
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .animate-pulse {
    animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
</style>
