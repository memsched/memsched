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
  import '../app.css';

  import { mode, ModeWatcher } from 'mode-watcher';
  import SvelteSeo from 'svelte-seo';

  import { browser } from '$app/environment';
  import { beforeNavigate } from '$app/navigation';
  import { updated } from '$app/state';
  import AccessibilityToolbar from '$lib/components/AccessibilityToolbar.svelte';
  import ColorPickerToolbar from '$lib/components/ColorPickerToolbar.svelte';
  import PageLoadProgress from '$lib/components/layouts/PageLoadProgress.svelte';
  import { initDevice } from '$lib/device.svelte';

  beforeNavigate(({ willUnload, to }) => {
    if (updated.current && !willUnload && to?.url) {
      location.href = to.url.href;
    }
  });

  const { children } = $props();

  const HIGHLIGHT_THEME_LINK_ID = 'highlight-js-theme';

  $effect(() => {
    if (!browser) return;

    const theme = mode.current === 'dark' ? 'github-dark' : 'github';
    const themeUrl = `/highlightjs/${theme}.min.css`;

    let linkElement = document.getElementById(HIGHLIGHT_THEME_LINK_ID) as HTMLLinkElement | null;

    if (linkElement) {
      // Update existing link if theme changed
      if (linkElement.href !== themeUrl) {
        linkElement.href = themeUrl;
      }
    } else {
      // Create and append new link if it doesn't exist
      linkElement = document.createElement('link');
      linkElement.id = HIGHLIGHT_THEME_LINK_ID;
      linkElement.rel = 'stylesheet';
      linkElement.href = themeUrl;
      document.head.appendChild(linkElement);
    }
  });
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
</svelte:head>

<svelte:window use:initDevice />

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
