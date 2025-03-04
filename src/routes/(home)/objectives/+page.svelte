<script lang="ts">
  import type { PageProps } from './$types';
  import { Icon } from 'svelte-icons-pack';
  import { IoAdd, IoEllipsisHorizontal, IoFolderOpenOutline } from 'svelte-icons-pack/io';
  import CreateNew from '$lib/components/CreateNew.svelte';
  import HomeLayout from '$lib/components/layouts/HomeLayout.svelte';
  import { HEADER_HEIGHT } from '$lib/constants';
  import IconButton from '$lib/components/ui/IconButton.svelte';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
  import {
    FiDelete,
    FiEdit,
    FiEdit2,
    FiEdit3,
    FiPlusCircle,
    FiTrash,
    FiTrash2,
  } from 'svelte-icons-pack/fi';

  const { data }: PageProps = $props();

  const SUB_NAV_HEIGHT = 55;
</script>

{#if data.objectives.length > 0}
  <main style="margin-top: {HEADER_HEIGHT}px">
    <div
      class="sticky flex h-[{SUB_NAV_HEIGHT}px] items-center border-b bg-white"
      style="top: {HEADER_HEIGHT}px"
    >
      <div class="mx-auto flex w-full max-w-screen-xl justify-between px-6 lg:px-10">
        <div></div>
        <IconButton href="/objectives/new" size="sm" icon={IoAdd}>New</IconButton>
      </div>
    </div>
    <div class="w-full">
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th
              class="sticky z-10 bg-background text-left font-semibold"
              style="top: {HEADER_HEIGHT + SUB_NAV_HEIGHT}px;"
            >
              <div class="mx-auto max-w-screen-xl px-6 lg:px-10">
                <div class="grid w-full grid-cols-12 gap-4 py-3">
                  <div class="col-span-4">Name</div>
                  <div class="col-span-2">Progress</div>
                  <div class="col-span-2">Type</div>
                  <div class="col-span-2">Visibility</div>
                  <div class="col-span-2"></div>
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
                    <div class="col-span-2">
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                          <Icon src={IoEllipsisHorizontal} size="22" />
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content class="w-40">
                          <DropdownMenu.Group>
                            <DropdownMenu.Item>
                              <Icon src={FiPlusCircle} className="!text-muted-foreground" />
                              <!-- TODO: Add log endpoint -->
                              <a href="/objectives/{objective.id}/edit">Log</a>
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator />
                            <DropdownMenu.Item>
                              <Icon src={FiEdit3} className="!text-muted-foreground" />
                              <a href="/objectives/{objective.id}">Edit</a>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item class="!text-red-600 hover:!bg-red-600/5">
                              <Icon src={FiTrash2} className="!text-red-600/60" />
                              <!-- TODO: Add delete endpoint -->
                              <button>Delete</button>
                            </DropdownMenu.Item>
                          </DropdownMenu.Group>
                        </DropdownMenu.Content>
                      </DropdownMenu.Root>
                    </div>
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
