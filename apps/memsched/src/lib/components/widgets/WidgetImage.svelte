<!--
MEMsched - A memory scheduling and objective tracking application.
Copyright (C) 2025 Leonard Cseres

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
-->
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
    <a href={trueHref} {...rest} class={cn(rest.class, 'flex-shrink-0')}>
      {@render widgetImage({})}
    </a>
  {:else}
    {@render widgetImage(rest)}
  {/if}
{/if}
