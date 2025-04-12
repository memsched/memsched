<script lang="ts">
  import { HEADER_HEIGHT } from '$lib/constants';

  import Logo from '../svgs/Logo.svelte';
  import { Button } from '../ui/button';
</script>

<header class="w-full">
  <nav style:height="{HEADER_HEIGHT}px" class="main-container flex items-center justify-between">
    <a href="/" aria-label="MEMsched Homepage">
      <Logo />
    </a>
    <div class="flex gap-3">
      <Button href="mailto:info@memsched.com" size="sm" variant="translucent">Contact</Button>
    </div>
  </nav>
</header>
