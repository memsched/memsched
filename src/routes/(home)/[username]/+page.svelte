<script lang="ts">
  import UserAvatar from '$lib/components/account/UserAvatar.svelte';
  import IconButton from '$lib/components/ui/IconButton.svelte';
  import { HEADER_HEIGHT } from '$lib/constants';
  import type { PageProps } from './$types';
  import { FiEdit3 } from 'svelte-icons-pack/fi';

  const { data }: PageProps = $props();
</script>

<section class="flex gap-16 pt-6">
  <div class="sticky h-fit w-[250px] flex-shrink-0" style="top: calc({HEADER_HEIGHT}px + 5rem)">
    <div class="relative">
      <UserAvatar username={data.publicUser.username} avatarUrl={data.publicUser.avatarUrl} large />
      {#if data.isOwner}
        <IconButton
          href="/account/settings"
          icon={FiEdit3}
          class="absolute bottom-0 left-0 border-2 border-background text-base hover:bg-gray-800 [&_svg]:size-5"
          >Edit</IconButton
        >
      {/if}
    </div>
    <h2 class="mt-8">{data.publicUser.name}</h2>
    <p class="text-lg text-muted-foreground">{data.publicUser.username}</p>
    <p class="mt-5">This is your public profile page. You can add widgets to your profile here.</p>
  </div>
  <div class="w-full space-y-3">
    <h3>Widgets</h3>
    {#if data.publicUser.widgets.length > 0}
      <div class="flex-wrap gap-4">
        {#each data.publicUser.widgets as widget}
          <a href="/widgets/{widget}">
            <img src="/api/widgets/{widget}?svg" alt="MEMsched Widget" class="h-[110px]" />
          </a>
        {/each}
      </div>
    {:else}
      <div
        class="flex h-48 w-full items-center justify-center rounded-lg border bg-muted p-4 text-muted-foreground"
      >
        No public widgets yet
      </div>
    {/if}
  </div>
</section>
