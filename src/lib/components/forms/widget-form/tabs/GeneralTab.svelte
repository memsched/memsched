<script lang="ts">
  import { Icon } from 'svelte-icons-pack';
  import { IoDocumentLockOutline, IoGlobeOutline } from 'svelte-icons-pack/io';
  import type { Infer } from 'sveltekit-superforms/adapters';
  import type { SuperForm, SuperFormData } from 'sveltekit-superforms/client';

  import ColorPickerInput from '$lib/components/inputs/ColorPickerInput.svelte';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import * as RadioGroup from '$lib/components/ui/radio-group';
  import { Switch } from '$lib/components/ui/switch';

  import type { FormSchema } from '../schema';

  interface Props {
    form: SuperForm<Infer<FormSchema>>;
    formData: SuperFormData<Infer<FormSchema>>;
    titleInput: HTMLInputElement | null;
    subtitleInput: HTMLInputElement | null;
  }

  let { form, formData, titleInput = $bindable(), subtitleInput = $bindable() }: Props = $props();
</script>

<section class="space-y-6">
  <h2 class="h3">General</h2>
  <div class="grid grid-cols-2 gap-x-16 gap-y-6">
    <Form.Field {form} name="title" class="col-start-1">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Title*</Form.Label>
          <Input {...props} bind:value={$formData.title} bind:ref={titleInput} />
        {/snippet}
      </Form.Control>
      <Form.Description>Set the title for your widget.</Form.Description>
      <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="subtitle">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Subtitle*</Form.Label>
          <Input {...props} bind:value={$formData.subtitle} bind:ref={subtitleInput} />
        {/snippet}
      </Form.Control>
      <Form.Description>Set the subtitle for your widget.</Form.Description>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Fieldset {form} name="visibility" class="col-span-2 space-y-4">
      <Form.Legend>Visibility</Form.Legend>
      <RadioGroup.Root
        bind:value={$formData.visibility}
        class="flex flex-col space-y-3 *:flex *:items-center *:space-x-4"
        name="visibility"
      >
        <div>
          <Form.Control>
            {#snippet children({ props })}
              <RadioGroup.Item value="public" {...props} />
              <Form.Label class="flex gap-1.5">
                <Icon src={IoGlobeOutline} className="size-8 *:!stroke-[16px]" />
                <div class="flex flex-col gap-1.5">
                  <div class="font-medium">Public</div>
                  <div class="font-normal text-muted-foreground">
                    Share your progress with everyone
                  </div>
                </div>
              </Form.Label>
            {/snippet}
          </Form.Control>
        </div>
        <div>
          <Form.Control>
            {#snippet children({ props })}
              <RadioGroup.Item value="private" {...props} />
              <Form.Label class="flex gap-1.5">
                <Icon src={IoDocumentLockOutline} className="size-8 *:!stroke-[16px]" />
                <div class="flex flex-col gap-1.5">
                  <div class="font-medium">Private</div>
                  <div class="font-normal text-muted-foreground">
                    Keep your progress to yourself. The widget will be visible to you only.
                  </div>
                </div>
              </Form.Label>
            {/snippet}
          </Form.Control>
        </div>
      </RadioGroup.Root>
    </Form.Fieldset>
  </div>
</section>
<section class="space-y-6 first:space-y-3">
  <h3 class="h4">Customization</h3>
  <div class="grid grid-cols-3 gap-x-10 gap-y-6">
    <Form.Field {form} name="color">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Foreground Color</Form.Label>
          <ColorPickerInput
            {...props}
            bind:value={$formData.color}
            solids={['#000000', '#333333', '#666666', '#999999', '#cccccc', '#f2f2f2', '#ffffff']}
          />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="backgroundColor">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Background Color</Form.Label>
          <ColorPickerInput
            {...props}
            bind:value={$formData.backgroundColor}
            solids={[
              '#000000',
              '#333333',
              '#666666',
              '#999999',
              '#cccccc',
              '#f2f2f2',
              '#ffffff',
              '#ffffff00',
            ]}
            alpha
          />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="accentColor">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Accent Color</Form.Label>
          <ColorPickerInput {...props} bind:value={$formData.accentColor} />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
  </div>
  <div class="grid grid-cols-2 gap-x-10 gap-y-6">
    <Form.Field {form} name="borderRadius">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Border Radius</Form.Label>
          <Input
            {...props}
            type="number"
            value={$formData.borderRadius}
            oninput={(e) => {
              if (e.currentTarget.value === '') {
                $formData.borderRadius = 0;
              } else {
                $formData.borderRadius = parseInt(e.currentTarget.value);
              }
            }}
            min="0"
            max="50"
          />
        {/snippet}
      </Form.Control>
      <Form.Description>Set the roundness of the border in pixels.</Form.Description>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="padding">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Padding</Form.Label>
          <Input
            {...props}
            value={$formData.padding}
            oninput={(e) => {
              if (e.currentTarget.value === '') {
                $formData.padding = 0;
              } else {
                $formData.padding = parseInt(e.currentTarget.value);
              }
            }}
            type="number"
            min="0"
            max="30"
          />
        {/snippet}
      </Form.Control>
      <Form.Description>Set the roundness of the border in pixels.</Form.Description>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="border" class="flex items-center gap-3 space-y-0 py-2">
      <Form.Control>
        {#snippet children({ props })}
          <Switch {...props} bind:checked={$formData.border} />
          <Form.Label>Enable Border</Form.Label>
        {/snippet}
      </Form.Control>
    </Form.Field>
  </div>
</section>
