<script lang="ts">
  import { type PageProps } from './$types';
  import { v4 as uuid4 } from 'uuid';
  import CreateNew from '$lib/components/CreateNew.svelte';
  import { IoCubeOutline, IoFolderOpenOutline, IoAdd } from 'svelte-icons-pack/io';
  import HomeLayout from '$lib/components/layouts/HomeLayout.svelte';
  import IconButton from '$lib/components/ui/IconButton.svelte';
  import { HEADER_HEIGHT, SUB_NAV_HEIGHT } from '$lib/constants';
  import { browser } from '$app/environment';

  const { data }: PageProps = $props();
</script>

{#if data.objectives.length > 0}
  {#if data.widgets.length > 0}
    <HomeLayout class="block" container={false}>
      <div
        class="sticky flex items-center border-b bg-white"
        style="top: {HEADER_HEIGHT}px; height: {SUB_NAV_HEIGHT}px;"
      >
        <div class="mx-auto flex w-full max-w-screen-xl justify-between px-6 lg:px-10">
          <div></div>
          <IconButton href="/widgets/new" size="sm" icon={IoAdd}>New</IconButton>
        </div>
      </div>
      <div class="mx-auto flex max-w-screen-xl flex-wrap gap-4 p-6 lg:px-10">
        {#each data.widgets as widget}
          <a href="/widgets/{widget}">
            {#if browser}
              <img
                src="/api/widgets/{widget}?svg&v={uuid4()}"
                alt="MEMsched Widget"
                class="h-[110px]"
              />
            {/if}
          </a>
        {/each}
      </div>
    </HomeLayout>
  {:else}
    <HomeLayout>
      <div class="flex flex-grow flex-col items-center justify-center">
        <CreateNew title="Create your first widget" icon={IoCubeOutline} href="/widgets/new" />
      </div>
    </HomeLayout>
  {/if}
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
