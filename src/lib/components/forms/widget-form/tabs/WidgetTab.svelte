<script lang="ts">
  import type { Infer } from 'sveltekit-superforms/adapters';
  import type { SuperForm, SuperFormData } from 'sveltekit-superforms/client';

  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import * as Select from '$lib/components/ui/select';
  import HeatmapComponent from '$lib/components/widgets/components/HeatmapComponent.svelte';
  import PlotComponent from '$lib/components/widgets/components/PlotComponent.svelte';
  import ValueComponent from '$lib/components/widgets/components/ValueComponent.svelte';
  import { HEATMAP_DATA, PLOT_DATA } from '$lib/constants';
  import { type Objective } from '$lib/server/db/schema';

  import {
    type FormSchema,
    WIDGET_METRIC_DISPLAY_PRECISION_MAX,
    WIDGET_METRIC_GITHUB_STAT_TYPE,
    WIDGET_METRIC_VALUE_AGGREGATION_TYPE,
  } from '../schema';
  import WidgetTabStyleButton from './WidgetTabStyleButton.svelte';

  interface Props {
    metricIndex: number;
    form: SuperForm<Infer<FormSchema>>;
    formData: SuperFormData<Infer<FormSchema>>;
    objectives: Objective[];
  }

  const { form, formData, metricIndex, objectives }: Props = $props();

  // Used to get calculation types for a specific objective
  function getCalculationTypesForObjective(objectiveId: string) {
    if (!objectiveId) return WIDGET_METRIC_VALUE_AGGREGATION_TYPE;

    const objective = objectives.find((o) => o.id === objectiveId);
    if (objective?.goalType === 'ongoing') {
      return WIDGET_METRIC_VALUE_AGGREGATION_TYPE.filter((ct) => ct !== 'percentage');
    }
    return WIDGET_METRIC_VALUE_AGGREGATION_TYPE;
  }
</script>

<section class="space-y-6">
  <h2 class="h3">Metric {metricIndex + 1}</h2>

  <Form.Field {form} name="metrics[{metricIndex}].style">
    <Form.Control>
      <input
        type="hidden"
        name="metrics[{metricIndex}].style"
        bind:value={$formData.metrics[metricIndex].style}
      />
      <Form.Label>Style</Form.Label>
      <div class="grid grid-cols-2 gap-x-4 gap-y-2">
        <WidgetTabStyleButton
          {metricIndex}
          {formData}
          style="metric-base"
          title="Metric"
          description="Use the metric style for this metric."
        >
          <ValueComponent
            metric={{
              style: 'metric-base',
              data: {
                value: 100,
              },
              valueAggregationType: 'all time',
              valueDisplayPrecision: 0,
              name: 'metric name',
              order: 1,
            }}
            accentColor="#32ad86"
          />
        </WidgetTabStyleButton>
        <WidgetTabStyleButton
          {metricIndex}
          {formData}
          style="metric-trend"
          title="Metric Trend"
          description="Use the metric trend style for this metric."
        >
          <ValueComponent
            metric={{
              style: 'metric-trend',
              data: {
                value: 100,
              },
              valueAggregationType: 'all time',
              valueDisplayPrecision: 0,
              name: 'metric name',
              order: 1,
            }}
            accentColor="#32ad86"
          />
        </WidgetTabStyleButton>

        <WidgetTabStyleButton
          {metricIndex}
          {formData}
          style="plot-base"
          title="Minimal Plot"
          description="Use the plot style for this metric."
        >
          <PlotComponent
            metric={{
              style: 'plot-base',
              valueAggregationType: 'all time',
              valueDisplayPrecision: 0,
              name: 'metric name',
              order: 1,
              data: PLOT_DATA,
            }}
            accentColor="#32ad86"
          />
        </WidgetTabStyleButton>
        <WidgetTabStyleButton
          {metricIndex}
          {formData}
          style="plot-metric"
          title="Metric Plot"
          description="Use the plot style for this metric."
        >
          <PlotComponent
            metric={{
              style: 'plot-metric',
              data: {
                value: 100,
                ...PLOT_DATA,
              },
              valueAggregationType: 'all time',
              valueDisplayPrecision: 0,
              name: 'metric name',
              order: 1,
            }}
            accentColor="#32ad86"
          />
        </WidgetTabStyleButton>
        <WidgetTabStyleButton
          {metricIndex}
          {formData}
          style="heatmap-base"
          title="Minimal Heatmap"
          description="Use the heatmap style for this metric."
        >
          <HeatmapComponent
            metric={{
              style: 'heatmap-base',
              valueAggregationType: 'all time',
              valueDisplayPrecision: 1,
              name: 'metric name',
              order: 1,
              data: {
                ...HEATMAP_DATA,
              },
            }}
            accentColor="#32ad86"
          />
        </WidgetTabStyleButton>
        <WidgetTabStyleButton
          {metricIndex}
          {formData}
          style="heatmap-metric"
          title="Metric Heatmap"
          description="Use the heatmap style for this metric."
        >
          <HeatmapComponent
            metric={{
              style: 'heatmap-metric',
              data: {
                value: 100,
                ...HEATMAP_DATA,
              },
              valueAggregationType: 'all time',
              valueDisplayPrecision: 1,
              name: 'metric name',
              order: 1,
            }}
            accentColor="#32ad86"
          />
        </WidgetTabStyleButton>
      </div>
    </Form.Control>
  </Form.Field>

  <div class="grid grid-cols-6 gap-x-4 gap-y-2">
    <Form.Field {form} name="metrics[{metricIndex}].provider" class="col-span-2">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Source</Form.Label>
          <Select.Root
            type="single"
            value={$formData.metrics[metricIndex].provider ?? undefined}
            onValueChange={(value) => {
              $formData.metrics[metricIndex].provider = (value ?? null) as any;
            }}
            name={props.name}
          >
            <Select.Trigger {...props} class="capitalize">
              {$formData.metrics[metricIndex].provider ?? 'Select a source'}
            </Select.Trigger>
            <Select.Content>
              {#if objectives.length > 0}
                <Select.Item value="objective" label="Objective" />
              {/if}
              <Select.Item value="github" label="GitHub" />
            </Select.Content>
          </Select.Root>
        {/snippet}
      </Form.Control>
      <Form.Description>Choose the source for this metric.</Form.Description>
      <Form.FieldErrors />
    </Form.Field>

    {#if $formData.metrics[metricIndex].provider === 'objective'}
      <Form.Field {form} name="metrics[{metricIndex}].objectiveId" class="col-span-4">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Objective*</Form.Label>
            <Select.Root
              type="single"
              onValueChange={(value) => {
                $formData.metrics[metricIndex].objectiveId = (value ?? null) as any;
              }}
              value={$formData.metrics[metricIndex].objectiveId ?? undefined}
              name={props.name}
            >
              <Select.Trigger {...props}>
                {$formData.metrics[metricIndex].objectiveId
                  ? objectives.find((o) => o.id === $formData.metrics[metricIndex].objectiveId)
                      ?.name
                  : 'Select an objective'}
              </Select.Trigger>
              <Select.Content>
                {#each objectives as objective}
                  <Select.Item value={objective.id} label={objective.name} />
                {/each}
              </Select.Content>
            </Select.Root>
          {/snippet}
        </Form.Control>
        <Form.Description>Choose the objective for this metric.</Form.Description>
        <Form.FieldErrors />
      </Form.Field>
    {:else if $formData.metrics[metricIndex].provider === 'github'}
      <Form.Field {form} name="metrics[{metricIndex}].githubUsername" class="col-span-2">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>GitHub Username*</Form.Label>
            <Input {...props} bind:value={$formData.metrics[metricIndex].githubUsername} />
          {/snippet}
        </Form.Control>
        <Form.Description>Enter the GitHub username for this metric.</Form.Description>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="metrics[{metricIndex}].githubStatType" class="col-span-2">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Stat Type*</Form.Label>
            <Select.Root
              type="single"
              value={$formData.metrics[metricIndex].githubStatType ?? undefined}
              onValueChange={(value) => {
                $formData.metrics[metricIndex].githubStatType = (value ?? null) as any;
              }}
              name={props.name}
            >
              <Select.Trigger {...props} class="capitalize">
                {$formData.metrics[metricIndex].githubStatType ?? 'Select a stat type'}
              </Select.Trigger>
              <Select.Content>
                {#each WIDGET_METRIC_GITHUB_STAT_TYPE as statType}
                  <Select.Item value={statType} label={statType} class="capitalize" />
                {/each}
              </Select.Content>
            </Select.Root>
          {/snippet}
        </Form.Control>
        <Form.Description>Select the type of GitHub statistics to display.</Form.Description>
        <Form.FieldErrors />
      </Form.Field>
    {/if}
  </div>

  <div class="grid grid-cols-6 gap-x-4 gap-y-2">
    {#if !['plot-base', 'heatmap-base'].includes($formData.metrics[metricIndex].style)}
      <Form.Field {form} name="metrics[{metricIndex}].name" class="col-span-2">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Name</Form.Label>
            <Input {...props} bind:value={$formData.metrics[metricIndex].name} />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="metrics[{metricIndex}].valueAggregationType" class="col-span-2">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Duration</Form.Label>
            <Select.Root
              type="single"
              disabled={['repositories', 'followers'].includes(
                $formData.metrics[metricIndex].githubStatType ?? ''
              )}
              bind:value={$formData.metrics[metricIndex].valueAggregationType}
              name={props.name}
            >
              <Select.Trigger {...props} class="capitalize">
                {$formData.metrics[metricIndex].valueAggregationType}
              </Select.Trigger>
              <Select.Content>
                {#if $formData.metrics[metricIndex].provider === 'objective'}
                  {#each getCalculationTypesForObjective($formData.metrics[metricIndex].objectiveId as unknown as string) as calcType}
                    <Select.Item value={calcType} label={calcType} class="capitalize" />
                  {/each}
                {:else}
                  {#each WIDGET_METRIC_VALUE_AGGREGATION_TYPE.filter((ct) => ct !== 'percentage') as calcType}
                    <Select.Item value={calcType} label={calcType} class="capitalize" />
                  {/each}
                {/if}
              </Select.Content>
            </Select.Root>
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      {#if $formData.metrics[metricIndex].provider === 'objective'}
        <Form.Field {form} name="metrics[{metricIndex}].valueDisplayPrecision" class="col-span-2">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Decimal Precision</Form.Label>
              <Select.Root
                type="single"
                value={$formData.metrics[metricIndex].valueDisplayPrecision.toString()}
                onValueChange={(value) => {
                  $formData.metrics[metricIndex].valueDisplayPrecision = parseInt(value);
                }}
                name={props.name}
              >
                <Select.Trigger {...props}>
                  {$formData.metrics[metricIndex].valueDisplayPrecision +
                    ' digit' +
                    ($formData.metrics[metricIndex].valueDisplayPrecision === 1 ? '' : 's')}
                </Select.Trigger>
                <Select.Content>
                  {#each Array(WIDGET_METRIC_DISPLAY_PRECISION_MAX + 1) as _, i}
                    <Select.Item value={i.toString()} label={i + ' digit' + (i === 1 ? '' : 's')} />
                  {/each}
                </Select.Content>
              </Select.Root>
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
      {/if}
    {/if}
  </div>
</section>
