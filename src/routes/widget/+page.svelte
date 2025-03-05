<script lang="ts">
  import type { PageProps } from './$types';
  import Widget from '$lib/components/Widget.svelte';

  const { data }: PageProps = $props();
</script>

<main>
  <Widget
    title="Pages Read"
    subtitle="Understanding Deep Learning"
    metrics={[
      {
        value: 94,
        name: 'today',
      },
      {
        value: 94,
        name: 'today',
      },
    ]}
  />
  <img src="/api/widgets?svg" alt="" class="h-[97px]" />
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2rem;
    align-items: center;
    height: 100vh;
  }
</style>
