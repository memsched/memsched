<script lang="ts">
  import { page } from '$app/state';
  import { cn } from '$lib/utils';
  import { Button } from '../ui/button';

  interface Props {
    name: string;
    href: string;
  }

  const { name, href }: Props = $props();
</script>

<Button
  {href}
  variant="secondary"
  class={cn(
    'h-auto bg-transparent px-3 py-1.5  hover:bg-secondary',
    page.url.pathname === href && 'bg-zinc-200/50'
  )}
>
  {name}
</Button>
