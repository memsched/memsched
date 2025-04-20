<script lang="ts">
  import { cn } from '@memsched/ui/utils';
  import { mode } from 'mode-watcher';
  import type { HTMLAnchorAttributes, HTMLImgAttributes } from 'svelte/elements';

  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import { updateState } from '$lib/state.svelte';

  type ExtendProps = Omit<HTMLAnchorAttributes, 'href'> & Omit<HTMLImgAttributes, 'src'>;

  interface Props extends ExtendProps {
    widget: {
      id: string;
      title: string;
      subtitle: string;
    };
    height?: number;
    url?: boolean;
    href?: string;
  }

  const { widget, height = 85, url = false, href, ...rest }: Props = $props();

  const origin = $derived(page.url.origin);
  const trueHref = $derived(href || `${origin}/widgets/${widget.id}`);
  const imgSrc = $derived(
    `${origin}/api/widgets/${widget.id}?f=svg&v=${updateState.widgetCounter}`
  );
  const imgAlt = $derived(`${widget.title} - ${widget.subtitle}`);

  let loaded = $state(false);
</script>

{#snippet widgetImage(props: HTMLImgAttributes)}
  <img
    src={imgSrc}
    alt={imgAlt}
    style="height: {height}px;"
    {...props}
    class={cn(
      'transition-opacity duration-200',
      loaded ? 'opacity-100' : 'opacity-0',
      $mode === 'light' ? '' : 'hidden',
      props.class
    )}
    onload={() => (loaded = true)}
  />
  <img
    src={imgSrc + '&dark'}
    alt={imgAlt}
    style="height: {height}px;"
    {...props}
    class={cn(
      'transition-opacity duration-200',
      loaded ? 'opacity-100' : 'opacity-0',
      $mode === 'dark' ? '' : 'hidden',
      props.class
    )}
    onload={() => (loaded = true)}
  />
{/snippet}

{#if browser}
  {#if url || href}
    <a href={trueHref} {...rest}>
      {@render widgetImage({})}
    </a>
  {:else}
    {@render widgetImage(rest)}
  {/if}
{/if}
