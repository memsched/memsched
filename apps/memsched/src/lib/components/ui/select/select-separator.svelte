<script lang="ts">
  import { cn } from '@memsched/ui/utils';
  import type { Separator as SeparatorPrimitive } from 'bits-ui';

  import { Separator } from '$lib/components/ui/separator/index.js';

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: SeparatorPrimitive.RootProps = $props();
</script>

<Separator bind:ref class={cn('bg-muted -mx-1 my-1 h-px', className)} {...restProps} />
