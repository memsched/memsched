<script lang="ts">
  import type { PageProps } from './$types';
  import Widget from '$lib/components/Widget.svelte';

  let { data }: PageProps = $props();
</script>

<main>
  <div class="container">
    <Widget title="Pages Read" subtitle="Understanding Deep Learning" />
    <div class="svg-container" contenteditable bind:innerHTML={data.svgContent}></div>
  </div>
</main>

<style>
  main {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  .container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .svg-container {
    display: block;
    resize: both;
    overflow: auto;
  }
</style>
