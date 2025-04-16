<script lang="ts">
  import { Icon } from 'svelte-icons-pack';
  import { BsBorderWidth } from 'svelte-icons-pack/bs';
  import { IoDocumentLockOutline, IoGlobeOutline } from 'svelte-icons-pack/io';
  import { TrOutlineBorderRadius, TrOutlineBoxPadding } from 'svelte-icons-pack/tr';
  import type { Infer } from 'sveltekit-superforms/adapters';
  import type { SuperForm, SuperFormData } from 'sveltekit-superforms/client';

  import ColorPickerInput from '$lib/components/inputs/ColorPickerInput.svelte';
  import SliderInput from '$lib/components/inputs/SliderInput.svelte';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import * as RadioGroup from '$lib/components/ui/radio-group';

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
          <ColorPickerInput {...props} bind:value={$formData.color} />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="backgroundColor">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Background Color</Form.Label>
          <ColorPickerInput {...props} bind:value={$formData.backgroundColor} alpha />
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

  <div class="grid grid-cols-3 gap-x-10 gap-y-6">
    <Form.Field {form} name="borderWidth">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Border Width</Form.Label>
          <SliderInput
            label="Border Width"
            min={0}
            max={10}
            step={1}
            icon={BsBorderWidth}
            {...props}
            bind:value={$formData.borderWidth}
          />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="borderRadius">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Border Radius</Form.Label>
          <SliderInput
            label="Border Radius"
            min={0}
            max={50}
            step={1}
            icon={TrOutlineBorderRadius}
            {...props}
            bind:value={$formData.borderRadius}
          />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="borderColor">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Border Color</Form.Label>
          <ColorPickerInput {...props} bind:value={$formData.borderColor} />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
  </div>

  <div class="grid grid-cols-2 gap-x-10 gap-y-6">
    <Form.Field {form} name="padding">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Padding</Form.Label>
          <SliderInput
            label="Padding"
            min={0}
            max={50}
            step={1}
            icon={TrOutlineBoxPadding}
            {...props}
            bind:value={$formData.padding}
          />
        {/snippet}
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
  </div>
</section>
