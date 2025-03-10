<script lang="ts">
  import type { PageProps } from './$types';
  import { IoAdd, IoFolderOpenOutline } from 'svelte-icons-pack/io';
  import CreateNew from '$lib/components/CreateNew.svelte';
  import HomeLayout from '$lib/components/layouts/HomeLayout.svelte';
  import { HEADER_HEIGHT, SUB_NAV_HEIGHT } from '$lib/constants';
  import IconButton from '$lib/components/ui/IconButton.svelte';
  import ObjectiveCard from '$lib/components/cards/ObjectiveCard.svelte';
  import toast from 'svelte-french-toast';
  import { type SuperValidated } from 'sveltekit-superforms';
  import { type LogFormSchema } from '$lib/components/forms/objective-log-form/schema';

  const { data, form }: PageProps = $props();

  // Show toast message when form action completes successfully
  $effect(() => {
    if (form?.success && form?.message) {
      toast.success(form.message);
    }
  });
</script>

{#if data.objectives.length > 0}
  <HomeLayout container={false}>
    <div
      class="sticky flex items-center border-b bg-white"
      style="top: {HEADER_HEIGHT}px; height: {SUB_NAV_HEIGHT}px;"
    >
      <div class="mx-auto flex w-full max-w-screen-xl items-center justify-between px-6 lg:px-10">
        <div class="font-medium">Your Objectives</div>
        <IconButton href="/objectives/new" size="sm" icon={IoAdd}>New</IconButton>
      </div>
    </div>

    <div class="mx-auto w-full max-w-screen-xl p-6 lg:px-10">
      <div class="flex flex-wrap gap-6">
        {#each data.objectives as objective}
          <ObjectiveCard {objective} form={data.form as SuperValidated<LogFormSchema>} />
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
