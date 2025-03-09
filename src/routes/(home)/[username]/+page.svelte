<script lang="ts">
  import type { PageProps } from './$types';
  import Profile from '$lib/components/account/Profile.svelte';

  const { data }: PageProps = $props();
</script>

<section class="flex gap-16 pt-6">
  <Profile
    username={data.publicUser.username}
    name={data.publicUser.name}
    avatarUrl={data.publicUser.avatarUrl}
    bio={data.publicUser.bio}
    location={data.publicUser.location}
    website={data.publicUser.website}
    edit={data.isOwner}
  />
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
        class="flex h-48 w-full items-center justify-center rounded-lg border bg-muted p-4 text-muted-foreground"
      >
        No public widgets yet
      </div>
    {/if}
  </div>
</section>
