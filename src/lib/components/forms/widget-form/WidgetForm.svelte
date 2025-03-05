<script lang="ts">
  import { browser } from '$app/environment';
  import SuperDebug, { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { Icon } from 'svelte-icons-pack';
  import { IoDocumentLockOutline, IoGlobeOutline } from 'svelte-icons-pack/io';
  import toast from 'svelte-french-toast';
  import * as Form from '$lib/components/ui/form';
  import * as Select from '$lib/components/ui/select';
  import * as RadioGroup from '$lib/components/ui/radio-group';
  import * as Tabs from '$lib/components/ui/tabs/index.js';
  import { Input } from '$lib/components/ui/input';
  import { Textarea } from '$lib/components/ui/textarea';
  import { capitalize, cn } from '$lib/utils';
  import {
    formSchema,
    type FormSchema,
    WIDGET_METRIC_TIME_RANGES,
    WIDGET_METRIC_VALUE_DECIMAL_PRECISIONS,
  } from './schema';
  import { type Objective } from '$lib/server/db/schema';
  import { Label } from '$lib/components/ui/label';

  interface Props {
    data: { form: SuperValidated<Infer<FormSchema>>; objectives: Objective[] };
    edit?: boolean;
  }

  const { data, edit = false }: Props = $props();

  const form = superForm(data.form, {
    validators: zodClient(formSchema),
    resetForm: !edit,
    dataType: 'json',
    onUpdated({ form }) {
      if (form.message) {
        toast.success(form.message);
      }
    },
  });
  const { form: formData, enhance } = form;

  const metricsCount = $derived($formData.metrics.length);

  function updateDefaultMetrics(count: number) {
    const currentCount = $formData.metrics.length;
    const metricsCopy = [...$formData.metrics];
    if (currentCount < count) {
      for (let i = currentCount; i < count; i++) {
        metricsCopy.push({
          name: '',
          timeRange: 'day',
          valueDecimalPrecision: '0',
        });
      }
    } else if (currentCount > count) {
      metricsCopy.splice(count);
    }
    $formData.metrics = metricsCopy;
  }
</script>

<form method="POST" use:enhance class="grid w-full grid-cols-8">
  <div class="col-span-5 space-y-10">
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
              <Form.Label>Subitle</Form.Label>
              <Input {...props} bind:value={$formData.subtitle} />
            {/snippet}
          </Form.Control>
          <Form.Description>Set the subtitle for your widget.</Form.Description>
          <Form.FieldErrors />
        </Form.Field>

        <!-- <Form.Fieldset {form} name="imageUrl" class="col-span-2"> -->
        <!--   <Form.Legend>Type</Form.Legend> -->
        <!--   <Tabs.Root value={$formData.imageUrl ? 'upload' : 'none'}> -->
        <!--     <Tabs.List class="w-full *:w-full"> -->
        <!--       <Tabs.Trigger value="none">None</Tabs.Trigger> -->
        <!--       <Tabs.Trigger value="presets">Presets</Tabs.Trigger> -->
        <!--       <Tabs.Trigger value="upload">Upload</Tabs.Trigger> -->
        <!--     </Tabs.List> -->
        <!--     <Form.FieldErrors /> -->
        <!--     <Tabs.Content value="presets" class="space-y-6"></Tabs.Content> -->
        <!--     <Tabs.Content value="upload"></Tabs.Content> -->
        <!--   </Tabs.Root> -->
        <!-- </Form.Fieldset> -->
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
                            bind:value={$formData.metrics[j].valueDecimalPrecision}
                            name={props.name}
                          >
                            <Select.Trigger {...props}>
                              {$formData.metrics[j].valueDecimalPrecision}
                            </Select.Trigger>
                            <Select.Content>
                              {#each WIDGET_METRIC_VALUE_DECIMAL_PRECISIONS as prec}
                                <Select.Item value={prec} label={prec} />
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
      <div class="grid grid-cols-2 gap-x-16 gap-y-6">
        <Form.Field {form} name="accentColor">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Accent Color</Form.Label>
              <Input {...props} bind:value={$formData.accentColor} type="color" />
            {/snippet}
          </Form.Control>
          <Form.Description>Set the accent color for your widget.</Form.Description>
          <Form.FieldErrors />
        </Form.Field>
      </div>
    </section>
    {#if edit}
      <Form.Button>Update Widget</Form.Button>
    {:else}
      <Form.Button>Create Widget</Form.Button>
    {/if}
    {#if import.meta.env.VITE_DEBUG_FORMS && browser}
      <SuperDebug data={$formData} />
    {/if}
  </div>
</form>
