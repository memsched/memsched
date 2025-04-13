<script lang="ts">
  import { mode, toggleMode } from 'mode-watcher';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { slide } from 'svelte/transition';
  import { Icon } from 'svelte-icons-pack';
  import { IoMoon, IoSunny } from 'svelte-icons-pack/io';

  import { cn } from '$lib/utils';

  interface Props extends HTMLButtonAttributes {
    compact?: boolean;
  }

  const { compact = false, ...props }: Props = $props();
</script>

<button
  {...props}
  onclick={(e) => {
    e.preventDefault();
    toggleMode();
  }}
  class={cn(props.class, 'relative flex w-full min-w-[32px] items-center px-2 py-1.5')}
>
  {#if $mode === 'dark'}
    <div in:slide={{ duration: 200 }} out:slide={{ duration: 200 }} class="absolute left-[8px]">
      <Icon src={IoMoon} size={16} />
    </div>
  {:else}
    <div in:slide={{ duration: 200 }} out:slide={{ duration: 200 }} class="absolute left-[8px]">
      <Icon src={IoSunny} size={16} />
    </div>
  {/if}
  {#if !compact}
    <div class="ps-[24px] capitalize">{$mode}</div>
  {/if}
</button>
