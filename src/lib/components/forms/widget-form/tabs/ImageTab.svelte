<script lang="ts">
  import type { Infer } from 'sveltekit-superforms/adapters';
  import type { SuperForm, SuperFormData } from 'sveltekit-superforms/client';

  import { browser } from '$app/environment';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Tabs from '$lib/components/ui/tabs';

  import type { FormSchema } from '../schema';

  interface Props {
    form: SuperForm<Infer<FormSchema>>;
    formData: SuperFormData<Infer<FormSchema>>;
    textIconInput: HTMLInputElement | null;
  }

  let { form, formData, textIconInput = $bindable() }: Props = $props();
</script>

<section class="space-y-6">
  <h2 class="h3">Image</h2>
  <div class="col-span-2">
    <Label>Type</Label>
    <Tabs.Root
      value={$formData.textIcon ? 'text-icon' : $formData.imageUrl ? 'icon' : 'text-icon'}
      class="mt-1 space-y-6"
    >
      <Tabs.List class="w-full *:w-full">
        <Tabs.Trigger
          onfocusin={() => {
            textIconInput?.focus();
          }}
          value="text-icon"
          onclick={() => {
            $formData.imageUrl = null;
          }}
        >
          Text
        </Tabs.Trigger>
        <Tabs.Trigger
          value="icon"
          onclick={() => {
            $formData.textIcon = null;
          }}
        >
          Icon
        </Tabs.Trigger>
      </Tabs.List>
      <Form.Fieldset {form} name="imagePlacement" class="col-span-2">
        <input type="hidden" name="imagePlacement" bind:value={$formData.imagePlacement} />
        <Tabs.Content value="text-icon" class="space-y-6">
          <div class="space-y-2">
            <Form.Legend>Placement</Form.Legend>
            <Tabs.Root bind:value={$formData.imagePlacement}>
              <Tabs.List class="w-full *:w-full">
                <Tabs.Trigger value="left">Left</Tabs.Trigger>
                <Tabs.Trigger value="right">Right</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </div>
          <Form.Field {form} name="textIcon">
            <Form.Control>
              {#snippet children({ props })}
                <Form.Label>Text Icon (1-2 Capital Letters)</Form.Label>
                <Input
                  {...props}
                  value={$formData.textIcon}
                  maxlength={2}
                  placeholder="AB"
                  bind:ref={textIconInput}
                  oninput={(e) => {
                    if (e.currentTarget.value === '') {
                      $formData.textIcon = null;
                    } else {
                      $formData.textIcon = e.currentTarget.value.toUpperCase();
                    }
                  }}
                />
              {/snippet}
            </Form.Control>
            <Form.Description>Enter 1 or 2 capital letters to use as a text icon.</Form.Description>
            <Form.FieldErrors />
          </Form.Field>
        </Tabs.Content>
        <Tabs.Content value="icon" class="space-y-6">
          <div class="space-y-2">
            <Form.Legend>Placement</Form.Legend>
            <Tabs.Root bind:value={$formData.imagePlacement}>
              <Tabs.List class="w-full *:w-full">
                <Tabs.Trigger value="left">Left</Tabs.Trigger>
                <Tabs.Trigger value="right">Right</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </div>
          {#if browser}
            {#await import('$lib/components/inputs/IconPickerInput.svelte') then { default: IconPickerInput }}
              <IconPickerInput bind:value={$formData.imageUrl} />
            {/await}
          {/if}
        </Tabs.Content>
      </Form.Fieldset>
    </Tabs.Root>
  </div>
</section>
