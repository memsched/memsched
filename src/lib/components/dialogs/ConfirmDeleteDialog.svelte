<script lang="ts">
  import { enhance } from '$app/forms';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import type { Snippet } from 'svelte';
  import { Button } from '../ui/button';

  interface Props {
    children: Snippet;
    action: string;
    name: string;
    value: any;
  }

  const { children, action, name, value }: Props = $props();
</script>

<Dialog.Root>
  {@render children()}
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Are you absolutely sure?</Dialog.Title>
    </Dialog.Header>
    <Dialog.Description>
      This action cannot be undone. This will permanently delete the objective.
    </Dialog.Description>
    <Dialog.Footer>
      <form {action} method="POST" use:enhance>
        <input type="hidden" {name} {value} />
        <Dialog.Close>
          {#snippet child({ props })}
            <Button type="submit" variant="destructive" {...props}>Delete</Button>
          {/snippet}
        </Dialog.Close>
      </form>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
