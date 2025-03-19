<script lang="ts">
  import type { PageProps } from './$types';
  import Profile from '$lib/components/account/Profile.svelte';
  import IconButton from '$lib/components/ui/IconButton.svelte';
  import { IoAdd } from 'svelte-icons-pack/io';
  import { v4 as uuid4 } from 'uuid';
  import SvelteSeo from 'svelte-seo';
  import { DOMAIN } from '$lib/constants';

  const { data }: PageProps = $props();

  const pageTitle = `${data.publicUser.name || data.publicUser.username} - MEMsched Profile`;
  const pageDescription = `View ${data.publicUser.name || data.publicUser.username}'s learning journey on MEMsched. See their learning widgets and progress.`;
</script>

<SvelteSeo
  title={pageTitle}
  description={pageDescription}
  openGraph={{
    title: pageTitle,
    description: pageDescription,
    url: `${DOMAIN}/${data.publicUser.username}`,
    type: 'profile',
    site_name: 'MEMsched',
  }}
  twitter={{
    card: 'summary',
    site: '@memsched',
    title: pageTitle,
    description: pageDescription,
  }}
/>

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
    <div class="w-full space-y-3">
      <h2 class="h3">Widgets</h2>
      {#if data.publicUser.widgets.length > 0}
        <div class="flex flex-wrap gap-3">
          {#each data.publicUser.widgets as widget}
            <a href="/widgets/{widget}">
              <img
                src="/api/widgets/{widget}?svg&v={uuid4()}"
                alt="MEMsched Widget"
                class="h-[85px]"
              />
            </a>
          {/each}
        </div>
      {:else}
        <div
          class="flex h-48 w-full flex-col items-center justify-center gap-3 rounded-lg border bg-muted p-4 text-muted-foreground"
        >
          No public widgets yet
          {#if data.isOwner}
            {#if data.publicObjectives.length > 0}
              <IconButton href="/widgets/new" size="sm" icon={IoAdd}
                >Create your first widget</IconButton
              >
            {:else}
              <IconButton href="/objectives/new" size="sm" icon={IoAdd}
                >Create your first objective</IconButton
              >
            {/if}
          {/if}
        </div>
      {/if}
    </div>
  </div>
</section>
