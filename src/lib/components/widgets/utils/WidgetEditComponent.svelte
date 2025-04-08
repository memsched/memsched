<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Icon } from 'svelte-icons-pack';
  import { FiX } from 'svelte-icons-pack/fi';

  import * as Tooltip from '$lib/components/ui/tooltip';

  interface Props {
    onclick: (() => void) | undefined;
    onclose?: (e: MouseEvent) => void;
    width: string;
    height: string;
    label: string;
    value: any;
    children: Snippet;
  }

  const { width, height, label, value, children, onclick, onclose }: Props = $props();
</script>

{#if onclick !== undefined}
  <Tooltip.Provider delayDuration={0} disableHoverableContent>
    <Tooltip.Root>
      <Tooltip.Trigger>
        {#snippet child({ props })}
          <div class="group relative">
            <button
              {...props}
              {onclick}
              aria-label="Edit"
              type="button"
              class="block"
              style={!value ? `width: ${width}; height: ${height};` : ''}
            >
              {#if value === undefined || value === null || value === ''}
                <div class="h-full w-full rounded-sm bg-zinc-200"></div>
              {:else if children}
                {@render children()}
              {/if}
            </button>
            {#if onclose}
              <button
                class="absolute -right-1.5 -top-1.5 flex size-[15px] items-center justify-center rounded-full border bg-background text-muted-foreground opacity-0 transition-colors hover:border-foreground hover:text-foreground group-hover:opacity-100"
                aria-label="Close"
                type="button"
                onclick={onclose}
              >
                <Icon src={FiX} size={10} />
              </button>
            {/if}
          </div>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Content
        side="right"
        align="center"
        class="bg-zinc-900 px-2 py-1 text-xs text-white shadow-none"
      >
        {label}
      </Tooltip.Content>
    </Tooltip.Root>
  </Tooltip.Provider>
{:else}
  {@render children()}
{/if}
