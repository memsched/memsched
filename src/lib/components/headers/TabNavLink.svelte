<script lang="ts">
  import { page } from '$app/state';
  import { cn } from '$lib/utils';
  import { Button } from '../ui/button';
  import type { Page } from '@sveltejs/kit';

  interface Props {
    name: string;
    href: string;
    isActive?: (page: Page) => boolean;
  }

  const { name, href, isActive }: Props = $props();

  // Determine if the tab is active using the custom callback or default pathname matching
  function isTabActive() {
    return isActive ? isActive(page) : page.url.pathname === href;
  }
</script>

<Button
  {href}
  variant="secondary"
  class={cn(
    'h-auto bg-transparent px-3 py-1.5  hover:bg-secondary',
    isTabActive() && 'bg-zinc-200/50'
  )}
>
  {name}
</Button>
