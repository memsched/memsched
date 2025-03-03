<script lang="ts">
  import HomeHeader from '$lib/components/headers/HomeHeader.svelte';

  let { children } = $props();
</script>

<div class="flex h-screen w-screen flex-col">
  <HomeHeader />
  <main class="mx-auto flex w-full max-w-screen-xl flex-grow flex-col px-6 py-8 lg:px-10 lg:py-14">
    {@render children()}
  </main>
</div>
