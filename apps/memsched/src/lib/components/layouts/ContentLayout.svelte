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
  import { Logo } from '@memsched/ui/components/svgs';
  import type { Snippet } from 'svelte';
  import { Icon } from 'svelte-icons-pack';
  import { IoChevronBack } from 'svelte-icons-pack/io';

  import { goto } from '$app/navigation';

  interface Props {
    title: string;
    children: Snippet;
  }

  let { title, children }: Props = $props();
</script>

<div class="mx-auto flex h-full max-w-screen-md flex-col p-8 lg:px-12 lg:py-16">
  <button
    class="mb-10 flex items-center gap-0.5 font-bold text-muted-foreground transition-colors hover:text-foreground"
    onclick={() => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        goto('/', { invalidateAll: true });
      }
    }}
  >
    <Icon src={IoChevronBack} className="inline *:!stroke-inherit" />
    Back
  </button>
  <h1 class="mb-4 text-3xl font-bold">{title}</h1>
  <section class="md mb-12 text-justify">
    {@render children()}
  </section>
  <div class="flex w-full justify-center">
    <a href="/" aria-label="MEMsched Homepage">
      <Logo />
    </a>
  </div>
</div>
