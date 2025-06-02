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
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();
</script>

<div class="max-w-full overflow-hidden rounded-xl border bg-white shadow-xl">
  <!-- Browser chrome -->
  <div class="flex items-center border-b bg-secondary px-4 py-3">
    <div class="mr-6 flex gap-1.5">
      <div class="h-3 w-3 rounded-full bg-red-400"></div>
      <div class="h-3 w-3 rounded-full bg-yellow-400"></div>
      <div class="h-3 w-3 rounded-full bg-green-400"></div>
    </div>
    <div class="w-24"></div>
  </div>

  <!-- Browser content -->
  <div class="bg-background">
    {@render children()}
  </div>
</div>
