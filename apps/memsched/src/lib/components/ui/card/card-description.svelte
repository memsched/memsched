<script lang="ts">
  import { cn } from '@memsched/ui/utils';
  import type { WithElementRef } from 'bits-ui';
  import type { HTMLAttributes } from 'svelte/elements';

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLParagraphElement>> = $props();
</script>

<p bind:this={ref} class={cn('text-sm text-muted-foreground', className)} {...restProps}>
  {@render children?.()}
</p>
