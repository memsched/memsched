<script lang="ts">
  import { page } from '$app/state';
  import {
    IoArrowForward,
    IoCompassOutline,
    IoCubeOutline,
    IoFlashOutline,
    IoFolderOutline,
  } from 'svelte-icons-pack/io';
  import { HEADER_HEIGHT } from '$lib/constants';
  import { scrollToElement } from '$lib/utils';
  import { Button } from '../ui/button';
  import IconButton from '../ui/IconButton.svelte';
  import LogoShort from '../svgs/LogoShort.svelte';
  import HomeNavLink from './HomeNavLink.svelte';

  const NAV_ITEMS = [
    {
      href: page.data.user === null ? '/' : '/' + page.data.user.username,
      text: 'Overview',
      icon: IoFlashOutline,
    },
    { href: '/objectives', text: 'Objectives', icon: IoFolderOutline },
    { href: '/widgets', text: 'Widgets', icon: IoCubeOutline },
    { href: '/explore', text: 'Explore', icon: IoCompassOutline },
  ];
</script>

<header class="w-full border-b bg-white">
  <nav
    class="mx-auto flex w-full max-w-screen-xl items-center justify-between px-2 lg:px-10"
    style="height: {HEADER_HEIGHT}px"
  >
    {#if page.url.pathname === '/'}
      <button onclick={() => scrollToElement('hero')}>
        <LogoShort />
      </button>
    {:else}
      <a href="/">
        <LogoShort />
      </a>
    {/if}
    <div class="flex gap-9">
      {#each NAV_ITEMS as { href, text, icon }}
        <HomeNavLink {href} {text} {icon} />
      {/each}
    </div>
    {#if page.data.user !== null}
      <pre>{page.data.user.username}</pre>
    {:else}
      <div class="flex gap-3">
        <Button href="/signup" size="sm">Join Now</Button>
        <IconButton
          icon={IoArrowForward}
          variant="outline"
          size="sm"
          class="animate-svg"
          href="/signin"
        >
          Log In
        </IconButton>
      </div>
    {/if}
  </nav>
</header>
