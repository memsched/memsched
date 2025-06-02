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
  import type { Snippet } from 'svelte';

  import { enhance } from '$app/forms';
  import * as Dialog from '$lib/components/ui/dialog';

  import LoadingButton from '../ui/LoadingButton.svelte';

  interface Props {
    children: Snippet;
    action: string;
    name: string;
    value: any;
    loading?: boolean;
  }

  let { children, action, name, value, loading = $bindable(false) }: Props = $props();
</script>

<Dialog.Root>
  {@render children()}
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Are you absolutely sure?</Dialog.Title>
    </Dialog.Header>
    <Dialog.Description>
      This action cannot be undone. This will permanently delete it.
    </Dialog.Description>
    <Dialog.Footer>
      <form
        {action}
        method="POST"
        use:enhance={() => {
          loading = true;
          return async ({ update }) => {
            loading = false;
            update();
          };
        }}
      >
        <input type="hidden" {name} {value} />
        <Dialog.Close>
          {#snippet child({ props })}
            <LoadingButton type="submit" variant="destructive" {loading} {...props}>
              Delete
            </LoadingButton>
          {/snippet}
        </Dialog.Close>
      </form>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
