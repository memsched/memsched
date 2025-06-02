<!--
MEMsched - A memory scheduling and objective tracking application.
Copyright (C) 2025 Leonard Cseres

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
-->
<script lang="ts">
  import { cn } from '@memsched/ui/utils';
  import type { IconType } from 'svelte-icons-pack';
  import { Icon } from 'svelte-icons-pack';

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
        <a {href} aria-label={text} {...props}>
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
