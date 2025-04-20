<script lang="ts">
  import { FiPlus } from 'svelte-icons-pack/fi';
  import SvelteSeo from 'svelte-seo';

  import { page } from '$app/state';
  import Profile from '$lib/components/account/Profile.svelte';
  import DashHeader from '$lib/components/headers/DashHeader.svelte';
  import IconButton from '$lib/components/ui/IconButton.svelte';
  import WidgetImage from '$lib/components/widgets/WidgetImage.svelte';
  import { DOMAIN } from '$lib/constants';

  import type { PageProps } from './$types';

  const { data }: PageProps = $props();

  const pageTitle = `${data.publicUser.name || data.publicUser.username} - MEMsched Profile`;
  const pageDescription = `View ${data.publicUser.name || data.publicUser.username}'s learning journey on MEMsched. See their learning widgets and progress.`;

  const personSchema = {
    '@context': 'https://schema.org' as const,
    '@type': 'Person' as const,
    mainEntityOfPage: {
      '@type': 'WebPage' as const,
      '@id': `${DOMAIN}/${data.publicUser.username}`,
    },
    name: data.publicUser.name || data.publicUser.username,
    description: data.publicUser.bio || pageDescription,
    identifier: data.publicUser.username,
    url: `${DOMAIN}/${data.publicUser.username}`,
    ...(data.publicUser.location && {
      homeLocation: {
        '@type': 'Place' as const,
        name: data.publicUser.location,
      },
    }),
    ...(data.publicUser.website && { sameAs: [data.publicUser.website] }),
    ...(data.publicUser.avatarUrl && {
      image: {
        '@type': 'ImageObject' as const,
        url: data.publicUser.avatarUrl,
      },
    }),
  } as const;
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
  twitter={data.widget
    ? {
        card: 'summary_large_image',
        title: data.widget.title,
        description: data.widget.subtitle,
        image: `${page.url.origin}/api/widgets/${data.widget.id}?f=png${data.widgetDark ? '&dark' : ''}`,
        imageAlt: data.widget.title,
      }
    : {
        card: 'summary',
        title: pageTitle,
        description: pageDescription,
      }}
  jsonLd={personSchema}
/>

<DashHeader>
  <div class="px-3 text-sm font-medium">Overview</div>
</DashHeader>
<section class="main-container flex gap-16 py-16">
  <Profile
    username={data.publicUser.username}
    name={data.publicUser.name}
    avatarUrl={data.publicUser.avatarUrl}
    bio={data.publicUser.bio}
    location={data.publicUser.location}
    website={data.publicUser.website}
  />
  <div class="flex w-full flex-col gap-8">
    <div class="w-full space-y-3">
      <h2 class="h3">Widgets</h2>
      {#if data.publicUser.widgets.length > 0}
        <div class="flex flex-wrap gap-3">
          {#each data.publicUser.widgets as widget}
            {#if data.isOwner}
              <WidgetImage
                widget={{
                  id: widget,
                  title: 'MEMsched',
                  subtitle: 'Widget',
                }}
                url
              />
            {:else}
              <WidgetImage
                widget={{
                  id: widget,
                  title: 'MEMsched',
                  subtitle: 'Widget',
                }}
              />
            {/if}
          {/each}
        </div>
      {:else}
        <div
          class="flex h-48 w-full flex-col items-center justify-center gap-3 rounded-lg border bg-background p-4 text-muted-foreground"
        >
          No public widgets yet
          {#if data.isOwner}
            {#if data.objectives.length > 0}
              <IconButton href="/widgets/new" size="sm" icon={FiPlus}
                >Create your first widget</IconButton
              >
            {:else}
              <IconButton href="/objectives/new" size="sm" icon={FiPlus}
                >Create your first objective</IconButton
              >
            {/if}
          {/if}
        </div>
      {/if}
    </div>
  </div>
</section>
