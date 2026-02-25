<script lang="ts">
  import { cn } from '@memsched/ui/utils';
  import { Dialog as DialogPrimitive } from 'bits-ui';

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: DialogPrimitive.TitleProps = $props();
</script>

<DialogPrimitive.Title
  bind:ref
  class={cn('text-lg leading-none font-semibold tracking-tight', className)}
  {...restProps}
/>
