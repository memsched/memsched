<script lang="ts">
  import { page } from '$app/state';
  import {
    IoArrowForward,
    IoCubeOutline,
    IoFlashOutline,
    IoFolderOpenOutline,
  } from 'svelte-icons-pack/io';
  import { HEADER_HEIGHT } from '$lib/constants';
  import { scrollToTop } from '$lib/utils';
  import { Button } from '../ui/button';
  import IconButton from '../ui/IconButton.svelte';
  import LogoShort from '../svgs/LogoShort.svelte';
  import HomeNavLink from './HomeNavLink.svelte';
  import { getUserOverviewUrl } from '$lib/api';
  import HeaderProfile from '../account/HeaderProfile.svelte';

  const NAV_ITEMS = [
    {
      href: page.data.user === null ? '/' : getUserOverviewUrl(page.data.user.username),
      text: 'Overview',
      icon: IoFlashOutline,
    },
    { href: '/objectives', text: 'Objectives', icon: IoFolderOpenOutline },
    { href: '/widgets', text: 'Widgets', icon: IoCubeOutline },
    // { href: '/explore', text: 'Explore', icon: IoCompassOutline },
  ];
</script>

<header class="fixed z-50 w-full border-b bg-background">
  <nav
    class="mx-auto flex w-full max-w-screen-xl items-center justify-between px-6 lg:px-10"
    style="height: {HEADER_HEIGHT}px"
  >
    <div class="flex h-full items-center gap-12">
      {#if page.url.pathname === '/'}
        <button onclick={() => scrollToTop()}>
          <LogoShort />
        </button>
      {:else}
        <a href="/">
          <LogoShort />
        </a>
      {/if}
      <div class="flex h-full gap-9 *:h-full">
        {#each NAV_ITEMS as { href, text, icon }}
          <HomeNavLink {href} {text} {icon} />
        {/each}
      </div>
    </div>
    {#if page.data.user !== null}
      <HeaderProfile />
    {:else}
      <div class="flex gap-3">
        <Button href="/auth/signin" size="sm">Join Now</Button>
        <IconButton
          icon={IoArrowForward}
          variant="outline"
          size="sm"
          class="animate-svg"
          href="/auth/signin"
        >
          Log In
        </IconButton>
      </div>
    {/if}
  </nav>
</header>
