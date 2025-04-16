<script lang="ts">
  import { cn } from '@memsched/ui/utils';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  import { HEADER_HEIGHT } from '$lib/constants';

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
    container && 'main-container py-8 lg:py-14',
    className
  )}
  style="margin-top: {HEADER_HEIGHT}px"
>
  {@render children()}
</main>
