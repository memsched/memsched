<script lang="ts">
  import { cn } from '@memsched/ui/utils';
  import type { WithoutChild } from 'bits-ui';
  import * as FormPrimitive from 'formsnap';

  import { Label } from '$lib/components/ui/label/index.js';

  let {
    ref = $bindable(null),
    children,
    class: className,
    ...restProps
  }: WithoutChild<FormPrimitive.LabelProps> = $props();
</script>

<FormPrimitive.Label {...restProps} bind:ref>
  {#snippet child({ props })}
    <Label {...props} class={cn('data-[fs-error]:text-destructive', className)}>
      {@render children?.()}
    </Label>
  {/snippet}
</FormPrimitive.Label>
