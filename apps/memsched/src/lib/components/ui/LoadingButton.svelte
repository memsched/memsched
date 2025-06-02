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
  import { Icon, type IconType } from 'svelte-icons-pack';
  import { TrOutlineLoader2 } from 'svelte-icons-pack/tr';

  import { Button, type ButtonProps } from './button';

  interface Props extends ButtonProps {
    loading?: boolean;
    delay?: number;
    icon?: IconType;
  }

  let {
    loading = false,
    delay = 50,
    icon,
    children,
    class: className,
    ...restProps
  }: Props = $props();

  let loadingWithDelay = $state(false);

  $effect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        loadingWithDelay = true;
      }, delay);

      return () => clearTimeout(timer);
    } else {
      loadingWithDelay = false;
    }
  });
</script>

<Button disabled={loadingWithDelay} class={cn('gap-3', className)} {...restProps}>
  {@render children?.()}
  {#if loadingWithDelay}
    <Icon src={TrOutlineLoader2} className="animate-spin text-gray-300" />
  {:else if icon}
    <Icon src={icon} />
  {/if}
</Button>
