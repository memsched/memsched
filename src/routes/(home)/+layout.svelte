<script lang="ts">
  import HomeHeader from '$lib/components/headers/HomeHeader.svelte';

  let { children } = $props();
</script>

<div class="flex h-screen w-screen flex-col">
  <HomeHeader />
  <main class="flex flex-grow items-center justify-center">
    {@render children()}
  </main>
</div>
