<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Icon, type IconType } from 'svelte-icons-pack';
  import type { HTMLAttributes } from 'svelte/elements';
  import { Button, type ButtonProps } from './button';
  import { cn } from '$lib/utils';

  interface Props extends ButtonProps {
    icon: IconType;
    children: Snippet;
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
      <span class={childrenClass}>
        {@render children()}
      </span>
    {:else}
      <span class={childrenClass}>
        {@render children()}
      </span>
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
