<script lang="ts">
  import { HEADER_HEIGHT } from '$lib/constants';

  import Logo from '../svgs/Logo.svelte';
  import { Button } from '../ui/button';
</script>

<header class="w-full">
  <nav class="main-container flex items-center justify-between" style="height: {HEADER_HEIGHT}px">
    <a href="/">
      <Logo />
    </a>
    <div class="flex gap-3">
      <Button href="mailto:info@memsched.com" size="sm" variant="translucent">Contact</Button>
    </div>
  </nav>
</header>
