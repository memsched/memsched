<script lang="ts">
  import CreateNew from '$lib/components/CreateNew.svelte';
  import { IoFolderOpenOutline } from 'svelte-icons-pack/io';
  import type { PageProps } from './$types';
  import HomeLayout from '$lib/components/layouts/HomeLayout.svelte';

  const { data }: PageProps = $props();
</script>

{#if data.objectives.length > 0}
  <div class="h-[55px] bg-white"></div>
  <HomeLayout>
    <pre>{JSON.stringify(data.objectives, null, 2)}</pre>
  </HomeLayout>
{:else}
  <HomeLayout>
    <div class="flex flex-grow flex-col items-center justify-center">
      <CreateNew
        title="Create your first objective"
        icon={IoFolderOpenOutline}
        href="/objectives/new"
      />
    </div>
  </HomeLayout>
{/if}
