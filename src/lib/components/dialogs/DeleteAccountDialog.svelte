<script lang="ts">
  import type { Snippet } from 'svelte';

  import { enhance } from '$app/forms';
  import * as Dialog from '$lib/components/ui/dialog';

  import { Button } from '../ui/button';
  import { Input } from '../ui/input';
  import { Label } from '../ui/label';
  import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

  interface Props {
    children: Snippet;
    action: string;
    name: string;
    value: string;
  }

  const { children, action, name, value }: Props = $props();

  let selectedReason = $state('');
  let otherReason = $state('');
  let isValid = $derived(
    selectedReason !== '' &&
      (selectedReason !== 'other' || (selectedReason === 'other' && otherReason.trim() !== ''))
  );

  const reasons = [
    { value: 'not_useful', label: 'Not useful for my needs' },
    { value: 'too_expensive', label: 'Too expensive' },
    { value: 'found_alternative', label: 'Found a better alternative' },
    { value: 'bugs_issues', label: 'Too many bugs or issues' },
    { value: 'privacy_concerns', label: 'Privacy concerns' },
    { value: 'other', label: 'Other reason' },
  ];
</script>

<Dialog.Root>
  {@render children()}
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Delete Account</Dialog.Title>
      <Dialog.Description>
        This action cannot be undone. Your account will be permanently deleted and all data will be
        anonymized.
      </Dialog.Description>
    </Dialog.Header>

    <form {action} method="POST" use:enhance class="space-y-6">
      <input type="hidden" {name} {value} />
      <input
        type="hidden"
        name="reason"
        value={selectedReason === 'other' ? otherReason : selectedReason}
      />

      <div class="space-y-4">
        <RadioGroup
          value={selectedReason}
          onValueChange={(val) => (selectedReason = val)}
          class="space-y-2"
        >
          {#each reasons as reason}
            <div class="flex items-center space-x-3">
              <RadioGroupItem value={reason.value} id={reason.value} />
              <Label for={reason.value}>{reason.label}</Label>
            </div>
          {/each}
        </RadioGroup>

        {#if selectedReason === 'other'}
          <div class="space-y-2">
            <Label for="otherReason">Please specify:</Label>
            <Input
              id="otherReason"
              bind:value={otherReason}
              placeholder="Tell us why you're leaving..."
            />
          </div>
        {/if}
      </div>

      <Dialog.Footer>
        <div class="flex justify-end gap-2">
          <Dialog.Close>
            <Button type="button" variant="outline">Cancel</Button>
          </Dialog.Close>
          <Button type="submit" variant="destructive" disabled={!isValid}>Delete Account</Button>
        </div>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
