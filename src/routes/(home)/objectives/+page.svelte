<script lang="ts">
  import CreateNew from '$lib/components/CreateNew.svelte';
  import { IoFolderOpenOutline } from 'svelte-icons-pack/io';
  import type { PageProps } from './$types';
  import HomeLayout from '$lib/components/layouts/HomeLayout.svelte';

  const { data }: PageProps = $props();
</script>

{#if data.objectives.length > 0}
  <div class="h-[50px] border-b bg-white"></div>
  <div class="w-full border-b">
    <div
      class="mx-auto flex h-[50px] max-w-screen-xl items-center divide-x px-6 font-semibold *:flex *:h-full *:items-center *:p-4 lg:px-10"
    >
      <div class="basis-[30%]">Name</div>
      <div class="basis-[20%]">Progress</div>
      <div class="basis-[10%]">Type</div>
      <div class="basis-[10%]">Visibility</div>
      <div class="basis-[30%]">Actions</div>
    </div>
  </div>
  {#each data.objectives as objective}
    <div class="w-full border-b">
      <div
        class="mx-auto flex h-[50px] max-w-screen-xl items-center divide-x px-6 *:flex *:h-full *:items-center *:p-4 lg:px-10"
      >
        <div class="basis-[30%]">{objective.name}</div>
        <div class="basis-[20%]">{objective.value}</div>
        <div class="basis-[10%]">{objective.goalType}</div>
        <div class="basis-[10%]">{objective.visibility}</div>
        <div class="basis-[30%]">...</div>
      </div>
    </div>
  {/each}
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
