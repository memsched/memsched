<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { HEADER_HEIGHT } from '$lib/constants';
  import { cn } from '$lib/utils';

  interface Props {
    class?: HTMLAttributes<HTMLElement>['class'];
    container?: boolean;
    children: Snippet;
  }

  const { class: className, container = true, children }: Props = $props();
</script>

<main
  class={cn(
    'flex w-full flex-grow flex-col',
    container && 'mx-auto max-w-screen-xl px-6 py-8 lg:px-10 lg:py-14',
    className
  )}
  style="margin-top: {HEADER_HEIGHT}px"
>
  {@render children()}
</main>
