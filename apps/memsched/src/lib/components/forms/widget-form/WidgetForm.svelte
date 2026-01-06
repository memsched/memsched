<script lang="ts">
  import toast from 'svelte-french-toast';
  import { Icon } from 'svelte-icons-pack';
  import { FiPlus, FiTrash2, FiX } from 'svelte-icons-pack/fi';
  import { IoChevronForward, IoInformationCircle } from 'svelte-icons-pack/io';
  import SuperDebug, { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
  import { zod4Client } from 'sveltekit-superforms/adapters';

  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import ConfirmDeleteDialog from '$lib/components/dialogs/ConfirmDeleteDialog.svelte';
  import DashHeader from '$lib/components/headers/DashHeader.svelte';
  import TabNavLink from '$lib/components/headers/TabNavLink.svelte';
  import ShareWidget from '$lib/components/ShareWidget.svelte';
  import { Button } from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import IconButton from '$lib/components/ui/IconButton.svelte';
  import LoadingButton from '$lib/components/ui/LoadingButton.svelte';
  import { Switch } from '$lib/components/ui/switch';
  import Widget from '$lib/components/widgets/Widget.svelte';
  import { SUB_NAV_HEIGHT } from '$lib/constants';
  import { type Objective } from '$lib/server/db/schema';
  import type { WidgetMetricData } from '$lib/server/services/metrics/types';
  import { updateState } from '$lib/state.svelte';
  import type { LocalUser, PartialBy } from '$lib/types';
  import { debounce } from '$lib/utils';
  import { explicitEffect } from '$lib/utils.svelte';

  import { type FormSchema, formSchema } from './schema';
  import GeneralTab from './tabs/GeneralTab.svelte';
  import ImageTab from './tabs/ImageTab.svelte';
  import WidgetTab from './tabs/WidgetTab.svelte';

  interface Props {
    data: { form: SuperValidated<Infer<FormSchema>>; objectives: Objective[]; user: LocalUser };
    edit?: boolean;
  }

  const { data, edit = false }: Props = $props();

  let widgetMode = $state<'light' | 'dark'>('light');

  type MetricTab = 'metric.1' | 'metric.2' | 'metric.3';
  // svelte-ignore state_referenced_locally
  let focusedTab = $state<'sharing' | 'general.title' | 'general.subtitle' | 'image' | MetricTab>(
    edit && data.form.data.visibility === 'public' ? 'sharing' : 'general.title'
  );

  const form = $derived(
    superForm(data.form, {
      validators: zod4Client(formSchema),
      resetForm: !edit,
      dataType: 'json',
      onResult({ result }) {
        if (result.type === 'failure') {
          if (result.data?.form?.errors?.title) {
            focusedTab = 'general.title';
          } else if (result.data?.form?.errors?.subtitle) {
            focusedTab = 'general.subtitle';
          } else if (result.data?.form?.errors?.imageUrl || result.data?.form?.errors?.textIcon) {
            focusedTab = 'image';
          } else if (result.data?.form?.errors?.metrics?.[0]) {
            focusedTab = 'metric.1';
          } else if (result.data?.form?.errors?.metrics?.[1]) {
            focusedTab = 'metric.2';
          } else if (result.data?.form?.errors?.metrics?.[2]) {
            focusedTab = 'metric.3';
          }
        }
      },
      onUpdated({ form }) {
        if (form.message) {
          toast.success(form.message);
        }
        updateState.widgetCounter++;
      },
    })
  );
  // svelte-ignore state_referenced_locally
  const { form: formData, enhance, submitting } = form;

  let formRef = $state<HTMLFormElement | null>(null);
  let titleInput = $state<HTMLInputElement | null>(null);
  let subtitleInput = $state<HTMLInputElement | null>(null);
  let textIconInput = $state<HTMLInputElement | null>(null);
  // svelte-ignore state_referenced_locally
  let hasImage = $state<boolean>(
    data.form.data.imageUrl !== null || data.form.data.textIcon !== null
  );
  // svelte-ignore state_referenced_locally
  let metricCount = $state<number>(data.form.data.metrics.length);
  const formDataImageUrl = $derived($formData.imageUrl);
  // svelte-ignore state_referenced_locally
  let widgetMetrics = $state<PartialBy<WidgetMetricData, 'data'>[]>(
    data.form.data.metrics.map((metric, i) => ({
      ...metric,
      order: i,
    }))
  );

  $effect(() => {
    if (focusedTab === 'general.title') {
      titleInput?.focus();
    } else if (focusedTab === 'general.subtitle') {
      subtitleInput?.focus();
    } else if (focusedTab === 'image') {
      if (formDataImageUrl === null) {
        textIconInput?.focus();
      }
    }
  });

  function onAddImage() {
    focusedTab = 'image';
    hasImage = true;
  }

  function onRemoveImage(e: UIEvent) {
    e.stopPropagation();
    hasImage = false;
    $formData.imageUrl = null;
    $formData.textIcon = null;
    if (focusedTab === 'image') {
      focusedTab = 'general.title';
    }
  }

  function onAddMetric() {
    metricCount++;
    focusedTab = `metric.${metricCount}` as MetricTab;
    updateDefaultMetrics(metricCount, metricCount - 1);
  }

  function onRemoveMetric(e: UIEvent, index: number) {
    e.stopPropagation();
    const n = index + 1;
    metricCount--;
    if (focusedTab === `metric.${n}`) {
      focusedTab = 'general.title';
    } else if (focusedTab === `metric.${n + 1}`) {
      focusedTab = `metric.${n}` as MetricTab;
    } else if (focusedTab === `metric.${n + 2}`) {
      focusedTab = `metric.${n + 1}` as MetricTab;
    }
    updateDefaultMetrics(metricCount, index);
  }

  function onMetricDrag(fromIndex: number, toIndex: number) {
    // Update metrics array
    const metricsCopy = [...$formData.metrics];
    const [movedMetric] = metricsCopy.splice(fromIndex, 1);
    metricsCopy.splice(toIndex, 0, movedMetric);
    $formData.metrics = metricsCopy;

    // Update widget metrics array
    const widgetMetricsCopy = [...widgetMetrics];
    const [movedWidgetMetric] = widgetMetricsCopy.splice(fromIndex, 1);
    widgetMetricsCopy.splice(toIndex, 0, movedWidgetMetric);
    widgetMetrics = widgetMetricsCopy;

    // Update the focused tab to follow the moved metric
    const currentTab = focusedTab;
    if (currentTab.startsWith('metric.')) {
      const currentMetricIndex = parseInt(currentTab.split('.')[1]) - 1;
      if (currentMetricIndex === fromIndex) {
        focusedTab = `metric.${toIndex + 1}` as MetricTab;
      } else if (currentMetricIndex > fromIndex && currentMetricIndex <= toIndex) {
        focusedTab = `metric.${currentMetricIndex}` as MetricTab;
      } else if (currentMetricIndex < fromIndex && currentMetricIndex >= toIndex) {
        focusedTab = `metric.${currentMetricIndex + 2}` as MetricTab;
      }
    }
  }

  function updateDefaultMetrics(count: number, index: number) {
    const currentCount = $formData.metrics.length;
    const metricsCopy = [...$formData.metrics];

    if (currentCount < count) {
      for (let i = currentCount; i < count; i++) {
        metricsCopy.push({
          style: 'metric-base',
          valueName: null,
          valuePeriod: 'day',
          valueDisplayPrecision: 0,
          valuePercent: false,
          plotPeriod: 'week',
          plotInterval: 'day',
          heatmapPeriod: 'month',
          heatmapInterval: 'day',
          ...(data.objectives.length > 0
            ? {
                provider: 'objective',
                objectiveId: '',
                githubUsername: null,
                githubStatType: null,
              }
            : {
                provider: 'github',
                objectiveId: null,
                githubUsername: '',
                githubStatType: 'commits',
              }),
        });
        widgetMetrics.push({
          style: 'metric-base',
          valueName: null,
          valuePercent: false,
          order: i,
        });
      }
    } else if (currentCount > count) {
      metricsCopy.splice(index, 1);
      widgetMetrics.splice(index, 1);
    }
    $formData.metrics = metricsCopy;
  }

  // Immediately update display fields for a metric
  function updateMetricDisplay(index: number, metric: Infer<FormSchema>['metrics'][number]) {
    widgetMetrics = widgetMetrics.map((m, i) =>
      i === index ? { ...m, ...metric, data: m.data } : m
    ) as WidgetMetricData[];
  }

  // Fetch data only for a specific metric
  async function updateMetricData(formData: Infer<FormSchema>, index: number) {
    const res = await fetch(
      `/api/widgets/preview/${data.user.id}?config=${btoa(
        JSON.stringify(formData.metrics)
      )}&metricIndex=${index}`
    );
    const widgetData: WidgetMetricData['data'][] = await res.json();
    const newMetric = {
      ...formData.metrics[index],
      data: widgetData[0],
      order: index,
    } as WidgetMetricData;
    widgetMetrics[index] = newMetric;
  }

  const debouncedShortUpdateMetricData = debounce((formData: Infer<FormSchema>, index: number) => {
    updateMetricData(formData, index);
  }, 50);

  const debouncedLongUpdateMetricData = debounce((formData: Infer<FormSchema>, index: number) => {
    updateMetricData(formData, index);
  }, 500);

  const METRIC_DEPENDENT_FIELDS: (keyof Infer<FormSchema>['metrics'][number])[] = [
    'style',
    'valuePeriod',
    'valueDisplayPrecision',
    'valuePercent',
    'plotPeriod',
    'plotInterval',
    'heatmapPeriod',
    'heatmapInterval',
    'provider',
    'objectiveId',
    'githubUsername',
    'githubStatType',
  ];

  const metricsLength = $derived($formData.metrics.length);
  const metricDeps = $derived($formData.metrics);
  const fromMetricsValid = $derived(() => {
    const result = formSchema.safeParse($formData);
    if (!result.error) return true;
    const metricsErrors = result.error.issues.filter((issue) => issue.path[0] === 'metrics');
    return metricsErrors.length === 0;
  });

  explicitEffect(
    () => {
      if (!fromMetricsValid) {
        return;
      }

      // For each metric, check what changed
      $formData.metrics.forEach((metric, index) => {
        const prevMetric = widgetMetrics[index];

        if (!('data' in prevMetric) || prevMetric.data === undefined) {
          widgetMetrics[index].data = undefined;
          updateMetricData($formData, index);
          return;
        }

        // Check if any data-dependent fields changed
        const dataFieldsChanged = METRIC_DEPENDENT_FIELDS.some(
          (field) =>
            prevMetric[field as keyof WidgetMetricData] !== metric[field as keyof typeof metric]
        );

        // If data-dependent fields changed, fetch new data
        if (dataFieldsChanged) {
          if (metric.provider === 'github') {
            widgetMetrics[index].data = undefined;
            debouncedLongUpdateMetricData($formData, index);
          } else {
            widgetMetrics[index].data = undefined;
            debouncedShortUpdateMetricData($formData, index);
          }
        }
        updateMetricDisplay(index, metric);
      });
    },
    () => [metricsLength, fromMetricsValid, metricDeps]
  );

  let deleteLoading = $state(false);
</script>

<DashHeader>
  <Button variant="breadcrumb" size="xs" class="gap-3 pe-0" href="/widgets">
    Widgets
    <Icon src={IoChevronForward} className="!text-muted-foreground" />
  </Button>
  <div class="px-3 text-sm font-medium">{edit ? 'Edit' : 'New'}</div>
  {#if edit && data.form.data.visibility === 'public'}
    <TabNavLink
      name="Sharing"
      onclick={() => (focusedTab = 'sharing')}
      active={focusedTab === 'sharing'}
    />
  {/if}
  <TabNavLink
    name="General"
    onclick={() => (focusedTab = 'general.title')}
    active={focusedTab === 'general.title' || focusedTab === 'general.subtitle'}
  />
  {#if hasImage}
    <TabNavLink name="Image" onclick={() => (focusedTab = 'image')} active={focusedTab === 'image'}>
      <span
        role="button"
        tabindex="0"
        onkeydown={(e) => {
          if (e.key === 'Enter') {
            onRemoveImage(e);
          }
        }}
        onclick={onRemoveImage}
        class="!text-zinc-400 hover:!text-foreground"
      >
        <Icon src={FiX} />
      </span>
    </TabNavLink>
  {/if}
  {#each Array(metricCount) as _, i}
    <TabNavLink
      name={`Metric ${i + 1}`}
      onclick={() => (focusedTab = `metric.${i + 1}` as MetricTab)}
      active={focusedTab === `metric.${i + 1}`}
    >
      <span
        role="button"
        tabindex="0"
        onkeydown={(e) => {
          if (e.key === 'Enter') {
            onRemoveMetric(e, i);
          }
        }}
        onclick={(e) => onRemoveMetric(e, i)}
        class="!text-zinc-400 hover:!text-foreground"
      >
        <Icon src={FiX} />
      </span>
    </TabNavLink>
  {/each}
  {#if !hasImage}
    <IconButton
      onclick={onAddImage}
      size="xs"
      icon={FiPlus}
      variant="translucent"
      class="rounded-none border-none">Image</IconButton
    >
  {/if}
  {#if metricCount < 3}
    <IconButton
      onclick={onAddMetric}
      size="xs"
      icon={FiPlus}
      variant="translucent"
      class="rounded-none border-none">Metric</IconButton
    >
  {/if}
</DashHeader>

<div class="flex flex-grow" style="height: calc(100vh - {SUB_NAV_HEIGHT}px);">
  <div class="bg-dotted relative flex max-w-[60%] flex-grow items-center justify-center p-2">
    <div class="absolute left-2 right-2 top-2 space-y-2">
      <div class="flex items-center gap-3 rounded-lg border bg-background p-3 text-sm">
        <Icon
          src={IoInformationCircle}
          className="mt-0.5 size-5 flex-shrink-0 text-muted-foreground"
        />
        <div class="space-y-1">
          <p>
            Click on the gray areas to edit the individual components. You can also drag and drop
            metrics to reorder them.
          </p>
        </div>
      </div>
      <div
        class="flex w-fit items-center gap-3 rounded-lg border bg-background p-3 text-sm font-medium"
      >
        <Switch
          checked={widgetMode === 'dark'}
          onCheckedChange={() => (widgetMode = widgetMode === 'dark' ? 'light' : 'dark')}
        />
        {widgetMode === 'dark' ? 'Dark' : 'Light'} Mode
      </div>
    </div>

    <div class="overflow-auto">
      <Widget
        {...$formData}
        metrics={widgetMetrics}
        watermark
        onTitleClick={() => {
          focusedTab = 'general.title';
        }}
        onSubtitleClick={() => {
          focusedTab = 'general.subtitle';
        }}
        onImageClick={hasImage
          ? () => {
              focusedTab = 'image';
            }
          : undefined}
        onImageClose={onRemoveImage}
        onMetricClick={(i) => {
          focusedTab = `metric.${i + 1}` as MetricTab;
        }}
        onMetricClose={onRemoveMetric}
        {onMetricDrag}
        dark={widgetMode === 'dark'}
      />
    </div>

    {#if edit}
      <div class="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        <LoadingButton
          type="submit"
          loading={$submitting}
          form="widget-form"
          onclick={() => formRef?.requestSubmit()}>Update Widget</LoadingButton
        >
        <ConfirmDeleteDialog
          action="/widgets/delete"
          name="widgetId"
          value={page.params.id}
          bind:loading={deleteLoading}
        >
          <Dialog.Trigger>
            {#snippet child({ props })}
              <LoadingButton
                variant="destructive"
                icon={FiTrash2}
                loading={deleteLoading}
                {...props}
              />
            {/snippet}
          </Dialog.Trigger>
        </ConfirmDeleteDialog>
      </div>
    {:else}
      <LoadingButton
        class="absolute bottom-4 left-1/2 -translate-x-1/2"
        type="submit"
        loading={$submitting}
        icon={FiPlus}
        form="widget-form"
        onclick={() => formRef?.requestSubmit()}
      >
        Create Widget
      </LoadingButton>
    {/if}
  </div>
  <form
    bind:this={formRef}
    method="POST"
    id="widget-form"
    use:enhance
    class="main-container w-1/2 space-y-16 overflow-y-scroll border-s bg-background py-8 pb-24"
  >
    {#if focusedTab === 'sharing'}
      <div class="space-y-6">
        <h2 class="h3">Sharing</h2>
        <ShareWidget
          title={data.form.data.title}
          subtitle={data.form.data.subtitle}
          username={data.user.username}
          widgetDark={widgetMode === 'dark'}
        />
      </div>
    {:else if focusedTab === 'general.title' || focusedTab === 'general.subtitle'}
      <GeneralTab {form} {formData} bind:titleInput bind:subtitleInput />
    {:else if focusedTab === 'image'}
      <ImageTab {form} {formData} bind:textIconInput />
    {:else if focusedTab.startsWith('metric')}
      <WidgetTab
        metricIndex={parseInt(focusedTab.split('.')[1]) - 1}
        {form}
        {formData}
        objectives={data.objectives}
      />
    {/if}
    {#if browser && import.meta.env.VITE_DEBUG_FORMS === '1' && import.meta.env.DEV}
      <SuperDebug data={$formData} />
    {/if}
  </form>
</div>
