<script lang="ts">
  import type { IconType } from 'svelte-icons-pack';
  import IconButton from '../ui/IconButton.svelte';
  import { page } from '$app/state';
  import { cn } from '$lib/utils';

  interface Props {
    href: string;
    text: string;
    icon: IconType;
  }

  const { href, text, icon }: Props = $props();
</script>

<IconButton
  {icon}
  variant="link"
  size="lg"
  iconPosition="left"
  {href}
  class={cn(
    'relative px-1 text-muted-foreground after:absolute after:bottom-[-9px] after:left-1 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-200 hover:no-underline hover:after:scale-x-100',
    page.url.pathname === href ? 'text-black after:scale-x-100' : ''
  )}
>
  {text}
</IconButton>
