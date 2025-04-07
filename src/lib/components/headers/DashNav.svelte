<script lang="ts">
  import { IoCube, IoFlash, IoFolderOpen } from 'svelte-icons-pack/io';

  import { page } from '$app/state';
  import { getUserOverviewUrl } from '$lib/api';

  import HeaderProfile from '../account/HeaderProfile.svelte';
  import LogoShort from '../svgs/LogoShort.svelte';
  import DashNavLink from './DashNavLink.svelte';

  const NAV_ITEMS = [
    {
      href: !page.data.user ? '/' : getUserOverviewUrl(page.data.user.username),
      text: 'Overview',
      icon: IoFlash,
    },
    { href: '/objectives', text: 'Objectives', icon: IoFolderOpen },
    { href: '/widgets', text: 'Widgets', icon: IoCube },
  ];
</script>

<div class="flex h-full flex-col items-center justify-between border-e bg-white px-2 py-4">
  <div class="flex flex-col items-center *:py-3 first:*:mb-2 first:*:pt-0">
    <HeaderProfile compact />
    {#each NAV_ITEMS as item}
      <DashNavLink {...item} />
    {/each}
  </div>
  <a href="/">
    <LogoShort height={20} />
  </a>
</div>
