<script lang="ts">
  import type { PageProps } from './$types';
  import {
    IoAdd,
    IoFolderOpenOutline,
    IoArrowForward,
    IoEllipsisHorizontal,
    IoGlobeOutline,
    IoDocumentLockOutline,
  } from 'svelte-icons-pack/io';
  import { FiEdit3, FiTrash2, FiRotateCcw, FiPlus, FiArchive } from 'svelte-icons-pack/fi';
  import CreateNew from '$lib/components/CreateNew.svelte';
  import HomeLayout from '$lib/components/layouts/HomeLayout.svelte';
  import { HEADER_HEIGHT, SUB_NAV_HEIGHT } from '$lib/constants';
  import IconButton from '$lib/components/ui/IconButton.svelte';
  import { Icon } from 'svelte-icons-pack';
  import toast from 'svelte-french-toast';
  import { type SuperValidated } from 'sveltekit-superforms';
  import { type LogFormSchema } from '$lib/components/forms/objective-log-form/schema';
  import TabNavLink from '$lib/components/headers/TabNavLink.svelte';
  import type { Page } from '@sveltejs/kit';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import SvelteSeo from 'svelte-seo';
  import { DOMAIN } from '$lib/constants';
  import { Badge } from '$lib/components/ui/badge/index';
  import { Progress } from '$lib/components/ui/progress/index';
  import { Button } from '$lib/components/ui/button/index';
  import { enhance } from '$app/forms';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
  import * as Dialog from '$lib/components/ui/dialog';
  import ConfirmDeleteDialog from '$lib/components/dialogs/ConfirmDeleteDialog.svelte';
  import CustomLogDialog from '$lib/components/dialogs/CustomLogDialog.svelte';
  import type { Objective } from '$lib/server/db/schema';

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
  const isActiveTab = (page: Page) =>
    page.url.pathname === '/objectives' &&
    !page.url.searchParams.has('archived') &&
    !page.url.searchParams.has('completed');

  const isArchivedTab = (page: Page) => page.url.searchParams.has('archived');
  const isCompletedTab = (page: Page) => page.url.searchParams.has('completed');

  const pageTitle = data.isArchived
    ? 'Archived Objectives - MEMsched'
    : data.isCompleted
      ? 'Completed Objectives - MEMsched'
      : 'Learning Objectives - MEMsched';
  const pageDescription =
    'Manage your learning objectives on MEMsched. Set goals, track progress, and showcase your learning journey.';

  // Function to calculate progress percentage for fixed goals
  function calculateProgress(objective: Objective): number {
    if (objective.goalType === 'fixed' && objective.endValue) {
      return Math.min(100, (objective.value / objective.endValue) * 100);
    }
    return 0;
  }
</script>

<SvelteSeo
  title={pageTitle}
  description={pageDescription}
  openGraph={{
    title: pageTitle,
    description: pageDescription,
    url: `${DOMAIN}/objectives${data.isArchived ? '?archived' : data.isCompleted ? '?completed' : ''}`,
    type: 'website',
    site_name: 'MEMsched',
  }}
  twitter={{
    card: 'summary',
    site: '@memsched',
    title: pageTitle,
    description: pageDescription,
  }}
/>

<HomeLayout container={false}>
  {#if data.user !== null}
    <div
      class="sticky flex items-center border-b bg-background"
      style="top: {HEADER_HEIGHT}px; height: {SUB_NAV_HEIGHT}px;"
    >
      <div class="main-container flex items-center justify-between">
        <div class="flex gap-4">
          <TabNavLink name="Active" href="/objectives" isActive={isActiveTab} />
          <TabNavLink name="Completed" href="/objectives?completed" isActive={isCompletedTab} />
          <TabNavLink name="Archived" href="/objectives?archived" isActive={isArchivedTab} />
        </div>
        {#if !data.isArchived && !data.isCompleted && data.objectivesLimitReached}
          <Tooltip.Provider delayDuration={100}>
            <Tooltip.Root>
              <Tooltip.Trigger class="cursor-not-allowed">
                <IconButton size="sm" icon={IoAdd} variant="outline" disabled>New</IconButton>
              </Tooltip.Trigger>
              <Tooltip.Content side="left" align="center">
                <p>You've reached the maximum limit of {data.maxObjectives} objectives</p>
              </Tooltip.Content>
            </Tooltip.Root>
          </Tooltip.Provider>
        {:else}
          <IconButton
            href="/objectives/new"
            size="sm"
            icon={IoAdd}
            variant="translucent"
            disabled={!data.isArchived && !data.isCompleted && data.objectivesLimitReached}
            >New</IconButton
          >
        {/if}
      </div>
    </div>
  {/if}
  {#if data.objectives.length > 0}
    <div class="main-container py-6">
      <div class="rounded-md border bg-background">
        <!-- Fixed header -->
        <div
          class="grid grid-cols-12 gap-20 overflow-hidden border-b px-6 py-3 text-sm font-medium text-muted-foreground"
        >
          <div class="col-span-3">Objective</div>
          <div class="col-span-4">Progress</div>
          <div class="col-span-5">Actions</div>
        </div>

        <!-- Scrollable content -->
        <div class="overflow-x-auto">
          <div class="min-w-[900px] divide-y">
            {#each data.objectives as objective}
              <div class="grid grid-cols-12 items-center gap-20 px-6 py-3.5 transition-colors">
                <!-- Objective name and badges -->
                <div class="col-span-3 flex flex-col gap-1.5">
                  <div class="line-clamp-1 font-medium">{objective.name}</div>
                  <div class="flex items-center gap-1.5">
                    <Badge
                      variant={objective.visibility === 'public' ? 'default' : 'outline'}
                      class="flex items-center gap-1 text-xs capitalize"
                    >
                      {#if objective.visibility === 'public'}
                        <Icon src={IoGlobeOutline} className="size-3" />
                      {:else}
                        <Icon src={IoDocumentLockOutline} className="size-3" />
                      {/if}
                      {objective.visibility}
                    </Badge>
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
                    {#if objective.goalType === 'fixed'}
                      <form action="?/log" method="POST" use:enhance>
                        <input type="hidden" name="objectiveId" value={objective.id} />
                        <input type="hidden" name="value" value="1" />
                        <Button size="xs" variant="outline" class="h-7 px-2" type="submit"
                          >+1</Button
                        >
                      </form>

                      <form action="?/log" method="POST" use:enhance>
                        <input type="hidden" name="objectiveId" value={objective.id} />
                        <input type="hidden" name="value" value="5" />
                        <Button size="xs" variant="outline" class="h-7 px-2" type="submit"
                          >+5</Button
                        >
                      </form>

                      <form action="?/log" method="POST" use:enhance>
                        <input type="hidden" name="objectiveId" value={objective.id} />
                        <input type="hidden" name="value" value="10" />
                        <Button size="xs" variant="outline" class="h-7 px-2" type="submit"
                          >+10</Button
                        >
                      </form>
                    {:else}
                      <form action="?/log" method="POST" use:enhance>
                        <input type="hidden" name="objectiveId" value={objective.id} />
                        <input type="hidden" name="value" value="1" />
                        <Button size="xs" variant="outline" class="h-7 px-2" type="submit"
                          >Log</Button
                        >
                      </form>
                    {/if}

                    <form action="?/undoLog" method="POST" use:enhance>
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

                    <CustomLogDialog
                      {objective}
                      form={data.form as SuperValidated<LogFormSchema>}
                    />
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
                              <a href="/objectives/{objective.id}" {...props}>
                                <Icon src={FiEdit3} className="!text-muted-foreground" />
                                Edit
                              </a>
                            {/snippet}
                          </DropdownMenu.Item>
                          {#if data.widgetsLimitReached}
                            <Tooltip.Provider delayDuration={100}>
                              <Tooltip.Root>
                                <Tooltip.Trigger class="cursor-not-allowed">
                                  <DropdownMenu.Item disabled>
                                    <Icon src={FiPlus} className="!text-muted-foreground" />
                                    Create widget
                                  </DropdownMenu.Item>
                                </Tooltip.Trigger>
                                <Tooltip.Content side="right" align="center">
                                  <p>
                                    You've reached the maximum limit of {data.maxWidgets} widgets
                                  </p>
                                </Tooltip.Content>
                              </Tooltip.Root>
                            </Tooltip.Provider>
                          {:else}
                            <DropdownMenu.Item class="cursor-pointer">
                              {#snippet child({ props })}
                                <a href="/widgets/new?objectiveId={objective.id}" {...props}>
                                  <Icon src={FiPlus} className="!text-muted-foreground" />
                                  Create widget
                                </a>
                              {/snippet}
                            </DropdownMenu.Item>
                          {/if}
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
</HomeLayout>
