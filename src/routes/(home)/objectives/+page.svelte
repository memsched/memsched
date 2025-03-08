<script lang="ts">
  import type { PageProps } from './$types';
  import { Icon } from 'svelte-icons-pack';
  import {
    IoAdd,
    IoDocumentLockOutline,
    IoEllipsisHorizontal,
    IoFolderOpenOutline,
    IoGlobeOutline,
  } from 'svelte-icons-pack/io';
  import { FiEdit3, FiPlusCircle, FiTrash2 } from 'svelte-icons-pack/fi';
  import CreateNew from '$lib/components/CreateNew.svelte';
  import HomeLayout from '$lib/components/layouts/HomeLayout.svelte';
  import { HEADER_HEIGHT, SUB_NAV_HEIGHT } from '$lib/constants';
  import IconButton from '$lib/components/ui/IconButton.svelte';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import ConfirmDeleteDialog from '$lib/components/dialogs/ConfirmDeleteDialog.svelte';
  import { capitalize } from '$lib/utils';

  const { data }: PageProps = $props();
</script>

{#if data.objectives.length > 0}
  <HomeLayout container={false}>
    <div
      class="sticky flex items-center border-b bg-white"
      style="top: {HEADER_HEIGHT}px; height: {SUB_NAV_HEIGHT}px;"
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
              class="sticky z-10 bg-back text-left font-semibold"
              style="top: {HEADER_HEIGHT + SUB_NAV_HEIGHT}px;"
            >
              <div class="mx-auto max-w-screen-xl px-6 lg:px-10">
                <div class="grid w-full grid-cols-12 gap-4 py-3">
                  <div class="col-span-4">Name</div>
                  <div class="col-span-3">Progress</div>
                  <div class="col-span-2">Type</div>
                  <div class="col-span-2">Visibility</div>
                  <div class="col-span-1"></div>
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {#each data.objectives as objective}
            <tr class="border-b">
              <td>
                <a href="/objectives/{objective.id}">
                  <div class="mx-auto max-w-screen-xl px-6 lg:px-10">
                    <div class="grid w-full grid-cols-12 items-center gap-4 py-3">
                      <div class="col-span-4 overflow-hidden text-ellipsis whitespace-nowrap">
                        {objective.name}
                      </div>
                      <div class="col-span-3 overflow-hidden text-ellipsis whitespace-nowrap">
                        {#if objective.goalType === 'fixed'}
                          {objective.value} / {objective.endValue}
                          {objective.unit}
                        {:else}
                          {objective.value}
                          {objective.unit}
                        {/if}
                      </div>
                      <div class="col-span-2">{capitalize(objective.goalType)}</div>
                      <div class="col-span-2 flex items-center gap-2">
                        {#if objective.visibility === 'public'}
                          <Icon src={IoGlobeOutline} className="size-6 *:!stroke-[16px]" />
                        {:else}
                          <Icon src={IoDocumentLockOutline} className="size-6 *:!stroke-[16px]" />
                        {/if}
                        {capitalize(objective.visibility)}
                      </div>
                      <div class="col-span-1 flex items-center">
                        <ConfirmDeleteDialog
                          action="/objectives/delete"
                          name="objectiveId"
                          value={objective.id}
                        >
                          <DropdownMenu.Root>
                            <DropdownMenu.Trigger>
                              <Icon src={IoEllipsisHorizontal} size="22" />
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content class="w-40">
                              <DropdownMenu.Group>
                                <!-- TODO: Add log endpoint -->
                                <DropdownMenu.Item class="cursor-pointer">
                                  {#snippet child({ props })}
                                    <a {...props}>
                                      <Icon src={FiPlusCircle} className="!text-muted-foreground" />
                                      Log
                                    </a>
                                  {/snippet}
                                </DropdownMenu.Item>
                                <DropdownMenu.Separator />
                                <DropdownMenu.Item class="cursor-pointer">
                                  {#snippet child({ props })}
                                    <a href="/objectives/{objective.id}" {...props}>
                                      <Icon src={FiEdit3} className="!text-muted-foreground" />
                                      Edit
                                    </a>
                                  {/snippet}
                                </DropdownMenu.Item>
                                <DropdownMenu.Item
                                  class="w-full cursor-pointer !text-red-600 hover:!bg-red-600/5"
                                >
                                  {#snippet child({ props })}
                                    <Dialog.Trigger {...props}>
                                      <Icon src={FiTrash2} className="!text-red-600/60" />
                                      Delete
                                    </Dialog.Trigger>
                                  {/snippet}
                                </DropdownMenu.Item>
                              </DropdownMenu.Group>
                            </DropdownMenu.Content>
                          </DropdownMenu.Root>
                        </ConfirmDeleteDialog>
                      </div>
                    </div>
                  </div>
                </a>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
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

<style>
  table thead th {
    border-top: none !important;
    border-bottom: none !important;
    box-shadow: inset 0 -1px 0 theme('colors.border');
  }
</style>
