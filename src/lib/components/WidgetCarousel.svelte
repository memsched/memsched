<script lang="ts">
  import { mode } from 'mode-watcher';
  import { fade } from 'svelte/transition';

  import { browser } from '$app/environment';
  import Widget from '$lib/components/widgets/Widget.svelte';
  import type { WidgetJoinMetricsData } from '$lib/server/services/metrics/types';

  interface Props {
    widgets: WidgetJoinMetricsData[];
    columns?: number;
  }

  const { widgets = [], columns = 4 }: Props = $props();

  // Define default animation duration (in seconds)
  const animationDuration = 60;

  // Distribute widgets across the requested number of columns
  const widgetsPerCol = $derived(Math.ceil(widgets.length / columns));

  // Create array of widget groups and their scroll directions
  const widgetColumns = $derived.by(() => {
    const cols = [];

    for (let i = 0; i < columns; i++) {
      const startIdx = i * widgetsPerCol;
      const endIdx = Math.min(startIdx + widgetsPerCol, widgets.length);
      const colWidgets = widgets.slice(startIdx, endIdx);

      // Triplicate for continuous scrolling
      const triplicatedWidgets = [...colWidgets, ...colWidgets, ...colWidgets];

      // Alternate scroll direction
      const direction = i % 2 === 0 ? 'left' : 'right';

      cols.push({
        widgets: triplicatedWidgets,
        direction,
      });
    }

    return cols;
  });
</script>

{#if browser}
  <div class="relative w-full overflow-hidden">
    <div
      class="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-transparent to-zinc-700/10 dark:to-zinc-700/25"
    ></div>
    <!-- Generate rows based on columns prop with alternating directions -->
    {#each widgetColumns as column, i}
      <div
        class="relative py-1 last-of-type:pb-6"
        in:fade|global={{ delay: i * 20, duration: 200 }}
      >
        <div
          class="animate-scroll-{column.direction} inline-flex flex-shrink-0 gap-4"
          style="animation-duration: {animationDuration}s; animation-timing-function: linear; animation-iteration-count: infinite;"
        >
          {#each column.widgets as widget, j (j)}
            <Widget {...widget} dark={$mode === 'dark'} />
          {/each}
        </div>
      </div>
    {/each}
  </div>
{/if}

<style>
  @keyframes scroll-left {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(
        -33.33%
      ); /* Move back 1/3 of the total length (since we have 3x duplicated content) */
    }
  }

  @keyframes scroll-right {
    0% {
      transform: translateX(-33.33%); /* Start from the left (showing 2nd set) */
    }
    100% {
      transform: translateX(0); /* Move to the right (showing 1st set) */
    }
  }

  .animate-scroll-left {
    animation-name: scroll-left;
  }

  .animate-scroll-right {
    animation-name: scroll-right;
  }
</style>
