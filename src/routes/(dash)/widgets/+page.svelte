<script lang="ts">
  import { FiPlus } from 'svelte-icons-pack/fi';
  import { IoArrowForward, IoCubeOutline } from 'svelte-icons-pack/io';
  import SvelteSeo from 'svelte-seo';
  import { v4 as uuid4 } from 'uuid';

  import { browser } from '$app/environment';
  import CreateNew from '$lib/components/CreateNew.svelte';
  import DashHeader from '$lib/components/headers/DashHeader.svelte';
  import IconButton from '$lib/components/ui/IconButton.svelte';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { DOMAIN } from '$lib/constants';

  import { type PageProps } from './$types';

  const { data }: PageProps = $props();

  // Define page title based on active tab
  const pageTitle = 'Learning Widgets - MEMsched';
  const pageDescription =
    'Create and manage your learning widgets on MEMsched. Showcase your progress and share them with the world.';
</script>

<SvelteSeo
  title={pageTitle}
  description={pageDescription}
  openGraph={{
    title: pageTitle,
    description: pageDescription,
    url: `${DOMAIN}/widgets`,
    type: 'website',
    site_name: 'MEMsched',
  }}
  twitter={{
    card: 'summary',
    site: '@memsched',
    title: pageTitle,
    description: pageDescription,
  }}
/>

<DashHeader>
  <div class="px-3 text-sm font-medium">Widgets</div>
  {#if data.widgetsLimitReached}
    <Tooltip.Provider delayDuration={100}>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <IconButton disabled size="xs" icon={FiPlus} variant="translucent" class="rounded-none">
            New
          </IconButton>
        </Tooltip.Trigger>
        <Tooltip.Content side="bottom" align="center" class="flex flex-col gap-2 p-4">
          <p>
            You've reached the maximum limit of {data.maxWidgets} widgets
          </p>
          <IconButton
            icon={IoArrowForward}
            size="sm"
            href="/settings/account"
            class="animate-svg"
            data-umami-event="widgets-upgrade-to-pro-button"
          >
            Upgrade to Pro
          </IconButton>
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  {:else}
    <IconButton
      href="/widgets/new"
      size="xs"
      icon={FiPlus}
      variant="translucent"
      class="rounded-none">New</IconButton
    >
  {/if}
</DashHeader>

{#if data.widgets.length > 0}
  <div class="p-4">
    <div class="flex flex-wrap gap-4">
      {#each data.widgets as widget}
        <a href="/widgets/{widget}">
          {#if browser}
            <img
              src="/api/widgets/{widget}?svg&v={uuid4()}"
              alt="MEMsched Widget"
              class="h-[85px]"
            />
          {/if}
        </a>
      {/each}
    </div>
  </div>
{:else}
  <div class="flex flex-grow flex-col items-center justify-center p-6">
    <CreateNew title="Create your first widget" icon={IoCubeOutline} href="/widgets/new" />
  </div>
{/if}
