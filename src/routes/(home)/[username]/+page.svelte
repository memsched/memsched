<script lang="ts">
  import type { PageProps } from './$types';
  import Profile from '$lib/components/account/Profile.svelte';
  import IconButton from '$lib/components/ui/IconButton.svelte';
  import { IoAdd } from 'svelte-icons-pack/io';

  const { data }: PageProps = $props();
</script>

<section class="flex gap-16">
  <Profile
    username={data.publicUser.username}
    name={data.publicUser.name}
    avatarUrl={data.publicUser.avatarUrl}
    bio={data.publicUser.bio}
    location={data.publicUser.location}
    website={data.publicUser.website}
    edit={data.isOwner}
  />
  <div class="flex w-full flex-col gap-8">
    {#if data.publicObjectives.length > 0}
      <div class="w-full space-y-3">
        <h3>Widgets</h3>
        {#if data.publicUser.widgets.length > 0}
          <div class="flex flex-wrap gap-3">
            {#each data.publicUser.widgets as widget}
              <a href="/widgets/{widget}">
                <img src="/api/widgets/{widget}?svg" alt="MEMsched Widget" class="h-[90px]" />
              </a>
            {/each}
          </div>
        {:else}
          <div
            class="flex h-48 w-full flex-col items-center justify-center gap-3 rounded-lg border bg-muted p-4 text-muted-foreground"
          >
            No public widgets yet
            {#if data.isOwner}
              <IconButton href="/widgets/new" size="sm" icon={IoAdd}
                >Create your first widget</IconButton
              >
            {/if}
          </div>
        {/if}
      </div>
    {/if}
  </div>
</section>
