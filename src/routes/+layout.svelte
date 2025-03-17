<script lang="ts">
  import { browser } from '$app/environment';
  import { beforeNavigate } from '$app/navigation';
  import { updated } from '$app/state';
  // import { ModeWatcher } from 'mode-watcher';
  import ColorPickerToolbar from '$lib/components/ColorPickerToolbar.svelte';
  import AccessibilityToolbar from '$lib/components/AccessibilityToolbar.svelte';
  import '../app.css';

  beforeNavigate(({ willUnload, to }) => {
    if (updated.current && !willUnload && to?.url) {
      location.href = to.url.href;
    }
  });

  const { children } = $props();
</script>

<!-- Umami Web Analytics -->
<svelte:head>
  {#if import.meta.env.PROD}
    <script
      defer
      src="https://cloud.umami.is/script.js"
      data-website-id="048e05e6-5b46-463f-898e-7fb2d8f467e8"
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
