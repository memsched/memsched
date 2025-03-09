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
  import * as Card from '$lib/components/ui/card/index';
  import { Badge } from '$lib/components/ui/badge/index';
  import { Progress } from '$lib/components/ui/progress/index';
  import { Button } from '$lib/components/ui/button/index';
  import type { Objective } from '$lib/server/db/schema';

  const { data }: PageProps = $props();

  // Function to calculate progress percentage for fixed goals
  function calculateProgress(objective: Objective): number {
    if (objective.goalType === 'fixed' && objective.endValue) {
      return Math.min(100, (objective.value / objective.endValue) * 100);
    }
    return 0;
  }

  // Function to handle quick log of progress
  function handleQuickLog(objective: Objective, amount: number): void {
    // This would be replaced with actual form submission logic
    console.log(`Logging ${amount} ${objective.unit} for ${objective.name}`);
    // TODO: Implement actual form submission
  }
</script>

{#if data.objectives.length > 0}
  <HomeLayout container={false}>
    <div
      class="sticky flex items-center border-b bg-white"
      style="top: {HEADER_HEIGHT}px; height: {SUB_NAV_HEIGHT}px;"
    >
      <div class="mx-auto flex w-full max-w-screen-xl items-center justify-between px-6 lg:px-10">
        <div class="text-lg font-medium">Your Objectives</div>
        <IconButton href="/objectives/new" size="sm" icon={IoAdd}>New</IconButton>
      </div>
    </div>

    <div class="mx-auto w-full max-w-screen-xl p-6 lg:px-10">
      <div class="flex flex-wrap gap-6">
        {#each data.objectives as objective}
          <Card.Root class="overflow-hidden transition-all">
            <Card.Header class="pb-2">
              <div class="flex items-center justify-between">
                <Card.Title class="line-clamp-1 text-lg">{objective.name}</Card.Title>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger class="h-8 w-8 rounded-full p-1 hover:bg-muted">
                    <Icon src={IoEllipsisHorizontal} size="22" />
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content class="w-40">
                    <DropdownMenu.Group>
                      <DropdownMenu.Item class="cursor-pointer">
                        {#snippet child({ props })}
                          <a href="/objectives/{objective.id}" {...props}>
                            <Icon src={FiEdit3} className="!text-muted-foreground" />
                            Edit
                          </a>
                        {/snippet}
                      </DropdownMenu.Item>
                      <ConfirmDeleteDialog
                        action="/objectives/delete"
                        name="objectiveId"
                        value={objective.id}
                      >
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
                      </ConfirmDeleteDialog>
                    </DropdownMenu.Group>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </div>
              <div class="flex items-center gap-2">
                <Badge
                  variant={objective.goalType === 'fixed' ? 'outline' : 'secondary'}
                  class="capitalize"
                >
                  {objective.goalType}
                </Badge>
                <Badge
                  variant={objective.visibility === 'public' ? 'default' : 'outline'}
                  class="flex items-center gap-1 capitalize"
                >
                  {#if objective.visibility === 'public'}
                    <Icon src={IoGlobeOutline} className="size-3.5" />
                  {:else}
                    <Icon src={IoDocumentLockOutline} className="size-3.5" />
                  {/if}
                  {objective.visibility}
                </Badge>
              </div>
            </Card.Header>

            <Card.Content class="pb-2">
              <div class="mb-2 flex items-center justify-between">
                <div class="text-sm text-muted-foreground">Current progress:</div>
                <div class="font-medium">
                  {#if objective.goalType === 'fixed'}
                    {objective.value} / {objective.endValue} {objective.unit}
                  {:else}
                    {objective.value} {objective.unit}
                  {/if}
                </div>
              </div>

              {#if objective.goalType === 'fixed'}
                <Progress value={calculateProgress(objective)} class="h-2" />
              {/if}
            </Card.Content>

            <Card.Footer class="flex pt-2">
              <div class="flex items-center gap-2">
                {#if objective.goalType === 'fixed'}
                  <Button
                    size="xs"
                    variant="translucent"
                    onclick={() => handleQuickLog(objective, 1)}
                  >
                    +1 {objective.unit}
                  </Button>
                  <Button
                    size="xs"
                    variant="translucent"
                    onclick={() => handleQuickLog(objective, 5)}
                  >
                    +5 {objective.unit}
                  </Button>
                  <Button
                    size="xs"
                    variant="translucent"
                    onclick={() => handleQuickLog(objective, 10)}
                  >
                    +10 {objective.unit}
                  </Button>
                {:else}
                  <Button
                    size="xs"
                    variant="translucent"
                    onclick={() => handleQuickLog(objective, 1)}
                  >
                    Log {objective.unit}
                  </Button>
                {/if}
                <div class="ml-auto">
                  <Button
                    size="xs"
                    variant="secondary"
                    class="flex items-center gap-1"
                    onclick={() => {
                      /* Open custom log dialog */
                    }}
                  >
                    <Icon src={FiPlusCircle} size="14" />
                    Custom
                  </Button>
                </div>
              </div>
            </Card.Footer>
          </Card.Root>
        {/each}
      </div>
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
  /* No additional styles needed */
</style>
