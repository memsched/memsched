<script lang="ts">
  import '../app.css';

  import SvelteSeo from 'svelte-seo';

  import { browser } from '$app/environment';
  import { beforeNavigate } from '$app/navigation';
  import { updated } from '$app/state';
  import AccessibilityToolbar from '$lib/components/AccessibilityToolbar.svelte';
  // import { ModeWatcher } from 'mode-watcher';
  import ColorPickerToolbar from '$lib/components/ColorPickerToolbar.svelte';
  import { DOMAIN } from '$lib/constants';

  beforeNavigate(({ willUnload, to }) => {
    if (updated.current && !willUnload && to?.url) {
      location.href = to.url.href;
    }
  });

  const { children } = $props();

  const pageTitle = "MEMsched - Show the world what you're learning";
  const pageDescription =
    'Set goals, log progress, and showcase your learning journey with beautiful widgets. Track your skills development and share your achievements.';
  const imageAlt = 'MEMsched - Track and showcase your learning journey';
</script>

<SvelteSeo
  canonical={DOMAIN}
  description={pageDescription}
  keywords="learning tracker, skill development, progress widgets, learning goals, showcase skills, educational progress"
  openGraph={{
    title: pageTitle,
    description: pageDescription,
    url: DOMAIN,
    type: 'website',
    site_name: 'MEMsched',
    images: [
      {
        url: `${DOMAIN}/opengraph-image.png`,
        width: 1200,
        height: 628,
        alt: imageAlt,
      },
    ],
  }}
  themeColor="#ffffff"
  title={pageTitle}
  twitter={{
    card: 'summary_large_image',
    site: '@memsched',
    title: pageTitle,
    description: pageDescription,
    image: `${DOMAIN}/twitter-image.png`,
    imageAlt: imageAlt,
  }}
/>

<!-- Umami Web Analytics -->
<svelte:head>
  {#if import.meta.env.PROD}
    <script
      data-website-id="048e05e6-5b46-463f-898e-7fb2d8f467e8"
      defer
      src="https://cloud.umami.is/script.js"
    ></script>
  {/if}
</svelte:head>

<!-- <ModeWatcher defaultMode="light" track={false} /> -->
{@render children()}
{#if browser}
  {#await import('svelte-french-toast') then { Toaster }}
    <!-- TODO: window.innerWidth does not work as this is rendered on the server -->
    <Toaster
      toastOptions={{
        className: 'text-sm font-medium',
        position: window.innerWidth > 768 ? 'bottom-right' : 'top-center',
      }}
    />
  {/await}
  {#if import.meta.env.VITE_DEBUG_COLOR_EDITOR === '1' && import.meta.env.DEV}
    <ColorPickerToolbar />
  {/if}
  {#if import.meta.env.VITE_DEBUG_A11Y === '1' && import.meta.env.DEV}
    <AccessibilityToolbar />
  {/if}
{/if}
