<script lang="ts">
  import type { IconType } from 'svelte-icons-pack';
  import { Icon } from 'svelte-icons-pack';

  import { page } from '$app/state';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { cn } from '$lib/utils';

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
    <a {href}>
      <Tooltip.Trigger>
        <Icon src={icon} className={cn('!text-zinc-400', isActive && '!text-black')} size={20} />
      </Tooltip.Trigger>
    </a>
    <Tooltip.Content
      side="right"
      align="center"
      class="bg-zinc-900 px-2 py-1 text-xs text-white shadow-none"
    >
      {text}
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
