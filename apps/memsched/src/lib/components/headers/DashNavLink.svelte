<script lang="ts">
  import { cn } from '@memsched/ui/utils';
  import type { IconType } from 'svelte-icons-pack';
  import { Icon } from 'svelte-icons-pack';

  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import * as Tooltip from '$lib/components/ui/tooltip';

  interface Props {
    href: string;
    icon: IconType;
    text: string;
  }

  const { href, icon, text }: Props = $props();
  const isActive = $derived.by(() => {
    if (href.length === 1) {
      return page.url.pathname === href;
    }
    return page.url.pathname.startsWith(href);
  });
</script>

<Tooltip.Provider delayDuration={300}>
  <Tooltip.Root>
    <Tooltip.Trigger class="px-1.5 py-3">
      {#snippet child({ props })}
        <a href={resolve(href as any)} aria-label={text} {...props}>
          <Icon
            src={icon}
            className={cn(
              '!text-zinc-400 dark:!text-zinc-500',
              isActive && '!text-black dark:!text-white'
            )}
            size={20}
          />
        </a>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Content
      side="right"
      align="center"
      class="bg-zinc-900 px-2 py-1 text-xs text-white shadow-none"
    >
      {text}
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
