<script lang="ts">
  import { cn } from '@memsched/ui/utils';
  import { RadioGroup as RadioGroupPrimitive, type WithoutChildrenOrChild } from 'bits-ui';
  import Circle from 'lucide-svelte/icons/circle';

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: WithoutChildrenOrChild<RadioGroupPrimitive.ItemProps> = $props();
</script>

<RadioGroupPrimitive.Item
  bind:ref
  class={cn(
    'aspect-square size-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    className
  )}
  {...restProps}
>
  {#snippet children({ checked })}
    <div class="flex items-center justify-center">
      {#if checked}
        <Circle class="size-2.5 fill-current text-current" />
      {/if}
    </div>
  {/snippet}
</RadioGroupPrimitive.Item>
