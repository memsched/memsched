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
  import type { Snippet } from 'svelte';

  import { page } from '$app/state';

  import { Button } from '../ui/button';

  interface Props {
    name: string;
    href?: string;
    onclick?: () => void;
    active?: boolean;
    children?: Snippet;
  }

  const { name, href, active, onclick, children }: Props = $props();

  const isActive = $derived(active !== undefined ? active : page.url.pathname === href);
</script>

<Button
  {href}
  {onclick}
  variant="ghost"
  size="xs"
  class={cn(
    'rounded-none bg-background text-zinc-400 hover:bg-background hover:text-foreground',
    isActive &&
      'bg-zinc-100 text-foreground hover:bg-zinc-100 dark:bg-zinc-700/50 dark:hover:bg-zinc-700/50'
  )}
>
  {name}
  {@render children?.()}
</Button>
