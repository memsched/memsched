<script lang="ts">
  import { FiArrowUpRight } from 'svelte-icons-pack/fi';

  import IconButton from '../ui/IconButton.svelte';

  interface Props {
    href: string;
    text: string;
  }

  const { href, text }: Props = $props();
  // const isActive = $derived.by(() => {
  //   if (href.length === 1) {
  //     return page.url.pathname === href;
  //   }
  //   return page.url.pathname.startsWith(href);
  // });
</script>

<!-- <IconButton
  {icon}
  variant="link"
  size="lg"
  iconPosition="left"
  {href}
  class={cn(
    'relative px-1 text-muted-foreground after:absolute after:bottom-[-1px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-200 hover:no-underline hover:after:scale-x-100 max-md:px-3',
    isActive && 'text-primary after:scale-x-100'
  )}
  childrenClass="max-md:hidden"
>
    {text}
  </IconButton> -->
<IconButton
  icon={FiArrowUpRight}
  variant="link"
  {href}
  class="text-muted-foreground px-1 [&_svg]:size-3.5"
>
  {text}
</IconButton>
