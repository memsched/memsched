<script lang="ts">
  import { LogoShort } from '@memsched/ui/components/svgs';
  import { IoCube, IoFlash, IoFolderOpen } from 'svelte-icons-pack/io';

  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import { getUserOverviewUrl } from '$lib/api';

  import HeaderProfile from '../account/HeaderProfile.svelte';
  import HeaderProfileAnonymous from '../account/HeaderProfileAnonymous.svelte';
  import DashNavLink from './DashNavLink.svelte';

  const NAV_ITEMS = [
    {
      href: !page.data.user ? '/auth/signin' : getUserOverviewUrl(page.data.user.username),
      text: 'Overview',
      icon: IoFlash,
    },
    { href: '/objectives', text: 'Objectives', icon: IoFolderOpen },
    { href: '/widgets', text: 'Widgets', icon: IoCube },
  ];
</script>

<div class="bg-background flex h-full flex-col items-center justify-between border-e px-2 py-4">
  <div class="flex flex-col items-center">
    <div class="mb-4">
      {#if page.data.user}
        <HeaderProfile compact />
      {:else}
        <HeaderProfileAnonymous />
      {/if}
    </div>

    {#each NAV_ITEMS as item}
      <DashNavLink {...item} />
    {/each}
  </div>
  <a href={resolve('/')} class="p-1" aria-label="MEMsched Homepage" data-sveltekit-reload>
    <LogoShort height={20} />
  </a>
</div>
