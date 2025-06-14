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
