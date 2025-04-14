<script lang="ts">
  import { mode } from 'mode-watcher';

  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import { updateState } from '$lib/state.svelte';
  import { cn } from '$lib/utils';

  interface Props {
    widget: {
      id: string;
      title: string;
      subtitle: string;
    };
    height?: number;
    url?: boolean;
  }

  const { widget, height = 85, url = false }: Props = $props();

  const origin = $derived(page.url.origin);
  const href = $derived(`${origin}/widgets/${widget.id}`);
  const imgSrc = $derived(
    `${origin}/api/widgets/${widget.id}?svg&v=${updateState.widgetCounter}` +
      ($mode === 'dark' ? '&dark' : '')
  );
  const imgAlt = $derived(`${widget.title} - ${widget.subtitle}`);

  let loaded = $state(false);
</script>

{#snippet widgetImage()}
  <img
    src={imgSrc}
    alt={imgAlt}
    style="height: {height}px;"
    class={cn('transition-opacity duration-200', loaded ? 'opacity-100' : 'opacity-0')}
    onload={() => (loaded = true)}
  />
{/snippet}

{#if browser}
  {#if url}
    <a {href}>
      {@render widgetImage()}
    </a>
  {:else}
    {@render widgetImage()}
  {/if}
{/if}
