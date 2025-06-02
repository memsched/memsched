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
  class="px-1 text-muted-foreground [&_svg]:size-3.5"
>
  {text}
</IconButton>
