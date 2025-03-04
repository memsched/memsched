<script lang="ts">
  import { page } from '$app/state';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { Icon } from 'svelte-icons-pack';
  import { FiLogOut, FiSettings } from 'svelte-icons-pack/fi';
  import Avvvatars from '../avvvatars/Avvvatars.svelte';
  import { enhance } from '$app/forms';
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger
    class="flex flex-row items-center justify-center gap-3 border border-transparent"
  >
    <div class="flex flex-col text-end *:leading-tight">
      <small>{page.data.user.name}</small>
      <small class="font-light text-muted-foreground">{page.data.user.username}</small>
    </div>
    {#if page.data.user.avatarUrl}
      <img
        class="inline-block size-8 rounded-full ring-2 ring-white"
        src={page.data.user.avatarUrl}
        alt=""
      />
    {:else}
      <Avvvatars value={page.data.user.username} size={32} style="shape" />
    {/if}
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
      <form action="/signout" method="POST" use:enhance>
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
