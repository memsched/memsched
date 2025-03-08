<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import ConfirmDeleteDialog from '$lib/components/dialogs/ConfirmDeleteDialog.svelte';
  import type { PageProps } from './$types';
  import IconButton from '$lib/components/ui/IconButton.svelte';
  import { IoArrowForward } from 'svelte-icons-pack/io';

  const { data }: PageProps = $props();
</script>

<div class="space-y-10">
  <div>
    <h2>Account Settings</h2>
    <p class="mt-2 text-muted-foreground">Manage your account settings and billing information.</p>
  </div>

  <!-- Billing Section -->
  <section class="space-y-3">
    <h3 class="text-2xl font-semibold">Billing</h3>
    <p>Your current plan is <span class="font-semibold">Free</span></p>
    <IconButton href="/settings/account/billing" icon={IoArrowForward} variant="outline">
      Go to Billing Settings
    </IconButton>
  </section>

  <!-- Delete Account Section -->
  <section class="space-y-3">
    <h3 class="text-2xl font-semibold text-destructive">Delete Account</h3>
    <p class="max-w-prose text-muted-foreground">
      Permanently delete your account and all associated data. This action cannot be undone and will
      remove all your objectives, widgets, and personal information from our system.
    </p>
    <ConfirmDeleteDialog action="?/deleteAccount" name="userId" value={data.user.id}>
      {#snippet children()}
        <Dialog.Trigger>
          <Button variant="destructive">Delete my account</Button>
        </Dialog.Trigger>
      {/snippet}
    </ConfirmDeleteDialog>
  </section>
</div>
