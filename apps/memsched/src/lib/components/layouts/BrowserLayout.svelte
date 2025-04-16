<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();
</script>

<div class="max-w-full overflow-hidden rounded-xl border bg-white shadow-xl">
  <!-- Browser chrome -->
  <div class="flex items-center border-b bg-secondary px-4 py-3">
    <div class="mr-6 flex gap-1.5">
      <div class="h-3 w-3 rounded-full bg-red-400"></div>
      <div class="h-3 w-3 rounded-full bg-yellow-400"></div>
      <div class="h-3 w-3 rounded-full bg-green-400"></div>
    </div>
    <div class="w-24"></div>
  </div>

  <!-- Browser content -->
  <div class="bg-background">
    {@render children()}
  </div>
</div>
