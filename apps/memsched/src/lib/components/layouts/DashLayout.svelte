<script lang="ts">
  import type { Snippet } from 'svelte';

  import DashNav from '../headers/DashNav.svelte';

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();
</script>

<div class="flex h-screen w-screen">
  <DashNav />
  <main class="flex flex-grow flex-col overflow-hidden">
    {@render children()}
  </main>
</div>
