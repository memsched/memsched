<script lang="ts">
  import { cn } from '@memsched/ui/utils';
  import toast from 'svelte-french-toast';
  import { Icon, type IconType } from 'svelte-icons-pack';
  import { FiLink } from 'svelte-icons-pack/fi';
  import { IoCheckmarkCircleOutline } from 'svelte-icons-pack/io';

  import { Button } from '$lib/components/ui/button';

  interface Props {
    textToCopy: string;
    label?: string;
    iconSrc?: IconType;
  }

  const { textToCopy, label = 'Copy', iconSrc = FiLink }: Props = $props();

  let copied = $state(false);
  let timeout = $state(undefined as number | undefined);

  function copyToClipboard() {
    navigator.clipboard
      .writeText(textToCopy)
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
        toast.error('Failed to copy to clipboard.');
      });
  }
</script>

<Button
  onclick={copyToClipboard}
  variant="outline"
  aria-label="Copy to clipboard"
  class={cn('w-[133px]', copied && 'hover:bg-background hover:text-foreground')}
>
  {#if copied}
    <Icon src={IoCheckmarkCircleOutline} className={cn('mr-2 size-4 !text-green-500')} />
  {:else}
    <Icon src={iconSrc} className="mr-2 size-4" />
  {/if}
  {copied ? 'Copied!' : label}
</Button>
