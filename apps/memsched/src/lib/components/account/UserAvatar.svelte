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
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  import { updateState } from '$lib/state.svelte';

  import Avvvatars from '../avvvatars/Avvvatars.svelte';

  interface Props {
    username: string;
    avatarUrl: string | null;
    large?: boolean;
  }

  const { username, avatarUrl, large = false }: Props = $props();

  let loaded = $state(false);
  let error = $state(false);

  onMount(() => {
    if (avatarUrl) {
      fetch(avatarUrl, { method: 'HEAD' })
        .then((res) => {
          if (res.ok) {
            loaded = true;
          } else {
            error = true;
          }
        })
        .catch(() => {
          error = true;
        });
    }
  });
</script>

{#if error || !avatarUrl}
  <div in:fade={{ duration: 100 }}>
    <Avvvatars value={username} size={large ? 250 : 32} style="shape" />
  </div>
{:else if loaded}
  <div in:fade={{ duration: 100 }}>
    <img
      class={cn('inline-block rounded-full', large ? 'size-[250px] ring-2 ring-border' : 'size-8')}
      src={avatarUrl + '?v=' + updateState.avatarCounter}
      alt="User profile avatar"
    />
  </div>
{:else}
  <div
    class={cn(
      'rounded-full bg-background ring-2 ring-border',
      large ? 'size-[250px]' : 'size-8 ring-1',
      'animate-pulse'
    )}
  ></div>
{/if}
