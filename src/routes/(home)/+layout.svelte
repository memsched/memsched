<script lang="ts">
  import HomeHeader from '$lib/components/headers/HomeHeader.svelte';
  import HomeLayout from '$lib/components/layouts/HomeLayout.svelte';

  const { children } = $props();
</script>

<div class="flex h-screen w-screen flex-col">
  <HomeHeader />
  <HomeLayout>
    {@render children()}
  </HomeLayout>
</div>
