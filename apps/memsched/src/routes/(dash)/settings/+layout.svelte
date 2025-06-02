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
  import { Icon } from 'svelte-icons-pack';
  import { IoChevronForward } from 'svelte-icons-pack/io';

  import DashHeader from '$lib/components/headers/DashHeader.svelte';
  import TabNavLink from '$lib/components/headers/TabNavLink.svelte';

  const tabs = [
    { name: 'Public Profile', href: '/settings/profile' },
    { name: 'Account', href: '/settings/account' },
  ];
  const { children } = $props();
</script>

<DashHeader>
  <div class="px-3 text-sm font-medium text-muted-foreground">Settings</div>
  <Icon className="!text-muted-foreground" src={IoChevronForward} />
  {#each tabs as tab}
    <TabNavLink {...tab} />
  {/each}
</DashHeader>
<div class="main-container overflow-y-auto py-10">
  {@render children()}
</div>
