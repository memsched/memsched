<script lang="ts">
  import { cn } from '@memsched/ui/utils';
  import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: DropdownMenuPrimitive.SeparatorProps = $props();
</script>

<DropdownMenuPrimitive.Separator
  bind:ref
  class={cn('-mx-1 my-1 h-px bg-muted', className)}
  {...restProps}
/>
