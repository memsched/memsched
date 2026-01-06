<script lang="ts">
  import { cn } from '@memsched/ui/utils';
  import { mode } from 'mode-watcher';
  import type { HTMLAnchorAttributes, HTMLImgAttributes } from 'svelte/elements';

  import { resolve } from '$app/paths';
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
    url?: boolean;
    href?: string;
  }

  const { widget, url = false, href, ...rest }: Props = $props();

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
    {...props}
    class={cn(
      'h-fit w-fit transition-opacity duration-100',
      loaded ? 'opacity-100' : 'opacity-0',
      mode.current === 'light' ? '' : 'hidden',
      props.class
    )}
    onload={() => (loaded = true)}
  />
  <img
    src={imgSrc + '&dark'}
    alt={imgAlt}
    {...props}
    class={cn(
      'h-fit w-fit transition-opacity duration-100',
      loaded ? 'opacity-100' : 'opacity-0',
      mode.current === 'dark' ? '' : 'hidden',
      props.class
    )}
    onload={() => (loaded = true)}
  />
{/snippet}

{#if browser}
  {#if url || href}
    <a href={trueHref.startsWith('http://') || trueHref.startsWith('https://') ? trueHref : (resolve(trueHref) as any)} {...rest} class={cn(rest.class, 'flex-shrink-0')}>
      {@render widgetImage({})}
    </a>
  {:else}
    {@render widgetImage(rest)}
  {/if}
{/if}
