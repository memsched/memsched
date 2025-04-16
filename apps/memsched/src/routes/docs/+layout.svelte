<script lang="ts">
  import type { Snippet } from 'svelte';

  import DocsLayout from '$lib/components/layouts/DocsLayout.svelte';

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();
</script>

<DocsLayout>
  {@render children()}
</DocsLayout>
