<script lang="ts">
  import { type PageProps } from './$types';
  import { v4 as uuid4 } from 'uuid';
  import CreateNew from '$lib/components/CreateNew.svelte';
  import { IoCubeOutline, IoFolderOpenOutline, IoAdd, IoArrowForward } from 'svelte-icons-pack/io';
  import HomeLayout from '$lib/components/layouts/HomeLayout.svelte';
  import IconButton from '$lib/components/ui/IconButton.svelte';
  import { HEADER_HEIGHT, SUB_NAV_HEIGHT } from '$lib/constants';
  import { browser } from '$app/environment';
  import TabNavLink from '$lib/components/headers/TabNavLink.svelte';
  import type { Page } from '@sveltejs/kit';

  const { data }: PageProps = $props();

  // Custom isActive functions for the tabs
  const isActiveTab = (page: Page) =>
    page.url.pathname === '/widgets' && !page.url.searchParams.has('completed');

  const isCompletedTab = (page: Page) => page.url.searchParams.has('completed');
</script>

{#if data.objectives.length > 0}
  <HomeLayout container={false}>
    <div
      class="sticky flex items-center border-b bg-white"
      style="top: {HEADER_HEIGHT}px; height: {SUB_NAV_HEIGHT}px;"
    >
      <div class="mx-auto flex w-full max-w-screen-xl items-center justify-between px-6 lg:px-10">
        <div class="flex gap-4">
          <TabNavLink name="Active" href="/widgets" isActive={isActiveTab} />
          <TabNavLink name="Completed" href="/widgets?completed" isActive={isCompletedTab} />
        </div>
        <IconButton href="/widgets/new" size="sm" icon={IoAdd} variant="translucent">New</IconButton
        >
      </div>
    </div>
    {#if data.widgets.length > 0}
      <div class="mx-auto w-full max-w-screen-xl p-6 lg:px-10">
        <div class="flex flex-wrap gap-4">
          {#each data.widgets as widget}
            <a href="/widgets/{widget}">
              {#if browser}
                <img
                  src="/api/widgets/{widget}?svg&v={uuid4()}"
                  alt="MEMsched Widget"
                  class="h-[90px]"
                />
              {/if}
            </a>
          {/each}
        </div>
      </div>
    {:else}
      <div class="flex flex-grow flex-col items-center justify-center p-6">
        {#if data.isCompleted}
          <CreateNew
            title="No completed widgets"
            description="You haven't completed any widgets with fixed goals yet."
            buttonText="View active widgets"
            href="/widgets"
            icon={IoCubeOutline}
            buttonIcon={IoArrowForward}
          />
        {:else}
          <CreateNew title="Create your first widget" icon={IoCubeOutline} href="/widgets/new" />
        {/if}
      </div>
    {/if}
  </HomeLayout>
{:else}
  <HomeLayout>
    <div class="flex flex-grow flex-col items-center justify-center">
      <CreateNew
        title="Create your first objective in order to create a widget"
        icon={IoFolderOpenOutline}
        href="/objectives/new"
      />
    </div>
  </HomeLayout>
{/if}
