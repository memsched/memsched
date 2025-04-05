<script lang="ts">
  import { page } from '$app/state';
  import { IoArrowForward } from 'svelte-icons-pack/io';
  import { HEADER_HEIGHT } from '$lib/constants';
  import { scrollToTop } from '$lib/utils';
  import { Button } from '../ui/button';
  import IconButton from '../ui/IconButton.svelte';
  import LogoShort from '../svgs/LogoShort.svelte';
  import HomeNavLink from './HomeNavLink.svelte';
  import { getUserOverviewUrl } from '$lib/api';
  import HeaderProfile from '../account/HeaderProfile.svelte';
  import { FiArrowRight } from 'svelte-icons-pack/fi';

  const NAV_ITEMS: { href: string; text: string; icon: any }[] = [
    // {
    //   href: !page.data.user ? '/' : getUserOverviewUrl(page.data.user.username),
    //   text: 'Overview',
    //   icon: IoFlashOutline,
    // },
    // { href: '/objectives', text: 'Objectives', icon: IoFolderOpenOutline },
    // { href: '/widgets', text: 'Widgets', icon: IoCubeOutline },
    // { href: '/explore', text: 'Explore', icon: IoCompassOutline },
  ];
</script>

<header class="fixed z-40 w-full border-b bg-background">
  <nav
    class="main-container flex w-full items-center justify-between"
    style="height: {HEADER_HEIGHT}px"
  >
    <div class="flex h-full items-center gap-12">
      {#if page.url.pathname === '/'}
        <button onclick={() => scrollToTop()} aria-label="Scroll to top">
          <LogoShort />
        </button>
      {:else}
        <a href="/" aria-label="Go to homepage">
          <LogoShort />
        </a>
      {/if}
      <div class="flex h-full gap-9 *:h-full">
        {#each NAV_ITEMS as { href, text, icon }}
          <HomeNavLink {href} {text} {icon} />
        {/each}
      </div>
    </div>
    {#if page.data.user}
      <div class="flex gap-3">
        <HeaderProfile compact />
        <IconButton
          icon={FiArrowRight}
          href={getUserOverviewUrl(page.data.user.username)}
          size="sm"
          variant="outline"
          class="animate-svg"
        >
          Dashboard
        </IconButton>
      </div>
    {:else}
      <div class="flex gap-3">
        <Button href="/auth/signin" size="sm" data-umami-event="home-header-join-now-button"
          >Join Now</Button
        >
        <IconButton
          icon={IoArrowForward}
          variant="outline"
          size="sm"
          class="animate-svg"
          href="/auth/signin"
          data-umami-event="home-header-log-in-button"
        >
          Log In
        </IconButton>
      </div>
    {/if}
  </nav>
</header>
