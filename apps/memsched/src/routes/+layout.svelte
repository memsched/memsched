<script lang="ts">
  import '../app.css';

  import { mode, ModeWatcher } from 'mode-watcher';
  import SvelteSeo from 'svelte-seo';

  import { browser } from '$app/environment';
  import { beforeNavigate } from '$app/navigation';
  import { updated } from '$app/state';
  import AccessibilityToolbar from '$lib/components/AccessibilityToolbar.svelte';
  import ColorPickerToolbar from '$lib/components/ColorPickerToolbar.svelte';
  import PageLoadProgress from '$lib/components/layouts/PageLoadProgress.svelte';

  beforeNavigate(({ willUnload, to }) => {
    if (updated.current && !willUnload && to?.url) {
      location.href = to.url.href;
    }
  });

  const { children } = $props();
</script>

<SvelteSeo />

<svelte:head>
  <!-- Umami Web Analytics -->
  {#if import.meta.env.PROD}
    <script
      data-website-id="048e05e6-5b46-463f-898e-7fb2d8f467e8"
      defer
      src="https://cloud.umami.is/script.js"
    ></script>
  {/if}
  <!-- Highlight.js -->
  {#if mode.current === 'dark'}
    <link rel="stylesheet" href="/highlightjs/github-dark.min.css" />
  {:else}
    <link rel="stylesheet" href="/highlightjs/github.min.css" />
  {/if}
</svelte:head>

<PageLoadProgress />
<ModeWatcher defaultMode="dark" track disableHeadScriptInjection />
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
