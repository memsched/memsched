<script lang="ts">
  import toast from 'svelte-french-toast';
  import { Icon } from 'svelte-icons-pack';
  import { FiArchive, FiEdit3, FiPlus, FiRotateCcw, FiTrash2 } from 'svelte-icons-pack/fi';
  import { IoArrowForward, IoEllipsisHorizontal, IoFolderOpenOutline } from 'svelte-icons-pack/io';
  import SvelteSeo from 'svelte-seo';
  import { type SuperValidated } from 'sveltekit-superforms';

  import { enhance } from '$app/forms';
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import CreateNew from '$lib/components/CreateNew.svelte';
  import ConfirmDeleteDialog from '$lib/components/dialogs/ConfirmDeleteDialog.svelte';
  import CustomLogDialog from '$lib/components/dialogs/CustomLogDialog.svelte';
  import { type LogFormSchema } from '$lib/components/forms/objective-log-form/schema';
  import DashHeader from '$lib/components/headers/DashHeader.svelte';
  import TabNavLink from '$lib/components/headers/TabNavLink.svelte';
  import { Badge } from '$lib/components/ui/badge/index';
  import { Button } from '$lib/components/ui/button/index';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
  import IconButton from '$lib/components/ui/IconButton.svelte';
  import { Progress } from '$lib/components/ui/progress/index';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import type { Objective } from '$lib/server/db/schema';
  import { updateState } from '$lib/state.svelte';

  import type { PageProps } from './$types';

  const { data, form }: PageProps = $props();

  // Show toast message when form action completes successfully
  $effect(() => {
    if (form?.success && form?.message) {
      toast.success(form.message);
    }
    if (form?.error) {
      toast.error(form.error);
    }
  });

  // Custom isActive functions for the tabs
  const isActiveTab = $derived(
    page.url.pathname === '/objectives' &&
      !page.url.searchParams.has('archived') &&
      !page.url.searchParams.has('completed')
  );

  const isArchivedTab = $derived(page.url.searchParams.has('archived'));
  const isCompletedTab = $derived(page.url.searchParams.has('completed'));

  const pageTitle = $derived(
    data.isArchived
      ? 'Archived Objectives - MEMsched'
      : data.isCompleted
        ? 'Completed Objectives - MEMsched'
        : 'Learning Objectives - MEMsched'
  );
  const pageDescription = $derived(
    'Manage your learning objectives on MEMsched. Set goals, track progress, and showcase your learning journey.'
  );

  // Function to calculate progress percentage for fixed goals
  function calculateProgress(objective: Objective): number {
    if (objective.goalType === 'fixed' && objective.endValue) {
      return Math.min(100, (objective.value / objective.endValue) * 100);
    }
    return 0;
  }
</script>

<SvelteSeo title={pageTitle} description={pageDescription} noindex={true} nofollow={true} />

<DashHeader>
  <div class="px-3 text-sm font-medium">Objectives</div>
  <TabNavLink name="Active" href="/objectives" active={isActiveTab} />
  <TabNavLink name="Completed" href="/objectives?completed" active={isCompletedTab} />
  <TabNavLink name="Archived" href="/objectives?archived" active={isArchivedTab} />
  {#if data.objectivesLimitReached}
    <Tooltip.Provider delayDuration={100}>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <IconButton disabled size="xs" icon={FiPlus} variant="translucent" class="rounded-none">
            New
          </IconButton>
        </Tooltip.Trigger>
        <Tooltip.Content side="bottom" align="center" class="flex flex-col gap-2 p-4">
          <p>
            You've reached the maximum limit of {data.maxObjectives} objectives
          </p>
          <IconButton
            icon={IoArrowForward}
            size="sm"
            href="/settings/account"
            class="animate-svg"
            data-umami-event="objectives-upgrade-to-pro-button"
          >
            Upgrade to Pro
          </IconButton>
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  {:else}
    <IconButton
      href="/objectives/new"
      size="xs"
      icon={FiPlus}
      variant="translucent"
      class="rounded-none border-none">New</IconButton
    >
  {/if}
</DashHeader>

{#if data.objectives.length > 0}
  <div class="">
    <div class="bg-back">
      <!-- Fixed header -->
      <!-- <div
        class="grid grid-cols-12 gap-20 overflow-hidden border-b px-6 text-sm font-medium text-muted-foreground *:py-3"
      >
        <div class="col-span-3">Objective</div>
        <div class="col-span-4">Progress</div>
        <div class="col-span-5">Actions</div>
      </div> -->

      <!-- Scrollable content -->
      <div class="overflow-x-auto bg-back">
        <div class="min-w-[900px] *:border-b">
          {#each data.objectives as objective}
            <div class="grid grid-cols-12 items-center gap-20 px-6 py-3.5 transition-colors">
              <!-- Objective name and badges -->
              <div class="col-span-3 flex flex-col gap-1.5">
                <div class="line-clamp-1 font-medium">{objective.name}</div>
                <div class="flex items-center gap-1.5">
                  <Badge
                    variant={objective.goalType === 'fixed' ? 'outline' : 'secondary'}
                    class="text-xs capitalize"
                  >
                    {objective.goalType}
                  </Badge>
                </div>
              </div>

              <!-- Progress section -->
              <div class="col-span-4 flex flex-col gap-1.5">
                <div class="flex items-center justify-between gap-2 text-sm">
                  <span class="text-muted-foreground">
                    {#if objective.goalType === 'fixed'}
                      {objective.value} / {objective.endValue} {objective.unit}
                    {:else}
                      {objective.value} {objective.unit}
                    {/if}
                  </span>
                  {#if objective.goalType === 'fixed'}
                    <span class="font-medium">{Math.round(calculateProgress(objective))}%</span>
                  {/if}
                </div>
                {#if objective.goalType === 'fixed'}
                  <Progress value={calculateProgress(objective)} class="h-2" />
                {/if}
              </div>

              <!-- Actions section -->
              <div class="col-span-5 flex items-center justify-between">
                <div class="flex flex-wrap items-center gap-2">
                  <form
                    action="?/log"
                    method="POST"
                    use:enhance={() => {
                      return async ({ update }) => {
                        updateState.widgetCounter++;
                        update();
                      };
                    }}
                  >
                    <input type="hidden" name="objectiveId" value={objective.id} />
                    <input type="hidden" name="value" value="1" />
                    <Button size="xs" variant="outline" class="h-7 px-2" type="submit">+1</Button>
                  </form>

                  <form
                    action="?/log"
                    method="POST"
                    use:enhance={() => {
                      return async ({ update }) => {
                        updateState.widgetCounter++;
                        update();
                      };
                    }}
                  >
                    <input type="hidden" name="objectiveId" value={objective.id} />
                    <input type="hidden" name="value" value="5" />
                    <Button size="xs" variant="outline" class="h-7 px-2" type="submit">+5</Button>
                  </form>

                  <form
                    action="?/log"
                    method="POST"
                    use:enhance={() => {
                      return async ({ update }) => {
                        updateState.widgetCounter++;
                        update();
                      };
                    }}
                  >
                    <input type="hidden" name="objectiveId" value={objective.id} />
                    <input type="hidden" name="value" value="10" />
                    <Button size="xs" variant="outline" class="h-7 px-2" type="submit">+10</Button>
                  </form>

                  <form
                    action="?/undoLog"
                    method="POST"
                    use:enhance={() => {
                      return async ({ update }) => {
                        updateState.widgetCounter++;
                        update();
                      };
                    }}
                  >
                    <input type="hidden" name="objectiveId" value={objective.id} />
                    <Button
                      size="xs"
                      variant="outline"
                      type="submit"
                      class="flex h-7 items-center gap-1 px-2"
                      title="Undo last log"
                    >
                      <Icon src={FiRotateCcw} size="14" />
                    </Button>
                  </form>

                  <CustomLogDialog {objective} form={data.form as SuperValidated<LogFormSchema>} />
                </div>

                <ConfirmDeleteDialog
                  action="/objectives/delete"
                  name="objectiveId"
                  value={objective.id}
                >
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger
                      class="flex h-8 w-8 items-center justify-center rounded-full p-1 hover:bg-muted"
                    >
                      <Icon src={IoEllipsisHorizontal} size="18" />
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content class="w-40">
                      <DropdownMenu.Group>
                        <DropdownMenu.Item class="cursor-pointer">
                          {#snippet child({ props })}
                            <a href={resolve(`/objectives/${objective.id}`)} {...props}>
                              <Icon src={FiEdit3} className="!text-muted-foreground" />
                              Edit
                            </a>
                          {/snippet}
                        </DropdownMenu.Item>
                        <DropdownMenu.Item class="w-full cursor-pointer">
                          {#snippet child({ props })}
                            <form action="?/toggleArchive" method="POST" use:enhance>
                              <input type="hidden" name="objectiveId" value={objective.id} />
                              <input
                                type="hidden"
                                name="archived"
                                value={objective.archived ? 'true' : 'false'}
                              />
                              <button
                                type="submit"
                                class="flex w-full items-center gap-2 px-2 py-1.5"
                                {...props}
                              >
                                <Icon src={FiArchive} className="!text-muted-foreground" />
                                {objective.archived ? 'Unarchive' : 'Archive'}
                              </button>
                            </form>
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
          {/each}
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="flex flex-grow flex-col items-center justify-center p-6">
    {#if data.isArchived}
      <CreateNew
        title="No archived objectives"
        description="You haven't archived any objectives yet."
        buttonText="View active objectives"
        href="/objectives"
        icon={IoFolderOpenOutline}
        buttonIcon={IoArrowForward}
      />
    {:else if data.isCompleted}
      <CreateNew
        title="No completed objectives"
        description="You haven't completed any fixed objectives yet."
        buttonText="View active objectives"
        href="/objectives"
        icon={IoFolderOpenOutline}
        buttonIcon={IoArrowForward}
      />
    {:else}
      <CreateNew
        title="Create your first objective"
        icon={IoFolderOpenOutline}
        href="/objectives/new"
      />
    {/if}
  </div>
{/if}
