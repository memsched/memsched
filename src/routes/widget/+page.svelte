<script lang="ts">
  import type { PageProps } from './$types';
  import Widget from '$lib/components/Widget.svelte';

  let { data }: PageProps = $props();
</script>

<main>
  <Widget
    title="Pages Read"
    subtitle="Understanding Deep Learning"
    metrics={[
      {
        value: 94,
        description: 'today',
      },
      {
        value: 94,
        description: 'today',
      },
    ]}
  />
  <div class="svg-container" contenteditable bind:innerHTML={data.svgContent}></div>
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

  .svg-container {
    display: inline-block;
    resize: both;
    overflow: auto;
  }
</style>
