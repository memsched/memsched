<script lang="ts">
  import CreateNew from '$lib/components/CreateNew.svelte';
  import { IoCubeOutline, IoFolderOpenOutline } from 'svelte-icons-pack/io';
  import { type PageProps } from './$types';

  const { data }: PageProps = $props();
</script>

{#if data.objectives.length > 0}
  {#if data.widgets.length > 0}
    <div class="flex gap-6">
      {#each data.widgets as widget}
        <a href="/widgets/{widget}">
          <img src="/api/widgets/{widget}?svg" alt="MEMsched Widget" class="h-[100px]" />
        </a>
      {/each}
    </div>
  {:else}
    <div class="flex flex-grow flex-col items-center justify-center">
      <CreateNew title="Create your first widget" icon={IoCubeOutline} href="/widgets/new" />
    </div>
  {/if}
{:else}
  <div class="flex flex-grow flex-col items-center justify-center">
    <CreateNew
      title="Create your first objective in order to create a widget"
      icon={IoFolderOpenOutline}
      href="/objectives/new"
    />
  </div>
{/if}
