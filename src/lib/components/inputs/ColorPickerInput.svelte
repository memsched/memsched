<script lang="ts">
  import { Icon } from 'svelte-icons-pack';
  import { Button } from '../ui/button';
  import { IoColorFillOutline, IoRefresh } from 'svelte-icons-pack/io';
  import { Input } from '../ui/input';
  import { cn, getRandomHexColor } from '$lib/utils';
  import * as Popover from '../ui/popover';
  import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';
  import type { WithElementRef } from 'bits-ui';

  type InputType = Exclude<HTMLInputTypeAttribute, 'file'>;

  type Props = WithElementRef<
    Omit<HTMLInputAttributes, 'type'> &
      ({ type: 'file'; files?: FileList } | { type?: InputType; files?: undefined })
  > & {
    solids?: string[];
  };

  const defaultSolids: string[] = [
    '#4fc59e',
    '#4fc1c5',
    '#4f8bce',
    '#9450ce',
    '#ce50a9',
    '#ce5050',
    '#ce864f',
  ];

  let {
    value = $bindable(),
    solids = defaultSolids,
    class: className = '',
    disabled = false,
    ...restProps
  }: Props = $props();

  function updateColor(e: Event) {
    const inputValue = (e.target as HTMLInputElement).value.toLowerCase();
    const hexPattern = /^#[0-9A-Fa-f]{6}$/;

    if (hexPattern.test(inputValue)) {
      value = inputValue;
    }
  }
</script>

<Popover.Root>
  <Popover.Trigger {disabled}>
    {#snippet child({ props })}
      <Button
        variant="outline"
        tabindex={0}
        class={cn(
          'w-full justify-start p-2 text-left font-normal',
          !value && 'text-muted-foreground',
          className
        )}
        {disabled}
        {...props}
      >
        {#if value}
          <div
            class="size-6 rounded border bg-cover bg-center transition-all"
            style="background-color: {value}"
          ></div>
        {:else}
          <Icon src={IoColorFillOutline} className="ml-1 size-6 !text-muted-foreground" />
        {/if}
        <span>{value ? value : 'Pick a color'}</span>
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-fit">
    <div class="flex gap-1">
      <Button
        class="h-6 w-6 cursor-pointer rounded-md p-0"
        variant="outline"
        onclick={() => {
          value = getRandomHexColor();
        }}
        {disabled}
      >
        <Icon src={IoRefresh} className="stroke-w-50" />
      </Button>
      {#each solids as s}
        <Button
          type="button"
          tabindex={0}
          variant="ghost"
          style="background: {s}"
          class="m-0 size-6 cursor-pointer rounded-md border p-0 active:scale-105"
          onclick={() => {
            value = s;
          }}
          {disabled}
        />
      {/each}
    </div>
    <Input
      class="mt-4"
      style="width: {(solids.length + 1) * 1.75}rem"
      id="custom"
      name="color"
      {value}
      onchange={updateColor}
      {disabled}
      {...restProps}
    />
  </Popover.Content>
</Popover.Root>
