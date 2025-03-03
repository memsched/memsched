<script lang="ts">
  import HomeHeader from '$lib/components/headers/HomeHeader.svelte';

  const { children } = $props();
</script>

<div class="flex h-screen w-screen flex-col">
  <HomeHeader />
  {@render children()}
</div>
