<script lang="ts">
  import toast from 'svelte-french-toast';
  import { Icon } from 'svelte-icons-pack';
  import { IoCheckmarkCircleOutline, IoCopyOutline } from 'svelte-icons-pack/io';

  import { cn } from '$lib/utils';

  interface Props {
    code: string;
  }

  const { code }: Props = $props();
  let copied = $state(false);
  let timeout = $state(undefined as number | undefined);

  function copyToClipboard() {
    navigator.clipboard
      .writeText(code)
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
  class="flex items-start justify-between gap-3 text-wrap rounded-md border bg-secondary p-4 font-mono text-xs">
    <code class="overflow-hidden">{code}</code>
    <button class="flex items-center" onclick={copyToClipboard}>
        <Icon
      src={copied ? IoCheckmarkCircleOutline : IoCopyOutline}
      className={cn(
        'size-5 !text-muted-foreground hover:!text-foreground transition-colors',
        copied && '!text-green-500 hover:!text-green-500'
      )}
    />
    </button>
</pre>
