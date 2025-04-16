<script lang="ts">
  import { expoOut } from 'svelte/easing';
  import { slide } from 'svelte/transition';

  import { navigating } from '$app/state';
</script>

{#if navigating.to}
  <div
    class="fixed left-0 top-0 z-50 h-[3px] w-full bg-primary"
    in:slide={{ delay: 100, duration: 12000, axis: 'x', easing: expoOut }}
  ></div>
{/if}
