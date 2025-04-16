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
