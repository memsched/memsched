<script lang="ts">
  import { Icon } from 'svelte-icons-pack';
  import { FiBookOpen, FiLifeBuoy, FiLogOut, FiSettings } from 'svelte-icons-pack/fi';

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
          <a href="/settings/profile" {...props}>
            <Icon src={FiSettings} className="!text-muted-foreground" />
            Settings
          </a>
        {/snippet}
      </DropdownMenu.Item>
      <DropdownMenu.Item class="cursor-pointer hover:text-accent-foreground">
        {#snippet child({ props })}
          <a href="/docs" {...props} data-sveltekit-reload>
            <Icon src={FiBookOpen} className="!text-muted-foreground" />
            Docs
          </a>
        {/snippet}
      </DropdownMenu.Item>
      <DropdownMenu.Item class="cursor-pointer hover:text-accent-foreground">
        {#snippet child({ props })}
          <a href="mailto:info@memsched.com" {...props}>
            <Icon src={FiLifeBuoy} className="!text-muted-foreground" />
            Support
          </a>
        {/snippet}
      </DropdownMenu.Item>
      <DropdownMenuSeparator />
      <form action="/auth/signout" method="POST" use:enhance>
        <DropdownMenu.Item class="w-full cursor-pointer hover:text-accent-foreground">
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
