<script>
  import { Icon } from 'svelte-icons-pack';
  import { IoHeart } from 'svelte-icons-pack/io';
  import Logo from '../svgs/Logo.svelte';
  import SwissFlag from '../svgs/SwissFlag.svelte';
  import UptimeRobot from '../UptimeRobot.svelte';
</script>

<footer class="border-t bg-background text-sm">
  <div class="main-container flex flex-col gap-6 divide-y py-10">
    <div class="flex flex-col gap-3">
      <div class="flex gap-12 text-muted-foreground *:transition-colors hover:*:text-foreground">
        <a href="/docs"> Documentation </a>
        <a href="/tos">Terms of Service</a>
        <a href="/privacy">Privacy Policy</a>
        <a href="mailto:info@memsched.com">Contact</a>
      </div>
      <UptimeRobot />
    </div>
    <div class="flex items-center justify-between pt-6">
      <p class="text-xs">
        &copy; {new Date().getFullYear()} MEMsched. All rights reserved. Built with <Icon
          src={IoHeart}
          className="inline"
        /> by Leo
        <span class="text-nowrap">
          — a Swiss app
          <SwissFlag class="ms-1 inline h-4 w-4" />
        </span>
      </p>
      <div class="flex items-center gap-2">
        <Logo width={90} />
      </div>
    </div>
  </div>
</footer>
