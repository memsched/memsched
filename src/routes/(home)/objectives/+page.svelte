<script lang="ts">
  import type { PageProps } from './$types';
  import { IoAdd, IoFolderOpenOutline, IoArrowForward } from 'svelte-icons-pack/io';
  import CreateNew from '$lib/components/CreateNew.svelte';
  import HomeLayout from '$lib/components/layouts/HomeLayout.svelte';
  import { HEADER_HEIGHT, SUB_NAV_HEIGHT } from '$lib/constants';
  import IconButton from '$lib/components/ui/IconButton.svelte';
  import ObjectiveCard from '$lib/components/cards/ObjectiveCard.svelte';
  import toast from 'svelte-french-toast';
  import { type SuperValidated } from 'sveltekit-superforms';
  import { type LogFormSchema } from '$lib/components/forms/objective-log-form/schema';
  import TabNavLink from '$lib/components/headers/TabNavLink.svelte';
  import type { Page } from '@sveltejs/kit';

  const { data, form }: PageProps = $props();

  // Show toast message when form action completes successfully
  $effect(() => {
    if (form?.success && form?.message) {
      toast.success(form.message);
    }
  });

  // Custom isActive functions for the tabs
  const isActiveTab = (page: Page) =>
    page.url.pathname === '/objectives' &&
    !page.url.searchParams.has('archived') &&
    !page.url.searchParams.has('completed');

  const isArchivedTab = (page: Page) => page.url.searchParams.has('archived');
  const isCompletedTab = (page: Page) => page.url.searchParams.has('completed');
</script>

<HomeLayout container={false}>
  <div
    class="sticky flex items-center border-b bg-background"
    style="top: {HEADER_HEIGHT}px; height: {SUB_NAV_HEIGHT}px;"
  >
    <div class="mx-auto flex w-full max-w-screen-xl items-center justify-between px-6 lg:px-10">
      <div class="flex gap-4">
        <TabNavLink name="Active" href="/objectives" isActive={isActiveTab} />
        <TabNavLink name="Completed" href="/objectives?completed" isActive={isCompletedTab} />
        <TabNavLink name="Archived" href="/objectives?archived" isActive={isArchivedTab} />
      </div>
      <IconButton href="/objectives/new" size="sm" icon={IoAdd} variant="translucent"
        >New</IconButton
      >
    </div>
  </div>
  {#if data.objectives.length > 0}
    <div class="mx-auto w-full max-w-screen-xl p-6 lg:px-10">
      <div class="flex flex-wrap gap-6">
        {#each data.objectives as objective}
          <ObjectiveCard {objective} form={data.form as SuperValidated<LogFormSchema>} />
        {/each}
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
