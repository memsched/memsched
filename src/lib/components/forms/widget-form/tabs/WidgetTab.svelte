<script lang="ts">
  import * as Form from '$lib/components/ui/form';
  import * as Select from '$lib/components/ui/select';
  import { Input } from '$lib/components/ui/input';
  import { type Objective } from '$lib/server/db/schema';
  import {
    type FormSchema,
    WIDGET_METRIC_CALCULATION_TYPES,
    WIDGET_METRIC_VALUE_DECIMAL_PRECISION_MAX,
    GITHUB_STAT_TYPES,
  } from '../schema';
  import type { SuperForm, SuperFormData } from 'sveltekit-superforms/client';
  import type { Infer } from 'sveltekit-superforms/adapters';
  import Metric from '$lib/components/widgets/components/Metric.svelte';
  import PlotMetric from '$lib/components/widgets/components/PlotMetric.svelte';
  import HeatmapMetric from '$lib/components/widgets/components/HeatmapMetric.svelte';
  import WidgetTabStyleButton from './WidgetTabStyleButton.svelte';
  import { PLOT_DATA, HEATMAP_DATA } from '$lib/constants';

  interface Props {
    metricIndex: number;
    form: SuperForm<Infer<FormSchema>>;
    formData: SuperFormData<Infer<FormSchema>>;
    objectives: Objective[];
  }

  const { form, formData, metricIndex, objectives }: Props = $props();

  // Used to get calculation types for a specific objective
  function getCalculationTypesForObjective(objectiveId: string) {
    if (!objectiveId) return WIDGET_METRIC_CALCULATION_TYPES;

    const objective = objectives.find((o) => o.id === objectiveId);
    if (objective?.goalType === 'ongoing') {
      return WIDGET_METRIC_CALCULATION_TYPES.filter((ct) => ct !== 'percentage');
    }
    return WIDGET_METRIC_CALCULATION_TYPES;
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
          <Metric
            metric={{
              style: 'metric-base',
              value: 100,
              calculationType: 'all time',
              valueDecimalPrecision: 0,
              name: 'metric name',
              order: 1,
              plotData: {
                points: [],
              },
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
          <Metric
            metric={{
              style: 'metric-trend',
              value: 100,
              calculationType: 'all time',
              valueDecimalPrecision: 0,
              name: 'metric name',
              order: 1,
              plotData: {
                points: [],
              },
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
          <PlotMetric
            metric={{
              style: 'plot-base',
              value: 100,
              calculationType: 'all time',
              valueDecimalPrecision: 0,
              name: 'metric name',
              order: 1,
              plotData: PLOT_DATA,
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
          <PlotMetric
            metric={{
              style: 'plot-metric',
              value: 100,
              calculationType: 'all time',
              valueDecimalPrecision: 0,
              name: 'metric name',
              order: 1,
              plotData: PLOT_DATA,
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
          <HeatmapMetric
            metric={{
              style: 'heatmap-base',
              value: 100,
              calculationType: 'all time',
              valueDecimalPrecision: 1,
              name: 'metric name',
              order: 1,
              plotData: HEATMAP_DATA,
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
          <HeatmapMetric
            metric={{
              style: 'heatmap-metric',
              value: 100,
              calculationType: 'all time',
              valueDecimalPrecision: 1,
              name: 'metric name',
              order: 1,
              plotData: HEATMAP_DATA,
            }}
            accentColor="#32ad86"
          />
        </WidgetTabStyleButton>
      </div>
    </Form.Control>
  </Form.Field>

  <div class="grid grid-cols-6 gap-x-4 gap-y-2">
    <Form.Field {form} name="metrics[{metricIndex}].metricType" class="col-span-2">
      <Form.Control>
        {#snippet children({ props })}
          <Form.Label>Source</Form.Label>
          <Select.Root
            type="single"
            value={$formData.metrics[metricIndex].metricType ?? undefined}
            onValueChange={(value) => {
              $formData.metrics[metricIndex].metricType = (value ?? null) as any;
            }}
            name={props.name}
          >
            <Select.Trigger {...props} class="capitalize">
              {$formData.metrics[metricIndex].metricType ?? 'Select a source'}
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

    {#if $formData.metrics[metricIndex].metricType === 'objective'}
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
    {:else if $formData.metrics[metricIndex].metricType === 'github'}
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
                {#each GITHUB_STAT_TYPES as statType}
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

      <Form.Field {form} name="metrics[{metricIndex}].calculationType" class="col-span-2">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Duration</Form.Label>
            <Select.Root
              type="single"
              disabled={['repositories', 'followers'].includes(
                $formData.metrics[metricIndex].githubStatType ?? ''
              )}
              bind:value={$formData.metrics[metricIndex].calculationType}
              name={props.name}
            >
              <Select.Trigger {...props} class="capitalize">
                {$formData.metrics[metricIndex].calculationType}
              </Select.Trigger>
              <Select.Content>
                {#if $formData.metrics[metricIndex].metricType === 'objective'}
                  {#each getCalculationTypesForObjective($formData.metrics[metricIndex].objectiveId as unknown as string) as calcType}
                    <Select.Item value={calcType} label={calcType} class="capitalize" />
                  {/each}
                {:else}
                  {#each WIDGET_METRIC_CALCULATION_TYPES.filter((ct) => ct !== 'percentage') as calcType}
                    <Select.Item value={calcType} label={calcType} class="capitalize" />
                  {/each}
                {/if}
              </Select.Content>
            </Select.Root>
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      {#if $formData.metrics[metricIndex].metricType === 'objective'}
        <Form.Field {form} name="metrics[{metricIndex}].valueDecimalPrecision" class="col-span-2">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Decimal Precision</Form.Label>
              <Select.Root
                type="single"
                value={$formData.metrics[metricIndex].valueDecimalPrecision.toString()}
                onValueChange={(value) => {
                  $formData.metrics[metricIndex].valueDecimalPrecision = parseInt(value);
                }}
                name={props.name}
              >
                <Select.Trigger {...props}>
                  {$formData.metrics[metricIndex].valueDecimalPrecision +
                    ' digit' +
                    ($formData.metrics[metricIndex].valueDecimalPrecision === 1 ? '' : 's')}
                </Select.Trigger>
                <Select.Content>
                  {#each Array(WIDGET_METRIC_VALUE_DECIMAL_PRECISION_MAX + 1) as _, i}
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
