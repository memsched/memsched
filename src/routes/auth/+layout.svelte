<script lang="ts">
  import AuthHeader from '$lib/components/headers/AuthHeader.svelte';

  const { children } = $props();
</script>

<div class="flex h-screen w-screen flex-col">
  <AuthHeader />
  <main class="flex flex-grow items-center justify-center">
    {@render children()}
  </main>
</div>
