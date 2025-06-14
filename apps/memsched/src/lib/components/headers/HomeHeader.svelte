<script lang="ts">
  import { Logo } from '@memsched/ui/components/svgs';
  import { ThemeToggle } from '@memsched/ui/components/ui';
  import { FiArrowRight } from 'svelte-icons-pack/fi';
  import { IoArrowForward } from 'svelte-icons-pack/io';

  import { page } from '$app/state';
  import { getUserOverviewUrl } from '$lib/api';
  import { HEADER_HEIGHT } from '$lib/constants';
  import { scrollToTop } from '$lib/utils';

  import { Button } from '../ui/button';
  import IconButton from '../ui/IconButton.svelte';
  import HomeNavLink from './HomeNavLink.svelte';

  const NAV_ITEMS: { href: string; text: string; icon?: any }[] = [
    { href: '/blog/', text: 'Blog' },
  ];
</script>

<header class="fixed z-40 w-full border-b bg-background">
  <nav
    class="main-container flex w-full items-center justify-between"
    style="height: {HEADER_HEIGHT}px"
  >
    <div class="flex h-full items-center gap-8">
      {#if page.url.pathname === '/'}
        <button onclick={() => scrollToTop()} aria-label="Scroll to top">
          <Logo />
        </button>
      {:else}
        <a href="/" aria-label="MEMsched Homepage">
          <Logo />
        </a>
      {/if}
      <div class="me-6 flex h-full gap-6 *:h-full">
        {#each NAV_ITEMS as { href, text }}
          <HomeNavLink {href} {text} />
        {/each}
      </div>
    </div>
    <div class="flex gap-3">
      <ThemeToggle compact />
      {#if page.data.user}
        <IconButton
          icon={FiArrowRight}
          href={getUserOverviewUrl(page.data.user.username)}
          size="sm"
          variant="outline"
          class="animate-svg"
        >
          Dashboard
        </IconButton>
      {:else}
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
      {/if}
    </div>
  </nav>
</header>
