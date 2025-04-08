<script lang="ts">
  import type { Snippet } from 'svelte';

  import AuthHeader from '../headers/AuthHeader.svelte';

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();
</script>

<div class="flex h-screen w-screen flex-col">
  <AuthHeader />
  <main class="flex flex-grow items-center justify-center">
    {@render children()}
  </main>
</div>
