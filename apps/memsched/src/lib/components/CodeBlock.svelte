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
  import type { HTMLAttributes } from 'svelte/elements';
  import toast from 'svelte-french-toast';
  import { Icon } from 'svelte-icons-pack';
  import { IoCheckmarkCircleOutline, IoCopyOutline } from 'svelte-icons-pack/io';

  import hljs from '$lib/highlight';

  interface Props extends HTMLAttributes<HTMLPreElement> {
    code: string;
    language: string;
    copy?: boolean;
  }

  const { code, language, copy = true, ...rest }: Props = $props();
  let highlightedCode = $state('');
  let copied = $state(false);
  let timeout = $state(undefined as number | undefined);

  $effect(() => {
    try {
      highlightedCode = hljs.highlight(code, { language, ignoreIllegals: true }).value;
    } catch (e) {
      console.error('Highlighting failed:', e);
      highlightedCode = code; // Fallback to plain text
    }
  });

  function copyToClipboard() {
    navigator.clipboard
      .writeText(code) // Copy original code, not highlighted HTML
      .then(() => {
        clearTimeout(timeout);
        copied = true;
        toast.success('Copied to clipboard!');
        timeout = setTimeout(() => {
          copied = false;
        }, 2000) as unknown as number;
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
      });
  }
</script>

<pre
  {...rest}
  class={cn(
    'flex text-wrap break-all rounded-md border bg-secondary p-4 font-mono text-xs',
    copy && 'items-start justify-between gap-3',
    rest.class
  )}>
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    <code class="flex flex-col justify-center">{@html highlightedCode}</code>
    {#if copy}
    <button
      class="flex items-center"
      type="button"
      onclick={copyToClipboard}
      aria-label="Copy to clipboard">
            <Icon
        src={copied ? IoCheckmarkCircleOutline : IoCopyOutline}
        className={cn(
          'size-5 !text-muted-foreground hover:!text-foreground transition-colors',
          copied && '!text-green-500 hover:!text-green-500'
        )}
      />
        </button>
  {/if}
</pre>
