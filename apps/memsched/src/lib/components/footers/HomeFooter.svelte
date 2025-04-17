<script>
  import { Logo, SwissFlag } from '@memsched/ui/components/svgs';
  import { Icon } from 'svelte-icons-pack';
  import { BsTwitterX } from 'svelte-icons-pack/bs';
  import { IoHeart } from 'svelte-icons-pack/io';

  import UptimeRobot from '../UptimeRobot.svelte';
</script>

<footer class="border-t bg-background text-sm">
  <div class="main-container flex flex-col gap-6 divide-y py-10">
    <div class="flex justify-between gap-6">
      <div class="flex flex-col gap-3">
        <div
          class="flex flex-wrap gap-x-12 gap-y-2 text-muted-foreground *:whitespace-nowrap *:transition-colors hover:*:text-foreground max-sm:flex-col"
        >
          <a href="/blog/" data-umami-event="footer-blog-button">Blog</a>
          <a href="/docs" data-sveltekit-reload data-umami-event="footer-docs-button">
            Documentation
          </a>
          <a href="/tos" data-umami-event="footer-tos-button">Terms of Service</a>
          <a href="/privacy" data-umami-event="footer-privacy-button">Privacy Policy</a>
          <a href="mailto:info@memsched.com" data-umami-event="footer-contact-button">Contact</a>
        </div>
        <UptimeRobot />
      </div>
      <div>
        <a
          href="https://x.com/leonardcser"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow me on X"
          data-umami-event="footer-twitter-button"
        >
          <Icon src={BsTwitterX} className="size-5" />
        </a>
      </div>
    </div>
    <div class="flex items-center justify-between gap-6 pt-2">
      <p class="text-xs">
        &copy; {new Date().getFullYear()} MEMsched. All rights reserved. Built with <Icon
          className="inline"
          src={IoHeart}
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
