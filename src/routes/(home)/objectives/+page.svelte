<script lang="ts">
  import CreateNew from '$lib/components/CreateNew.svelte';
  import { IoFolderOpenOutline } from 'svelte-icons-pack/io';
  import type { PageProps } from './$types';
  import HomeLayout from '$lib/components/layouts/HomeLayout.svelte';
  import { HEADER_HEIGHT } from '$lib/constants';

  const { data }: PageProps = $props();
</script>

{#if data.objectives.length > 0}
  <main style="margin-top: {HEADER_HEIGHT}px">
    <div class="sticky h-[50px] w-full border-b bg-white" style="top: {HEADER_HEIGHT}px"></div>
    <div class="w-full">
      <table class="w-full border-collapse">
        <thead class="">
          <tr>
            <th
              class="sticky z-10 bg-background text-left font-semibold"
              style="top: {HEADER_HEIGHT + 50}px;"
            >
              <div class="mx-auto max-w-screen-xl px-6 lg:px-10">
                <div class="grid w-full grid-cols-12 gap-4 py-3">
                  <div class="col-span-4">Name</div>
                  <div class="col-span-2">Progress</div>
                  <div class="col-span-2">Type</div>
                  <div class="col-span-2">Visibility</div>
                  <div class="col-span-2">Actions</div>
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {#each data.objectives as objective}
            <tr class="border-b">
              <td>
                <div class="mx-auto max-w-screen-xl px-6 lg:px-10">
                  <div class="grid w-full grid-cols-12 gap-4 py-3">
                    <div class="col-span-4 overflow-hidden text-ellipsis whitespace-nowrap">
                      {objective.name}
                    </div>
                    <div class="col-span-2">{objective.value}</div>
                    <div class="col-span-2">{objective.goalType}</div>
                    <div class="col-span-2">{objective.visibility}</div>
                    <div class="col-span-2">...</div>
                  </div>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </main>
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

<style>
  table thead th {
    border-top: none !important;
    border-bottom: none !important;
    box-shadow: inset 0 -1px 0 theme('colors.border');
  }
</style>
