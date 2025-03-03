<script lang="ts">
  import HomeHeader from '$lib/components/headers/HomeHeader.svelte';

  let { children } = $props();
</script>

<div class="flex h-screen w-screen flex-col">
  <HomeHeader />
  {@render children()}
</div>
