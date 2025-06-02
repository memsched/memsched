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
