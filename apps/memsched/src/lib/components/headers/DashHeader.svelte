<script lang="ts">
  import type { Snippet } from 'svelte';

  import { SUB_NAV_HEIGHT } from '$lib/constants';

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();
</script>

<div
  class="bg-background sticky top-0 z-40 flex flex-shrink-0 items-center border-b"
  style="height: {SUB_NAV_HEIGHT}px;"
>
  <div class="flex items-center">
    {@render children()}
  </div>
</div>
