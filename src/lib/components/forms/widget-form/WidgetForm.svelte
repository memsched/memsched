<script lang="ts">
  import { browser } from '$app/environment';
  import SuperDebug, { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import toast from 'svelte-french-toast';
  import * as Form from '$lib/components/ui/form';
  import * as Select from '$lib/components/ui/select';
  import * as Tabs from '$lib/components/ui/tabs/index.js';
  import { Input } from '$lib/components/ui/input';
  import { capitalize, cn } from '$lib/utils';
  import { type Objective } from '$lib/server/db/schema';
  import { Label } from '$lib/components/ui/label';
  import ColorPickerInput from '$lib/components/inputs/ColorPickerInput.svelte';
  import { Switch } from '$lib/components/ui/switch';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import { Badge } from '$lib/components/ui/badge';
  import {
    formSchema,
    type FormSchema,
    WIDGET_METRIC_TIME_RANGES,
    WIDGET_METRIC_VALUE_DECIMAL_PRECISION_MAX,
  } from './schema';
  import { HEADER_HEIGHT } from '$lib/constants';
  import type { LocalUser } from '$lib/types';
  import IconPickerInput from '$lib/components/inputs/IconPickerInput.svelte';
  import { page } from '$app/state';

  interface Props {
    data: { form: SuperValidated<Infer<FormSchema>>; objectives: Objective[]; user: LocalUser };
    edit?: boolean;
  }

  // TODO: Add dark mode to widget with url param

  const { data, edit = false }: Props = $props();
  // This counter is used to force the real widget to re-render when the form
  // is updated in edit mode
  let updateCounter = $state(0);

  const form = superForm(data.form, {
    validators: zodClient(formSchema),
    resetForm: !edit,
    dataType: 'json',
    onUpdated({ form }) {
      if (form.message) {
        ++updateCounter;
        toast.success(form.message);
      }
    },
  });
  const { form: formData, enhance } = form;

  let previewLoaded = $state(false);

  $effect(() => {
    if (!$formData.objectiveId || !$formData.title) {
      previewLoaded = false;
    }
  });

  const metricsCount = $derived($formData.metrics.length);

  function updateDefaultMetrics(count: number) {
    const currentCount = $formData.metrics.length;
    const metricsCopy = [...$formData.metrics];
    if (currentCount < count) {
      for (let i = currentCount; i < count; i++) {
        metricsCopy.push({
          name: '',
          timeRange: 'day',
          valueDecimalPrecision: 0,
        });
      }
    } else if (currentCount > count) {
      metricsCopy.splice(count);
    }
    $formData.metrics = metricsCopy;
  }
</script>

<form method="POST" use:enhance class="relative grid w-full grid-cols-8 gap-x-16">
  <div class="col-span-5 space-y-16 last:space-y-6">
    <section class="space-y-6 first:space-y-3">
      <h3>General</h3>
      <div class="grid grid-cols-2 gap-x-16 gap-y-6">
        <Form.Field {form} name="objectiveId">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Objective*</Form.Label>
              <Select.Root type="single" bind:value={$formData.objectiveId} name={props.name}>
                <Select.Trigger {...props}>
                  {$formData.objectiveId
                    ? data.objectives.find((o) => o.id === $formData.objectiveId)?.name
                    : 'Select an objective'}
                </Select.Trigger>
                <Select.Content>
                  {#each data.objectives as objective}
                    <Select.Item value={objective.id} label={objective.name} />
                  {/each}
                </Select.Content>
              </Select.Root>
            {/snippet}
          </Form.Control>
          <Form.Description>
            Choose the objective that this widget will be linked to.
          </Form.Description>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Field {form} name="title" class="col-start-1">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Title*</Form.Label>
              <Input {...props} bind:value={$formData.title} />
            {/snippet}
          </Form.Control>
          <Form.Description>Set the title for your widget.</Form.Description>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Field {form} name="subtitle">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Subtitle</Form.Label>
              <Input {...props} bind:value={$formData.subtitle} />
            {/snippet}
          </Form.Control>
          <Form.Description>Set the subtitle for your widget.</Form.Description>
          <Form.FieldErrors />
        </Form.Field>

        <div class="col-span-2">
          <Label>Image</Label>
          <Tabs.Root value={$formData.imageUrl ? 'icon' : 'none'} class="mt-1 space-y-6">
            <Tabs.List class="w-full *:w-full">
              <Tabs.Trigger value="none" onclick={() => ($formData.imageUrl = null)}
                >None</Tabs.Trigger
              >
              <Tabs.Trigger value="icon">Icon</Tabs.Trigger>
              <Tabs.Trigger value="upload">Upload</Tabs.Trigger>
            </Tabs.List>
            <Form.Fieldset {form} name="imagePlacement" class="col-span-2">
              <input type="hidden" name="imagePlacement" bind:value={$formData.imagePlacement} />
              <Tabs.Content value="icon" class="space-y-6">
                <IconPickerInput bind:value={$formData.imageUrl} />
                <div class="space-y-2">
                  <Form.Legend>Placement</Form.Legend>
                  <Tabs.Root bind:value={$formData.imagePlacement}>
                    <Tabs.List class="w-full *:w-full">
                      <Tabs.Trigger value="left">Left</Tabs.Trigger>
                      <Tabs.Trigger value="right">Right</Tabs.Trigger>
                    </Tabs.List>
                    <Form.FieldErrors />
                  </Tabs.Root>
                </div>
              </Tabs.Content>
              <Tabs.Content value="upload" class="space-y-6">
                <div class="space-y-2">
                  <Form.Legend>Placement</Form.Legend>
                  <Tabs.Root bind:value={$formData.imagePlacement}>
                    <Tabs.List class="w-full *:w-full">
                      <Tabs.Trigger value="left">Left</Tabs.Trigger>
                      <Tabs.Trigger value="right">Right</Tabs.Trigger>
                    </Tabs.List>
                    <Form.FieldErrors />
                  </Tabs.Root>
                </div>
              </Tabs.Content>
            </Form.Fieldset>
          </Tabs.Root>
        </div>
      </div>
    </section>

    <section class="space-y-6 first:space-y-3">
      <h3>Metrics</h3>
      <div class="col-span-2">
        <Label>Number of Metrics</Label>
        <Tabs.Root value={metricsCount === 0 ? 'none' : metricsCount.toString()} class="mt-1">
          <Tabs.List class="w-full *:w-full">
            <Tabs.Trigger value="none" onmousedown={() => updateDefaultMetrics(0)}
              >None</Tabs.Trigger
            >
            <Tabs.Trigger value="1" onmousedown={() => updateDefaultMetrics(1)}>1</Tabs.Trigger>
            <Tabs.Trigger value="2" onmousedown={() => updateDefaultMetrics(2)}>2</Tabs.Trigger>
            <Tabs.Trigger value="3" onmousedown={() => updateDefaultMetrics(3)}>3</Tabs.Trigger>
          </Tabs.List>
          {#each [1, 2, 3] as i}
            <Tabs.Content value={i.toString()} class="space-y-4">
              {#if metricsCount === i}
                {#each Array(i) as _, j}
                  <div class="grid grid-cols-8 gap-4">
                    <Form.Field {form} name="metrics[{j}].name" class="col-span-4">
                      <Form.Control>
                        {#snippet children({ props })}
                          <Form.Label>Name</Form.Label>
                          <Input {...props} bind:value={$formData.metrics[j].name} />
                        {/snippet}
                      </Form.Control>
                      <Form.FieldErrors />
                    </Form.Field>

                    <Form.Field {form} name="metrics[{j}].timeRange" class="col-span-2">
                      <Form.Control>
                        {#snippet children({ props })}
                          <Form.Label>Time Range</Form.Label>
                          <Select.Root
                            type="single"
                            bind:value={$formData.metrics[j].timeRange}
                            name={props.name}
                          >
                            <Select.Trigger {...props}>
                              {capitalize($formData.metrics[j].timeRange)}
                            </Select.Trigger>
                            <Select.Content>
                              {#each WIDGET_METRIC_TIME_RANGES as timeRange}
                                <Select.Item value={timeRange} label={capitalize(timeRange)} />
                              {/each}
                            </Select.Content>
                          </Select.Root>
                        {/snippet}
                      </Form.Control>
                      <Form.FieldErrors />
                    </Form.Field>

                    <Form.Field {form} name="metrics[{j}].valueDecimalPrecision" class="col-span-2">
                      <Form.Control>
                        {#snippet children({ props })}
                          <Form.Label>Decimal Precision</Form.Label>
                          <Select.Root
                            type="single"
                            value={$formData.metrics[j].valueDecimalPrecision.toString()}
                            onValueChange={(value) => {
                              $formData.metrics[j].valueDecimalPrecision = parseInt(value);
                            }}
                            name={props.name}
                          >
                            <Select.Trigger {...props}>
                              {$formData.metrics[j].valueDecimalPrecision +
                                ' digit' +
                                ($formData.metrics[j].valueDecimalPrecision === 1 ? '' : 's')}
                            </Select.Trigger>
                            <Select.Content>
                              {#each Array(WIDGET_METRIC_VALUE_DECIMAL_PRECISION_MAX + 1) as _, i}
                                <Select.Item
                                  value={i.toString()}
                                  label={i + ' digit' + (i === 1 ? '' : 's')}
                                />
                              {/each}
                            </Select.Content>
                          </Select.Root>
                        {/snippet}
                      </Form.Control>
                      <Form.FieldErrors />
                    </Form.Field>
                  </div>
                {/each}
              {/if}
            </Tabs.Content>
          {/each}
        </Tabs.Root>
      </div>
    </section>
    <section class="space-y-6 first:space-y-3">
      <h3>Customization</h3>
      <div class="grid grid-cols-3 gap-x-10 gap-y-6">
        <Form.Field {form} name="color">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Foreground Color</Form.Label>
              <ColorPickerInput
                {...props}
                bind:value={$formData.color}
                solids={[
                  '#000000',
                  '#333333',
                  '#666666',
                  '#999999',
                  '#cccccc',
                  '#f2f2f2',
                  '#ffffff',
                ]}
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
      <Form.Field {form} name="watermark" class="flex items-center space-x-3 space-y-0 py-2">
        <Form.Control>
          {#snippet children({ props })}
            <Checkbox
              {...props}
              checked={!$formData.watermark}
              onCheckedChange={() => ($formData.watermark = !$formData.watermark)}
            />
            <Form.Label>Remove MEMsched Brand</Form.Label>
            <Badge>Pro</Badge>
          {/snippet}
        </Form.Control>
      </Form.Field>
    </section>
    {#if import.meta.env.VITE_DEBUG_FORMS === '1' && browser}
      <SuperDebug data={$formData} />
    {/if}
  </div>

  <div class="sticky col-span-3 h-fit space-y-4" style="top: calc({HEADER_HEIGHT}px + 2rem)">
    <h5>Preview</h5>
    <div class="space-y-4">
      {#if edit}
        <div>
          <small class="mb-1 ms-1 inline-block text-sm text-muted-foreground">Current</small>
          <img
            src="/api/widgets/{page.params.id}?svg&v={updateCounter}"
            alt="Current preview"
            class="max-h-[150px] object-contain object-left"
          />
        </div>
      {/if}
      <div>
        {#if formSchema.safeParse($formData).success}
          {#if edit}
            <small class="mb-1 ms-1 inline-block text-sm text-muted-foreground">New</small>
          {/if}
          <img
            src="/api/widgets/preview/{data.user.id}?config={btoa(JSON.stringify($formData))}"
            alt="Edit preview"
            class={cn('object-contain object-left', previewLoaded ? 'max-h-[150px]' : 'h-[150px]')}
            onload={() => (previewLoaded = true)}
          />
        {:else}
          <div
            class="grid h-[150px] place-items-center rounded-lg border bg-zinc-100 p-5 text-sm text-muted-foreground"
          >
            The widget will be visible as you complete the form
          </div>
        {/if}
      </div>
    </div>
    {#if edit}
      <Form.Button>Update Widget</Form.Button>
    {:else}
      <Form.Button>Create Widget</Form.Button>
    {/if}
  </div>
</form>
