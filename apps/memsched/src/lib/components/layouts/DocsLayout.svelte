<script lang="ts">
  import { Logo } from '@memsched/ui/components/svgs';
  import { cn } from '@memsched/ui/utils';
  import type { Snippet } from 'svelte';
  import { Icon } from 'svelte-icons-pack';
  import { IoClose, IoMenu } from 'svelte-icons-pack/io';
  import SvelteSeo from 'svelte-seo';

  import { resolve } from '$app/paths';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';

  interface Props {
    class?: string;
    children: Snippet;
  }

  const { class: className, children }: Props = $props();

  const sidebarLinks = [
    {
      title: 'Getting Started',
      links: [
        {
          href: '/docs',
          label: 'Introduction',
          seo: {
            title: 'MEMsched Documentation - Introduction',
            description:
              'Get started with MEMsched - learn how to track and showcase your learning journey with beautiful widgets.',
          },
        },
      ],
    },
    {
      title: 'Embedding',
      links: [
        {
          href: '/docs/embedding/html',
          label: 'HTML & Markdown',
          seo: {
            title: 'MEMsched Documentation - HTML & Markdown Embedding',
            description:
              'Learn how to embed MEMsched widgets in your website or markdown documents.',
          },
        },
      ],
    },
    {
      title: 'Customization',
      links: [
        {
          href: '/docs/customization/styling',
          label: 'Styling',
          seo: {
            title: 'MEMsched Documentation - Styling',
            description: 'Learn how to customize the appearance of your MEMsched widgets.',
          },
        },
      ],
    },
  ];

  const allLinks = sidebarLinks.flatMap((section) => section.links);
  const currentIndex = $derived(allLinks.findIndex((link) => link.href === page.url.pathname));
  const prevLink = $derived(currentIndex > 0 ? allLinks[currentIndex - 1] : null);
  const nextLink = $derived(currentIndex < allLinks.length - 1 ? allLinks[currentIndex + 1] : null);

  const defaultSeo = {
    title: 'MEMsched Documentation',
    description:
      'Comprehensive documentation for MEMsched - track, showcase, and share your learning journey.',
  };

  const currentPage = $derived(allLinks.find((link) => link.href === page.url.pathname));
  const currentSeo = $derived(currentPage?.seo ?? defaultSeo);

  let isMobileMenuOpen = $state(false);

  function toggleMobileMenu(e?: Event) {
    if (e) {
      e.preventDefault();
    }
    isMobileMenuOpen = !isMobileMenuOpen;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault();
      toggleMobileMenu();
    }
  }
</script>

<SvelteSeo
  title={currentSeo.title}
  description={currentSeo.description}
  openGraph={{
    title: currentSeo.title,
    description: currentSeo.description,
    url: `${page.url.origin}${page.url.pathname}`,
    type: 'website',
    site_name: 'MEMsched Documentation',
  }}
  twitter={{
    card: 'summary_large_image',
    title: currentSeo.title,
    description: currentSeo.description,
  }}
/>

<div class={cn('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className)}>
  <!-- Mobile menu button -->
  <div class="fixed left-5 top-5 z-40 lg:hidden">
    <button
      onclick={toggleMobileMenu}
      aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isMobileMenuOpen}
      aria-controls="mobile-navigation"
    >
      <Icon
        src={isMobileMenuOpen ? IoClose : IoMenu}
        className="size-6 transition-colors hover:!text-foreground !text-muted-foreground"
      />
    </button>
  </div>

  <div class="flex gap-6 py-16 max-lg:justify-center">
    <!-- Mobile Sidebar Overlay -->
    {#if isMobileMenuOpen}
      <div
        class="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
        onclick={toggleMobileMenu}
        onkeydown={handleKeydown}
        role="button"
        tabindex="0"
        aria-label="Close menu overlay"
      ></div>
    {/if}

    <!-- Sidebar -->
    <div
      id="mobile-navigation"
      class={cn(
        'fixed inset-y-0 left-0 z-30 w-64 transform overflow-y-auto transition-transform duration-200 ease-in-out max-lg:border-e max-lg:bg-background max-lg:pt-12 lg:fixed lg:block lg:transform-none lg:shadow-none',
        'px-6 py-8 lg:mx-4 lg:px-8 lg:py-12 lg:pt-16 xl:mx-8',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      )}
      role="navigation"
      aria-label="Documentation navigation"
    >
      <!-- Logo -->
      <div class="mb-12">
        <a href={resolve('/docs')} class="inline-block" aria-label="MEMsched Documentation Homepage">
          <Logo class="h-6 w-auto text-primary" />
        </a>
      </div>

      <!-- Navigation -->
      <nav class="h-[calc(100vh-12rem)] space-y-8 overflow-y-auto pb-16">
        {#each sidebarLinks as section}
          <div>
            <h4 class="mb-3 text-sm font-semibold text-primary">{section.title}</h4>
            <ul class="space-y-2.5 text-sm">
              {#each section.links as link}
                <li>
                  <a
                    href={resolve(link.href) as any}
                    class={cn(
                      'block rounded-md px-3 py-1.5 transition-colors',
                      page.url.pathname === link.href
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                    onclick={() => {
                      if (window.innerWidth < 1024) {
                        isMobileMenuOpen = false;
                      }
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        {/each}

        <!-- Home Link -->
        <div class="mt-8 border-t pt-6">
          <button
            onclick={() => {
              goto(resolve('/'), { invalidateAll: true });
            }}
            class="block w-full rounded-md px-3 py-1.5 text-start text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Home"
            data-sveltekit-reload
          >
            ← Home
          </button>
        </div>
      </nav>
    </div>

    <!-- Main content -->
    <div class="min-w-0 max-w-3xl flex-auto lg:ml-64">
      <div class="prose prose-slate max-w-none dark:prose-invert">
        {@render children()}

        <!-- Navigation -->
        <div class="mt-8 flex items-center justify-between border-t pt-4">
          {#if prevLink}
            <a href={resolve(prevLink.href) as any} class="text-primary hover:underline">← {prevLink.label}</a>
          {:else}
            <div></div>
          {/if}

          {#if nextLink}
            <a href={resolve(nextLink.href) as any} class="text-primary hover:underline">{nextLink.label} →</a>
          {:else}
            <div></div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>
