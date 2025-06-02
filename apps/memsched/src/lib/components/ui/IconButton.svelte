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
  import type { HTMLAttributes } from 'svelte/elements';
  import { Icon, type IconType } from 'svelte-icons-pack';

  import { Button, type ButtonProps } from './button';

  interface Props extends ButtonProps {
    icon: IconType;
    children?: Snippet;
    childrenClass?: HTMLAttributes<HTMLSpanElement>['class'];
    iconPosition?: 'left' | 'right';
  }

  const {
    icon,
    children,
    childrenClass = '',
    iconPosition = 'right',
    ...buttonProps
  }: Props = $props();
</script>

<Button
  {...buttonProps}
  class={cn(buttonProps.class, buttonProps.size == 'lg' && '[&_svg]:size-5')}
>
  <span class="flex h-full items-center justify-center gap-2">
    {#if iconPosition === 'left'}
      <Icon src={icon} />
      {#if children}
        <span class={childrenClass}>
          {@render children()}
        </span>
      {/if}
    {:else}
      {#if children}
        <span class={childrenClass}>
          {@render children()}
        </span>
      {/if}
      <Icon src={icon} />
    {/if}
  </span>
</Button>

<style>
  :global {
    .animate-svg svg {
      transition: transform 0.1s ease-in;
    }

    .-animate-svg svg {
      transition: transform 0.1s ease-in;
    }

    .animate-svg:hover svg {
      transform: translateX(3px);
    }

    .-animate-svg:hover svg {
      transform: translateX(-3px);
    }

    .animate-svg-spin svg {
      transition: transform 0.1s ease-in;
    }

    .animate-svg-spin:hover svg {
      transform: rotate(-45deg);
    }
  }
</style>
