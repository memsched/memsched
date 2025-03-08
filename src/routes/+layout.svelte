<script lang="ts">
  import { browser } from '$app/environment';
  import { beforeNavigate } from '$app/navigation';
  import { updated } from '$app/state';
  import '../app.css';
  import ColorPickerToolbar from '$lib/components/ColorPickerToolbar.svelte';

  beforeNavigate(({ willUnload, to }) => {
    if (updated.current && !willUnload && to?.url) {
      location.href = to.url.href;
    }
  });

  const { children } = $props();
</script>

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
  
  <ColorPickerToolbar />
{/if}
