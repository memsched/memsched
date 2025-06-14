<script lang="ts">
  import type { Infer } from 'sveltekit-superforms/adapters';
  import type { SuperForm, SuperFormData } from 'sveltekit-superforms/client';

  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Select from '$lib/components/ui/select';
  import * as Tabs from '$lib/components/ui/tabs';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import HeatmapComponent from '$lib/components/widgets/components/HeatmapComponent.svelte';
  import PlotComponent from '$lib/components/widgets/components/PlotComponent.svelte';
  import ValueComponent from '$lib/components/widgets/components/ValueComponent.svelte';
  import { HEATMAP_DATA, PLOT_DATA } from '$lib/constants';
  import { type Objective } from '$lib/server/db/schema';

  import {
    type FormSchema,
    PLOT_CONFIGURATION,
    VALUE_CONFIGURATION,
    WIDGET_METRIC_DISPLAY_PRECISION_MAX,
    WIDGET_METRIC_GITHUB_STAT_TYPE,
    WIDGET_METRIC_PLOT_INTERVAL,
    WIDGET_METRIC_PLOT_PERIOD,
    WIDGET_METRIC_VALUE_PERIOD,
  } from '../schema';
  import WidgetTabStyleButton from './WidgetTabStyleButton.svelte';

  interface Props {
    metricIndex: number;
    form: SuperForm<Infer<FormSchema>>;
    formData: SuperFormData<Infer<FormSchema>>;
    objectives: Objective[];
  }

  const { form, formData, metricIndex, objectives }: Props = $props();

  const valuePercentDisabled = $derived(
    $formData.metrics[metricIndex].provider !== 'objective' ||
      objectives.find((o) => o.id === $formData.metrics[metricIndex].objectiveId)?.goalType !==
        'fixed'
  );

  $effect(() => {
    if (valuePercentDisabled) {
      $formData.metrics[metricIndex].valuePercent = false;
    }
  });
</script>

<section class="space-y-6 divide-y *:space-y-6 *:pt-6">
  <div>
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
                valueName: 'metric name',
                valuePercent: false,
                data: {
                  value: 100,
                },
                order: 1,
              }}
              color="#000000"
              accentColor={$formData.accentColor}
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
                valueName: 'metric name',
                valuePercent: false,
                data: {
                  value: 100,
                },
                order: 1,
              }}
              color="#000000"
              accentColor={$formData.accentColor}
            />
          </WidgetTabStyleButton>

          <WidgetTabStyleButton
            {metricIndex}
            {formData}
            style="plot-base"
            title="Minimal Plot"
            description="Use the plot style for this metric."
            disabled={$formData.metrics[metricIndex].provider === 'github'}
          >
            <PlotComponent
              metric={{
                style: 'plot-base',
                valueName: null,
                valuePercent: false,
                order: 1,
                data: PLOT_DATA,
              }}
              color="#000000"
              accentColor={$formData.accentColor}
            />
          </WidgetTabStyleButton>
          <WidgetTabStyleButton
            {metricIndex}
            {formData}
            style="plot-metric"
            title="Metric Plot"
            description="Use the plot style for this metric."
            disabled={$formData.metrics[metricIndex].provider === 'github'}
          >
            <PlotComponent
              metric={{
                style: 'plot-metric',
                valueName: 'metric name',
                valuePercent: false,
                data: {
                  value: 100,
                  ...PLOT_DATA,
                },
                order: 1,
              }}
              color="#000000"
              accentColor={$formData.accentColor}
            />
          </WidgetTabStyleButton>
          <WidgetTabStyleButton
            {metricIndex}
            {formData}
            style="heatmap-base"
            title="Minimal Heatmap"
            description="Use the heatmap style for this metric."
            disabled={$formData.metrics[metricIndex].provider === 'github'}
          >
            <HeatmapComponent
              metric={{
                style: 'heatmap-base',
                valueName: 'metric name',
                valuePercent: false,
                order: 1,
                data: {
                  ...HEATMAP_DATA,
                },
              }}
              color="#000000"
              accentColor={$formData.accentColor}
            />
          </WidgetTabStyleButton>
          <WidgetTabStyleButton
            {metricIndex}
            {formData}
            style="heatmap-metric"
            title="Metric Heatmap"
            description="Use the heatmap style for this metric."
            disabled={$formData.metrics[metricIndex].provider === 'github'}
          >
            <HeatmapComponent
              metric={{
                style: 'heatmap-metric',
                data: {
                  value: 100,
                  ...HEATMAP_DATA,
                },
                valueName: 'metric name',
                valuePercent: false,
                order: 1,
              }}
              color="#000000"
              accentColor={$formData.accentColor}
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
                if (value === 'objective') {
                  $formData.metrics[metricIndex].githubUsername = null;
                  $formData.metrics[metricIndex].githubStatType = null;
                } else {
                  if (
                    value === 'github' &&
                    !['metric-base', 'metric-trend'].includes($formData.metrics[metricIndex].style)
                  ) {
                    $formData.metrics[metricIndex].style = 'metric-base';
                  }
                  $formData.metrics[metricIndex].objectiveId = null;
                }
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
  </div>

  {#if VALUE_CONFIGURATION.includes($formData.metrics[metricIndex].style)}
    <div>
      <h3 class="h4">Metric</h3>
      <Form.Field {form} name="metrics[{metricIndex}].valueName" class="!mt-2">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Name</Form.Label>
            <Input {...props} bind:value={$formData.metrics[metricIndex].valueName} />
          {/snippet}
        </Form.Control>
        <Form.Description>An optional label for the metric.</Form.Description>
        <Form.FieldErrors />
      </Form.Field>

      <div>
        <Label>Metric Type</Label>
        <Tooltip.Provider disableHoverableContent delayDuration={100}>
          <Tooltip.Root>
            <Tooltip.Trigger disabled={!valuePercentDisabled} class="w-full">
              <Tabs.Root
                value={$formData.metrics[metricIndex].valuePercent && !valuePercentDisabled
                  ? 'percent'
                  : 'value'}
                onValueChange={(value) => {
                  $formData.metrics[metricIndex].valuePercent = value === 'percent';
                }}
                class="mt-1 space-y-6"
              >
                <Tabs.List class="w-full *:w-full">
                  <Tabs.Trigger value="value">Value</Tabs.Trigger>
                  <Tabs.Trigger value="percent" disabled={valuePercentDisabled}>
                    Percentage
                  </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="value" class="text-start">
                  <div class="grid grid-cols-2 gap-x-4 gap-y-2">
                    {#if $formData.metrics[metricIndex].provider === 'objective'}
                      <Form.Field {form} name="metrics[{metricIndex}].valueDisplayPrecision">
                        <Form.Control>
                          {#snippet children({ props })}
                            <Form.Label>Decimal Precision</Form.Label>
                            <Select.Root
                              type="single"
                              value={$formData.metrics[
                                metricIndex
                              ].valueDisplayPrecision.toString()}
                              onValueChange={(value) => {
                                $formData.metrics[metricIndex].valueDisplayPrecision =
                                  parseInt(value);
                              }}
                              name={props.name}
                            >
                              <Select.Trigger {...props}>
                                {$formData.metrics[metricIndex].valueDisplayPrecision +
                                  ' digit' +
                                  ($formData.metrics[metricIndex].valueDisplayPrecision === 1
                                    ? ''
                                    : 's')}
                              </Select.Trigger>
                              <Select.Content>
                                {#each Array(WIDGET_METRIC_DISPLAY_PRECISION_MAX + 1) as _, i}
                                  <Select.Item
                                    value={i.toString()}
                                    label={i + ' digit' + (i === 1 ? '' : 's')}
                                  />
                                {/each}
                              </Select.Content>
                            </Select.Root>
                          {/snippet}
                        </Form.Control>
                        <Form.Description
                          >The number of digits after the decimal point.</Form.Description
                        >
                        <Form.FieldErrors />
                      </Form.Field>
                    {/if}
                    <Form.Field {form} name="metrics[{metricIndex}].valuePeriod">
                      <Form.Control>
                        {#snippet children({ props })}
                          <Form.Label>Period</Form.Label>
                          <Select.Root
                            type="single"
                            disabled={['repositories', 'followers'].includes(
                              $formData.metrics[metricIndex].githubStatType ?? ''
                            )}
                            bind:value={$formData.metrics[metricIndex].valuePeriod}
                            name={props.name}
                          >
                            <Select.Trigger {...props} class="capitalize">
                              {$formData.metrics[metricIndex].valuePeriod === 'all time' ||
                              ['repositories', 'followers'].includes(
                                $formData.metrics[metricIndex].githubStatType ?? ''
                              )
                                ? 'All Time'
                                : 'Last ' + $formData.metrics[metricIndex].valuePeriod}
                            </Select.Trigger>
                            <Select.Content>
                              {#each WIDGET_METRIC_VALUE_PERIOD as valuePeriod}
                                <Select.Item
                                  value={valuePeriod}
                                  label={valuePeriod !== 'all time'
                                    ? 'Last ' + valuePeriod
                                    : 'All Time'}
                                  class="capitalize"
                                />
                              {/each}
                            </Select.Content>
                          </Select.Root>
                        {/snippet}
                      </Form.Control>
                      <Form.Description>How much to look back from now.</Form.Description>
                      <Form.FieldErrors />
                    </Form.Field>
                  </div>
                </Tabs.Content>
                <Tabs.Content value="percent" class="text-start">
                  <div class="grid grid-cols-2 gap-x-4 gap-y-2">
                    {#if $formData.metrics[metricIndex].provider === 'objective'}
                      <Form.Field {form} name="metrics[{metricIndex}].valueDisplayPrecision">
                        <Form.Control>
                          {#snippet children({ props })}
                            <Form.Label>Decimal Precision</Form.Label>
                            <Select.Root
                              type="single"
                              value={$formData.metrics[
                                metricIndex
                              ].valueDisplayPrecision.toString()}
                              onValueChange={(value) => {
                                $formData.metrics[metricIndex].valueDisplayPrecision =
                                  parseInt(value);
                              }}
                              name={props.name}
                            >
                              <Select.Trigger {...props}>
                                {$formData.metrics[metricIndex].valueDisplayPrecision +
                                  ' digit' +
                                  ($formData.metrics[metricIndex].valueDisplayPrecision === 1
                                    ? ''
                                    : 's')}
                              </Select.Trigger>
                              <Select.Content>
                                {#each Array(WIDGET_METRIC_DISPLAY_PRECISION_MAX + 1) as _, i}
                                  <Select.Item
                                    value={i.toString()}
                                    label={i + ' digit' + (i === 1 ? '' : 's')}
                                  />
                                {/each}
                              </Select.Content>
                            </Select.Root>
                          {/snippet}
                        </Form.Control>
                        <Form.Description
                          >The number of digits after the decimal point.</Form.Description
                        >
                        <Form.FieldErrors />
                      </Form.Field>
                    {/if}
                  </div>
                </Tabs.Content>
              </Tabs.Root>
            </Tooltip.Trigger>
            <Tooltip.Content class="w-fit text-sm">
              Percentage is only available for fixed objectives.
            </Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
    </div>
  {/if}

  {#if PLOT_CONFIGURATION.includes($formData.metrics[metricIndex].style)}
    <div>
      <h3 class="h4">Plot</h3>
      <div class="!mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
        <Form.Field {form} name="metrics[{metricIndex}].plotPeriod">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Period</Form.Label>
              <Select.Root
                type="single"
                bind:value={$formData.metrics[metricIndex].plotPeriod}
                name={props.name}
              >
                <Select.Trigger {...props} class="capitalize">
                  {$formData.metrics[metricIndex].plotPeriod === 'all time'
                    ? 'All Time'
                    : 'Last ' + $formData.metrics[metricIndex].plotPeriod}
                </Select.Trigger>
                <Select.Content>
                  {#each WIDGET_METRIC_PLOT_PERIOD as valuePeriod}
                    <Select.Item
                      value={valuePeriod}
                      label={valuePeriod !== 'all time' ? 'Last ' + valuePeriod : 'All Time'}
                      class="capitalize"
                    />
                  {/each}
                </Select.Content>
              </Select.Root>
            {/snippet}
          </Form.Control>
          <Form.Description>How much to look back from now.</Form.Description>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="metrics[{metricIndex}].plotInterval">
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Interval</Form.Label>
              <Select.Root
                type="single"
                bind:value={$formData.metrics[metricIndex].plotInterval}
                name={props.name}
              >
                <Select.Trigger {...props} class="capitalize">
                  {$formData.metrics[metricIndex].plotInterval}
                </Select.Trigger>
                <Select.Content>
                  {#each WIDGET_METRIC_PLOT_INTERVAL as valuePeriod}
                    <Select.Item value={valuePeriod} label={valuePeriod} class="capitalize" />
                  {/each}
                </Select.Content>
              </Select.Root>
            {/snippet}
          </Form.Control>
          <Form.Description>The interval of each point on the plot.</Form.Description>
          <Form.FieldErrors />
        </Form.Field>
      </div>
    </div>
  {/if}
</section>
