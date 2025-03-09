<script lang="ts">
  import { Icon } from 'svelte-icons-pack';
  import {
    IoDocumentLockOutline,
    IoEllipsisHorizontal,
    IoGlobeOutline,
  } from 'svelte-icons-pack/io';
  import { FiEdit3, FiTrash2, FiRotateCcw } from 'svelte-icons-pack/fi';
  import * as Card from '$lib/components/ui/card/index';
  import { Badge } from '$lib/components/ui/badge/index';
  import { Progress } from '$lib/components/ui/progress/index';
  import { Button } from '$lib/components/ui/button/index';
  import type { Objective } from '$lib/server/db/schema';
  import { enhance } from '$app/forms';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import ConfirmDeleteDialog from '$lib/components/dialogs/ConfirmDeleteDialog.svelte';
  import CustomLogDialog from '$lib/components/dialogs/CustomLogDialog.svelte';
  import type { SuperValidated } from 'sveltekit-superforms';
  import type { LogFormSchema } from '$lib/components/forms/objective-log-form/schema';

  interface Props {
    objective: Objective;
    form: SuperValidated<LogFormSchema>;
  }

  const { objective, form }: Props = $props();

  // Function to calculate progress percentage for fixed goals
  function calculateProgress(objective: Objective): number {
    if (objective.goalType === 'fixed' && objective.endValue) {
      return Math.min(100, (objective.value / objective.endValue) * 100);
    }
    return 0;
  }
</script>

<Card.Root class="overflow-hidden transition-all">
  <Card.Header>
    <div class="flex items-center justify-between gap-4">
      <Card.Title class="line-clamp-1 text-lg">{objective.name}</Card.Title>
      <ConfirmDeleteDialog action="/objectives/delete" name="objectiveId" value={objective.id}>
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
              <DropdownMenu.Item class="w-full cursor-pointer !text-red-600 hover:!bg-red-600/5">
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
    <div class="flex items-center gap-2">
      <Badge variant={objective.goalType === 'fixed' ? 'outline' : 'secondary'} class="capitalize">
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
        <form action="?/log" method="POST" use:enhance>
          <input type="hidden" name="objectiveId" value={objective.id} />
          <input type="hidden" name="value" value="1" />
          <Button size="xs" variant="translucent" type="submit">
            +1 {objective.unit}
          </Button>
        </form>

        <form action="?/log" method="POST" use:enhance>
          <input type="hidden" name="objectiveId" value={objective.id} />
          <input type="hidden" name="value" value="5" />
          <Button size="xs" variant="translucent" type="submit">
            +5 {objective.unit}
          </Button>
        </form>

        <form action="?/log" method="POST" use:enhance>
          <input type="hidden" name="objectiveId" value={objective.id} />
          <input type="hidden" name="value" value="10" />
          <Button size="xs" variant="translucent" type="submit">
            +10 {objective.unit}
          </Button>
        </form>
      {:else}
        <form action="?/log" method="POST" use:enhance>
          <input type="hidden" name="objectiveId" value={objective.id} />
          <input type="hidden" name="value" value="1" />
          <Button size="xs" variant="translucent" type="submit">
            Log {objective.unit}
          </Button>
        </form>
      {/if}

      <form action="?/undoLog" method="POST" use:enhance>
        <input type="hidden" name="objectiveId" value={objective.id} />
        <Button
          size="xs"
          variant="outline"
          type="submit"
          class="flex items-center gap-1"
          title="Undo last log"
        >
          <Icon src={FiRotateCcw} size="14" />
          Undo
        </Button>
      </form>

      <div class="ml-auto">
        <CustomLogDialog {objective} {form} />
      </div>
    </div>
  </Card.Footer>
</Card.Root>
