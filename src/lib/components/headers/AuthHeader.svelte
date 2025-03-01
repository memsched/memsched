<script lang="ts">
  import { page } from '$app/state';
  import { IoArrowForward } from 'svelte-icons-pack/io';
  import { HEADER_HEIGHT } from '$lib/constants';
  import Logo from '../svgs/Logo.svelte';
  import { Button } from '../ui/button';
  import IconButton from '../ui/IconButton.svelte';
</script>

<header class="w-full">
  <nav
    class="mx-auto flex w-full max-w-screen-xl items-center justify-between px-2 lg:px-10"
    style="height: {HEADER_HEIGHT}px"
  >
    <Logo />
    <div class="flex gap-3">
      {#if page.url.pathname === '/signin'}
        <Button variant="outline" size="sm" class="animate-svg" href="/signup">Sign Up</Button>
      {:else}
        <IconButton
          icon={IoArrowForward}
          variant="outline"
          size="sm"
          class="animate-svg"
          href="/signin"
        >
          Log In
        </IconButton>
      {/if}
      <Button href="mailto:info@memsched.com" size="sm">Contact</Button>
    </div>
  </nav>
</header>
