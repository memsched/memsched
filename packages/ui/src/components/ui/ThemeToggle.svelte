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
  import { cn } from '../../utils';
  import { mode, toggleMode } from 'mode-watcher';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { slide } from 'svelte/transition';
  import { Icon } from 'svelte-icons-pack';
  import { IoMoon, IoSunny } from 'svelte-icons-pack/io';

  interface Props extends HTMLButtonAttributes {
    compact?: boolean;
  }

  const { compact = false, ...props }: Props = $props();
</script>

<button
  {...props}
  onclick={(e) => {
    e.preventDefault();
    toggleMode();
  }}
  class={cn('relative flex w-full min-w-[32px] items-center px-2 py-1.5', props.class)}
  aria-label="Toggle theme"
>
  {#if mode.current === 'dark'}
    <div in:slide={{ duration: 200 }} out:slide={{ duration: 200 }} class="absolute left-[8px]">
      <Icon src={IoMoon} size={16} />
    </div>
  {:else}
    <div in:slide={{ duration: 200 }} out:slide={{ duration: 200 }} class="absolute left-[8px]">
      <Icon src={IoSunny} size={16} />
    </div>
  {/if}
  {#if !compact}
    <div class="ps-[24px] capitalize">{mode.current || 'system'}</div>
  {/if}
</button>
