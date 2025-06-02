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
  import { ThemeToggle } from '@memsched/ui/components/ui';
  import { Icon } from 'svelte-icons-pack';
  import { FiBookOpen, FiHome, FiLogOut, FiSettings } from 'svelte-icons-pack/fi';
  import { IoBulb } from 'svelte-icons-pack/io';

  import { enhance } from '$app/forms';
  import { page } from '$app/state';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

  import DropdownMenuLabel from '../ui/dropdown-menu/dropdown-menu-label.svelte';
  import DropdownMenuSeparator from '../ui/dropdown-menu/dropdown-menu-separator.svelte';
  import UserAvatar from './UserAvatar.svelte';

  interface Props {
    compact?: boolean;
  }

  const { compact = false }: Props = $props();
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger
    class="flex flex-row items-center justify-center gap-3 border border-transparent"
    aria-label="User Profile"
  >
    {#if !compact}
      <div class="flex flex-col text-end *:leading-tight">
        <small>{page.data.user.name}</small>
        <small class="font-light text-muted-foreground">{page.data.user.username}</small>
      </div>
    {/if}
    <UserAvatar username={page.data.user.username} avatarUrl={page.data.user.avatarUrl} />
  </DropdownMenu.Trigger>
  <DropdownMenu.Content
    class="min-w-40"
    align={compact ? 'start' : 'end'}
    side={compact ? 'right' : 'bottom'}
  >
    <DropdownMenu.Group>
      <DropdownMenuLabel>
        <div class="leading-3">{page.data.user.username}</div>
        <small class="font-normal text-muted-foreground">{page.data.user.email}</small>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenu.Item class="cursor-pointer hover:text-accent-foreground">
        {#snippet child({ props })}
          <a
            href="/settings/profile"
            {...props}
            aria-label="Settings"
            data-umami-event="header-profile-settings-button"
          >
            <Icon src={FiSettings} className="!text-muted-foreground" />
            Settings
          </a>
        {/snippet}
      </DropdownMenu.Item>
      <DropdownMenu.Item class="cursor-pointer hover:text-accent-foreground">
        {#snippet child({ props })}
          <a
            href="/docs"
            {...props}
            aria-label="Documentation"
            data-sveltekit-reload
            data-umami-event="header-profile-docs-button"
          >
            <Icon src={FiBookOpen} className="!text-muted-foreground" />
            Docs
          </a>
        {/snippet}
      </DropdownMenu.Item>
      <DropdownMenu.Item class="cursor-pointer hover:text-accent-foreground">
        {#snippet child({ props })}
          <a
            href="/"
            {...props}
            aria-label="Home"
            data-sveltekit-reload
            data-umami-event="header-profile-home-button"
          >
            <Icon src={FiHome} className="!text-muted-foreground" />
            Home
          </a>
        {/snippet}
      </DropdownMenu.Item>
      <DropdownMenuSeparator />
      <DropdownMenu.Item class="cursor-pointer hover:text-accent-foreground">
        {#snippet child({ props })}
          <ThemeToggle {...props} />
        {/snippet}
      </DropdownMenu.Item>
      <DropdownMenuSeparator />
      <DropdownMenu.Item class="cursor-pointer hover:text-accent-foreground">
        {#snippet child({ props })}
          <a
            {...props}
            href="https://memsched.featurebase.app"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ideas & Bugs"
            data-umami-event="header-profile-ideas-bugs-button"
          >
            <Icon src={IoBulb} className="!text-muted-foreground" />
            Ideas & Bugs
          </a>
        {/snippet}
      </DropdownMenu.Item>
      <DropdownMenuSeparator />
      <form action="/auth/signout" method="POST" use:enhance>
        <DropdownMenu.Item class="w-full cursor-pointer hover:text-accent-foreground">
          {#snippet child({ props })}
            <button
              {...props}
              aria-label="Sign Out"
              data-umami-event="header-profile-sign-out-button"
            >
              <Icon src={FiLogOut} className="!text-muted-foreground" />
              Sign Out
            </button>
          {/snippet}
        </DropdownMenu.Item>
      </form>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
