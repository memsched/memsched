<script lang="ts">
  import { page } from '$app/state';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { Icon } from 'svelte-icons-pack';
  import { FiLogOut, FiSettings } from 'svelte-icons-pack/fi';
  import { enhance } from '$app/forms';
  import UserAvatar from './UserAvatar.svelte';
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger
    class="flex flex-row items-center justify-center gap-3 border border-transparent"
  >
    <div class="flex flex-col text-end *:leading-tight">
      <small>{page.data.user.name}</small>
      <small class="font-light text-muted-foreground">{page.data.user.username}</small>
    </div>
    <UserAvatar username={page.data.user.username} avatarUrl={page.data.user.avatarUrl} />
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-40" align="end">
    <DropdownMenu.Group>
      <DropdownMenu.Item class="cursor-pointer">
        {#snippet child({ props })}
          <a href="/settings" {...props}>
            <Icon src={FiSettings} className="!text-muted-foreground" />
            Settings
          </a>
        {/snippet}
      </DropdownMenu.Item>
      <form action="/auth/signout" method="POST" use:enhance>
        <DropdownMenu.Item class="w-full cursor-pointer">
          {#snippet child({ props })}
            <button {...props}>
              <Icon src={FiLogOut} className="!text-muted-foreground" />
              Sign Out
            </button>
          {/snippet}
        </DropdownMenu.Item>
      </form>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
