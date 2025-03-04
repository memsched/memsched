<script lang="ts">
  import type { PageProps } from './$types';
  import { enhance } from '$app/forms';
  import { Icon } from 'svelte-icons-pack';
  import { IoAdd, IoEllipsisHorizontal, IoFolderOpenOutline } from 'svelte-icons-pack/io';
  import { FiEdit3, FiPlusCircle, FiTrash2 } from 'svelte-icons-pack/fi';
  import CreateNew from '$lib/components/CreateNew.svelte';
  import HomeLayout from '$lib/components/layouts/HomeLayout.svelte';
  import { HEADER_HEIGHT } from '$lib/constants';
  import IconButton from '$lib/components/ui/IconButton.svelte';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { Button } from '$lib/components/ui/button';

  const { data }: PageProps = $props();

  const SUB_NAV_HEIGHT = 55;
</script>

{#if data.objectives.length > 0}
  <main style="margin-top: {HEADER_HEIGHT}px">
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
                      <Dialog.Root>
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger>
                            <Icon src={IoEllipsisHorizontal} size="22" />
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Content class="w-40">
                            <DropdownMenu.Group>
                              <!-- TODO: Add log endpoint -->
                              <DropdownMenu.Item class="cursor-pointer">
                                {#snippet child({ props })}
                                  <a href="" {...props}>
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
                        <Dialog.Content>
                          <Dialog.Header>
                            <Dialog.Title>Are you absolutely sure?</Dialog.Title>
                          </Dialog.Header>
                          <Dialog.Description>
                            This action cannot be undone. This will permanently delete the
                            objective.
                          </Dialog.Description>
                          <Dialog.Footer>
                            <form action="/objectives/delete" method="POST" use:enhance>
                              <input type="hidden" name="objectiveId" value={objective.id} />
                              <Dialog.Close>
                                {#snippet child({ props })}
                                  <Button type="submit" variant="destructive" {...props}>
                                    Delete
                                  </Button>
                                {/snippet}
                              </Dialog.Close>
                            </form>
                          </Dialog.Footer>
                        </Dialog.Content>
                      </Dialog.Root>
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
