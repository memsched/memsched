<script lang="ts">
  import { HEADER_HEIGHT } from '$lib/constants';

  const { children } = $props();
</script>

<main
  class="mx-auto flex w-full max-w-screen-xl flex-grow flex-col px-6 py-8 lg:px-10 lg:py-14"
  style="margin-top: {HEADER_HEIGHT}px"
>
  {@render children()}
</main>
