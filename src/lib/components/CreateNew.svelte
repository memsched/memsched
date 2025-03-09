<script lang="ts">
  import { Icon, type IconType } from 'svelte-icons-pack';
  import IconButton from './ui/IconButton.svelte';
  import { IoAdd } from 'svelte-icons-pack/io';
  import { page } from '$app/state';

  interface Props {
    title: string;
    icon: IconType;
    href: string;
  }

  const { icon, title, href }: Props = $props();
  const finalHref = page.data.user === null ? '/auth/signin' : href;
</script>

<div class="flex flex-col items-center justify-center gap-4">
  <div class="flex h-48 w-48 items-center justify-center rounded-full bg-primary/5 p-6">
    <Icon src={icon} size="150" className="*:!stroke-[5px] !text-primary" />
  </div>

  <h2 class="max-w-sm text-center text-2xl font-semibold">{title}</h2>
  <div class="text-center">
    <IconButton icon={IoAdd} size="lg" href={finalHref}>Create Now</IconButton>
    <p class="mt-2 text-xs text-muted-foreground">
      {#if page.data.user === null}
        Sign in to get started
      {:else}
        Click to begin
      {/if}
    </p>
  </div>
</div>
