<script lang="ts">
  import { browser } from '$app/environment';
  import { beforeNavigate } from '$app/navigation';
  import { updated } from '$app/state';
  // import { ModeWatcher } from 'mode-watcher';
  import ColorPickerToolbar from '$lib/components/ColorPickerToolbar.svelte';
  import '../app.css';

  beforeNavigate(({ willUnload, to }) => {
    if (updated.current && !willUnload && to?.url) {
      location.href = to.url.href;
    }
  });

  const { children } = $props();
</script>

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
{/if}
