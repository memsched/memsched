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
  import { LogoShort } from '@memsched/ui/components/svgs';
  import { IoCube, IoFlash, IoFolderOpen } from 'svelte-icons-pack/io';

  import { page } from '$app/state';
  import { getUserOverviewUrl } from '$lib/api';

  import HeaderProfile from '../account/HeaderProfile.svelte';
  import HeaderProfileAnonymous from '../account/HeaderProfileAnonymous.svelte';
  import DashNavLink from './DashNavLink.svelte';

  const NAV_ITEMS = [
    {
      href: !page.data.user ? '/auth/signin' : getUserOverviewUrl(page.data.user.username),
      text: 'Overview',
      icon: IoFlash,
    },
    { href: '/objectives', text: 'Objectives', icon: IoFolderOpen },
    { href: '/widgets', text: 'Widgets', icon: IoCube },
  ];
</script>

<div class="flex h-full flex-col items-center justify-between border-e bg-background px-2 py-4">
  <div class="flex flex-col items-center">
    <div class="mb-4">
      {#if page.data.user}
        <HeaderProfile compact />
      {:else}
        <HeaderProfileAnonymous />
      {/if}
    </div>

    {#each NAV_ITEMS as item}
      <DashNavLink {...item} />
    {/each}
  </div>
  <a href="/" class="p-1" aria-label="MEMsched Homepage" data-sveltekit-reload>
    <LogoShort height={20} />
  </a>
</div>
