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
