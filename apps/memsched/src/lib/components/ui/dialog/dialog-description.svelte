<script lang="ts">
  import { cn } from '@memsched/ui/utils';
  import { Dialog as DialogPrimitive } from 'bits-ui';

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: DialogPrimitive.DescriptionProps = $props();
</script>

<DialogPrimitive.Description
  bind:ref
  class={cn('text-sm text-muted-foreground', className)}
  {...restProps}
/>
