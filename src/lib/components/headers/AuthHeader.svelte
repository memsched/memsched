<script lang="ts">
  import { HEADER_HEIGHT } from '$lib/constants';
  import Logo from '../svgs/Logo.svelte';
  import { Button } from '../ui/button';
</script>

<header class="w-full">
  <nav
    class="mx-auto flex w-full max-w-screen-xl items-center justify-between px-6 lg:px-10"
    style="height: {HEADER_HEIGHT}px"
  >
    <a href="/">
      <Logo />
    </a>
    <div class="flex gap-3">
      <Button href="mailto:info@memsched.com" size="sm" variant="translucent">Contact</Button>
    </div>
  </nav>
</header>
