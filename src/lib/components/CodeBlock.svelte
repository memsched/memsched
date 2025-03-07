<script lang="ts">
  import toast from 'svelte-french-toast';
  import { Icon } from 'svelte-icons-pack';
  import { IoCopyOutline } from 'svelte-icons-pack/io';

  interface Props {
    code: string;
  }

  const { code }: Props = $props();

  function copyToClipboard() {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        toast.success('Copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
      });
  }
</script>

<pre
  class="flex items-start justify-between gap-3 text-wrap rounded-md border bg-muted p-4 font-mono text-sm">
    <code>{code}</code>
    <button class="flex items-center" onclick={copyToClipboard}>
        <Icon
      src={IoCopyOutline}
      className="size-5 !text-muted-foreground hover:!text-foreground transition-colors"
    />
    </button>
</pre>
