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
  import { expoOut } from 'svelte/easing';
  import { slide } from 'svelte/transition';

  import { navigating } from '$app/state';
</script>

{#if navigating.to}
  <div
    class="fixed left-0 top-0 z-50 h-[3px] w-full bg-primary"
    in:slide={{ delay: 100, duration: 12000, axis: 'x', easing: expoOut }}
  ></div>
{/if}
