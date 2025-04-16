<script lang="ts">
  import HomeFooter from '$lib/components/footers/HomeFooter.svelte';
  import HomeHeader from '$lib/components/headers/HomeHeader.svelte';

  const { children } = $props();
</script>

<div class="flex h-screen w-screen flex-col overflow-x-hidden">
  <HomeHeader />
  {@render children()}
  <HomeFooter />
</div>
