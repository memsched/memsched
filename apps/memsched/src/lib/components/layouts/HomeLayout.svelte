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
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  import { HEADER_HEIGHT } from '$lib/constants';

  interface Props {
    class?: HTMLAttributes<HTMLElement>['class'];
    container?: boolean;
    children: Snippet;
  }

  const { class: className, container = true, children }: Props = $props();
</script>

<main
  class={cn(
    'flex w-full flex-grow flex-col',
    container && 'main-container py-8 lg:py-14',
    className
  )}
  style="margin-top: {HEADER_HEIGHT}px"
>
  {@render children()}
</main>
