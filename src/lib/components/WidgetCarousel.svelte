<script lang="ts">
  import Widget from './Widget.svelte';
  import type { WidgetJoinMetricsPreview } from '$lib/server/db/schema';

  interface Props {
    widgets: WidgetJoinMetricsPreview[];
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

<div class="relative w-full overflow-hidden">
  <div
    class="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-transparent to-zinc-700/25"
  ></div>
  <!-- Generate rows based on columns prop with alternating directions -->
  {#each widgetColumns as column}
    <div class="relative py-1 last-of-type:pb-6">
      <div
        class="animate-scroll-{column.direction} inline-flex flex-shrink-0 gap-4"
        style="animation-duration: {animationDuration}s; animation-timing-function: linear; animation-iteration-count: infinite;"
      >
        {#each column.widgets as widget, j (j)}
          <Widget {...widget} />
        {/each}
      </div>
    </div>
  {/each}
</div>

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
