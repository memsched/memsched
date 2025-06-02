<!--
MEMsched - A memory scheduling and objective tracking application.
Copyright (C) 2025 Leonard Cseres

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
-->
<script lang="ts">
  import { Icon } from 'svelte-icons-pack';
  import { FiPlusCircle } from 'svelte-icons-pack/fi';
  import { type SuperValidated } from 'sveltekit-superforms';

  import ObjectiveLogForm from '$lib/components/forms/objective-log-form/ObjectiveLogForm.svelte';
  import { type LogFormSchema } from '$lib/components/forms/objective-log-form/schema';
  import { Button } from '$lib/components/ui/button/index';
  import * as Dialog from '$lib/components/ui/dialog/index';
  import type { Objective } from '$lib/server/db/schema';

  interface Props {
    form: SuperValidated<LogFormSchema>;
    objective: Objective;
  }

  const { form, objective }: Props = $props();

  let open = $state(false);

  function handleSuccess() {
    open = false;
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger>
    {#snippet child({ ...props })}
      <Button
        size="xs"
        variant="secondary"
        class="flex items-center gap-1"
        {...props}
        onclick={() => (open = true)}
      >
        <Icon src={FiPlusCircle} size="14" />
        Custom
      </Button>
    {/snippet}
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Log Progress for {objective.name}</Dialog.Title>
      <Dialog.Description>
        Enter the amount of progress you want to log for this objective.
      </Dialog.Description>
    </Dialog.Header>
    <ObjectiveLogForm data={{ form }} {objective} onSuccess={handleSuccess} />
  </Dialog.Content>
</Dialog.Root>
