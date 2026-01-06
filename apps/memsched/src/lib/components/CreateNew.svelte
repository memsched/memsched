<script lang="ts">
  import { Icon, type IconType } from 'svelte-icons-pack';
  import { FiPlus } from 'svelte-icons-pack/fi';

  import { page } from '$app/state';

  import IconButton from './ui/IconButton.svelte';

  interface Props {
    title: string;
    description?: string;
    icon: IconType;
    href: string;
    buttonText?: string;
    buttonIcon?: IconType;
  }

  const {
    icon,
    title,
    href,
    description,
    buttonText = 'Create Now',
    buttonIcon = FiPlus,
  }: Props = $props();
  const finalHref = $derived(page.data.user === null ? '/auth/signin' : href);
</script>

<div class="flex flex-col items-center justify-center gap-4">
  <div class="flex h-48 w-48 items-center justify-center rounded-full bg-primary/10">
    <Icon src={icon} size="150" className="*:!stroke-[5px] !text-primary" />
  </div>

  <h1 class="h3 max-w-sm text-center">{title}</h1>
  {#if description}
    <p class="max-w-sm text-center text-muted-foreground">{description}</p>
  {/if}
  <div class="text-center">
    <IconButton icon={buttonIcon} size="lg" href={finalHref}>{buttonText}</IconButton>
    <p class="mt-2 text-xs text-muted-foreground">
      {#if page.data.user === null}
        Sign in to get started
      {:else}
        Click to begin
      {/if}
    </p>
  </div>
</div>
