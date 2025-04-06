<script lang="ts">
  import { browser } from '$app/environment';
  import SuperDebug, { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import toast from 'svelte-french-toast';
  import * as Form from '$lib/components/ui/form';
  import { type Objective } from '$lib/server/db/schema';
  import { formSchema, type FormSchema } from './schema';
  import type { LocalUser } from '$lib/types';
  import { Icon } from 'svelte-icons-pack';
  import { IoInformationCircle, IoChevronForward } from 'svelte-icons-pack/io';
  import Widget from '$lib/components/widgets/Widget.svelte';
  import { SUB_NAV_HEIGHT, PLOT_DATA, HEATMAP_DATA } from '$lib/constants';
  import { FiPlus, FiX } from 'svelte-icons-pack/fi';
  import DashHeader from '$lib/components/headers/DashHeader.svelte';
  import { Button } from '$lib/components/ui/button';
  import TabNavLink from '$lib/components/headers/TabNavLink.svelte';
  import IconButton from '$lib/components/ui/IconButton.svelte';
  import GeneralTab from './tabs/GeneralTab.svelte';
  import ImageTab from './tabs/ImageTab.svelte';
  import WidgetTab from './tabs/WidgetTab.svelte';
  import { roundToDecimal } from '$lib/utils';

  interface Props {
    data: { form: SuperValidated<Infer<FormSchema>>; objectives: Objective[]; user: LocalUser };
    edit?: boolean;
  }

  const { data, edit = false }: Props = $props();

  type MetricTab = 'metric.1' | 'metric.2' | 'metric.3';
  let focusedTab = $state<'general.title' | 'general.subtitle' | 'image' | MetricTab>(
    'general.title'
  );

  const form = superForm(data.form, {
    validators: zodClient(formSchema),
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
        } else {
          console.log(result.data?.form?.errors);
        }
      }
    },
    onUpdated({ form }) {
      if (form.message) {
        toast.success(form.message);
      }
    },
  });
  const { form: formData, enhance } = form;

  let titleInput = $state<HTMLInputElement | null>(null);
  let subtitleInput = $state<HTMLInputElement | null>(null);
  let textIconInput = $state<HTMLInputElement | null>(null);
  let hasImage = $state<boolean>(false);
  let metricCount = $state<number>(0);
  const formDataImageUrl = $derived($formData.imageUrl);
  const widgetMetrics = $derived(
    $formData.metrics.map((m, i) => ({
      name: m.name,
      style: m.style,
      calculationType: m.calculationType,
      valueDecimalPrecision: m.valueDecimalPrecision,
      value: roundToDecimal(435.390453, m.valueDecimalPrecision),
      order: i,
      plotData: m.style.startsWith('plot') ? PLOT_DATA : HEATMAP_DATA,
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

  function onRemoveImage(e: MouseEvent) {
    e?.stopPropagation();
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

  function onRemoveMetric(e: MouseEvent, index: number) {
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

  function updateDefaultMetrics(count: number, index: number) {
    const currentCount = $formData.metrics.length;
    const metricsCopy = [...$formData.metrics];

    if (currentCount < count) {
      for (let i = currentCount; i < count; i++) {
        metricsCopy.push({
          name: null,
          style: 'metric-base',
          metricType: 'objective',
          objectiveId: '',
          calculationType: 'day',
          valueDecimalPrecision: 0,
          githubUsername: null,
          githubStatType: null,
        });
      }
    } else if (currentCount > count) {
      metricsCopy.splice(index, 1);
    }
    $formData.metrics = metricsCopy;
  }
</script>

<DashHeader>
  <Button variant="breadcrumb" size="xs" class="gap-3 pe-0" href="/widgets">
    Widgets
    <Icon src={IoChevronForward} className="!text-muted-foreground" />
  </Button>
  <div class="px-3 text-sm font-medium">New</div>
  <TabNavLink
    name="General"
    onclick={() => (focusedTab = 'general.title')}
    active={focusedTab === 'general.title' || focusedTab === 'general.subtitle'}
  />
  {#if hasImage}
    <TabNavLink name="Image" onclick={() => (focusedTab = 'image')} active={focusedTab === 'image'}>
      <button onclick={onRemoveImage} class="!text-zinc-400 hover:!text-foreground">
        <Icon src={FiX} />
      </button>
    </TabNavLink>
  {/if}
  {#each Array(metricCount) as _, i}
    <TabNavLink
      name={`Metric ${i + 1}`}
      onclick={() => (focusedTab = `metric.${i + 1}` as MetricTab)}
      active={focusedTab === `metric.${i + 1}`}
    >
      <button
        onclick={(e) => onRemoveMetric(e, i + 1)}
        class="!text-zinc-400 hover:!text-foreground"
      >
        <Icon src={FiX} />
      </button>
    </TabNavLink>
  {/each}
  {#if !hasImage}
    <IconButton
      onclick={onAddImage}
      size="xs"
      icon={FiPlus}
      variant="translucent"
      class="rounded-none">Image</IconButton
    >
  {/if}
  {#if metricCount < 3}
    <IconButton
      onclick={onAddMetric}
      size="xs"
      icon={FiPlus}
      variant="translucent"
      class="rounded-none">Metric</IconButton
    >
  {/if}
</DashHeader>

<form
  method="POST"
  use:enhance
  class="flex flex-grow"
  style="height: calc(100vh - {SUB_NAV_HEIGHT}px);"
>
  <div class="bg-dotted relative flex max-w-[60%] flex-grow items-center justify-center p-2">
    <div
      class="absolute left-2 right-2 top-2 flex items-center gap-3 rounded-lg border bg-muted p-3 text-sm"
    >
      <Icon
        src={IoInformationCircle}
        className="mt-0.5 size-5 flex-shrink-0 text-muted-foreground"
      />
      <div class="space-y-1">
        <p>Click on the gray areas to edit the individual components.</p>
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
      />
    </div>

    {#if edit}
      <Form.Button class="absolute bottom-4 left-1/2 -translate-x-1/2" type="submit">
        Update Widget
      </Form.Button>
    {:else}
      <Form.Button class="absolute bottom-4 left-1/2 -translate-x-1/2" type="submit">
        Create Widget
        <Icon src={FiPlus} className="size-4" />
      </Form.Button>
    {/if}
  </div>
  <div class="main-container w-1/2 space-y-16 overflow-y-scroll border-s bg-background py-8">
    {#if focusedTab === 'general.title' || focusedTab === 'general.subtitle'}
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
  </div>
</form>
