<script lang="ts">
  import { browser } from '$app/environment';
  import '../app.css';

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
{/if}
