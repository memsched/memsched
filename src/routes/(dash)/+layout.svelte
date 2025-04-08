<script lang="ts">
  import DashLayout from '$lib/components/layouts/DashLayout.svelte';
  const { children } = $props();
</script>

<DashLayout>
  {@render children()}
</DashLayout>

<style>
  :global(body) {
    @apply h-full overflow-hidden;
  }
</style>
