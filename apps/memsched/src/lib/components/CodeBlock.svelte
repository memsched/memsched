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
    'bg-secondary flex rounded-md border p-4 font-mono text-xs text-wrap break-all',
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
