<script lang="ts">
  import { dev } from '$app/environment';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import * as Card from '$lib/components/ui/card';
  import * as Select from '$lib/components/ui/select';
  import * as Tabs from '$lib/components/ui/tabs';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Button } from '$lib/components/ui/button';
  import { Switch } from '$lib/components/ui/switch';
  import ColorPickerInput from '$lib/components/inputs/ColorPickerInput.svelte';
  import type { WidgetJoinMetricsPreviewPlotData } from '$lib/server/db/schema';
  import {
    WIDGET_METRIC_CALCULATION_TYPES,
    WIDGET_METRIC_VALUE_DECIMAL_PRECISION_MAX,
  } from '$lib/components/forms/widget-form/schema';

  // Create a default widget config
  let config = $state<WidgetJoinMetricsPreviewPlotData>({
    title: 'GitHub Commits',
    subtitle: 'Last 10 days',
    textIcon: null,
    imageUrl: 'http://localhost:5174/icons/vscode-icons/folder_type_github.svg',
    imagePlacement: 'left',
    padding: 13,
    border: true,
    borderWidth: 1,
    borderRadius: 6,
    color: '#000000',
    accentColor: '#4fc59e',
    backgroundColor: '#ffffff',
    watermark: false,
    metrics: [
      {
        name: 'commits',
        value: 1235,
        calculationType: 'day',
        valueDecimalPrecision: 0,
        order: 1,
        plotData: {
          points: [
            { date: '2023-01-01', value: 100 },
            { date: '2023-01-02', value: 150 },
            { date: '2023-01-03', value: 120 },
            { date: '2023-01-04', value: 200 },
            { date: '2023-01-05', value: 180 },
            { date: '2023-01-06', value: 250 },
            { date: '2023-01-07', value: 300 },
            { date: '2023-01-08', value: 350 },
            { date: '2023-01-09', value: 280 },
            { date: '2023-01-10', value: 320 },
            { date: '2023-01-16', value: 486 },
            { date: '2023-01-17', value: 505 },
            { date: '2023-01-18', value: 523 },
            { date: '2023-01-19', value: 493 },
            { date: '2023-01-20', value: 463 },
            { date: '2023-01-21', value: 433 },
            { date: '2023-01-22', value: 500 },
            { date: '2023-01-23', value: 550 },
            { date: '2023-01-24', value: 600 },
            { date: '2023-01-25', value: 650 },
          ],
          timeRange: 'day',
        },
      },
      {
        name: 'PRs',
        value: 431,
        calculationType: 'day',
        valueDecimalPrecision: 0,
        order: 2,
        plotData: {
          points: [
            { date: '2023-01-01', value: 130 },
            { date: '2023-01-02', value: 150 },
            { date: '2023-01-03', value: 120 },
            { date: '2023-01-04', value: 200 },
            { date: '2023-01-05', value: 180 },
            { date: '2023-01-06', value: 250 },
            { date: '2023-01-07', value: 300 },
          ],
          timeRange: 'day',
        },
      },
    ],
  });

  let svgString = $state('');
  let svgUrl = $state('');
  let imageMode = $state(config.imageUrl ? 'url' : config.textIcon ? 'text-icon' : 'none');
  let isSvgCodeVisible = $state(false);
  let isConfigCodeVisible = $state(true);

  // Only allow this page in dev mode
  onMount(() => {
    if (!dev) {
      window.location.href = '/';
    }
    updatePreview();
  });

  async function updatePreview() {
    try {
      // Create URL for SVG preview
      const encodedConfig = encodeURIComponent(JSON.stringify(config));
      svgUrl = `/dev/widget-preview/api?config=${encodedConfig}&raw=1`;

      // Fetch SVG as string
      const response = await fetch(`/dev/widget-preview/api?config=${encodedConfig}`);
      const data = (await response.json()) as { svg: string };
      svgString = data.svg;
    } catch (error) {
      console.error('Failed to update preview:', error);
    }
  }

  // Update the preview whenever the config changes
  $effect(() => {
    updatePreview();
  });

  function addMetric() {
    // const newMetric = {
    //   name: `Metric ${config.metrics.length + 1}`,
    //   value: Math.floor(Math.random() * 1000),
    //   calculationType: 'day',
    //   valueDecimalPrecision: 0,
    //   order: config.metrics.length + 1,
    //   plotData: generateRandomPlotData('day'),
    // };
    // config.metrics = [...config.metrics, newMetric];
  }

  function removeMetric(index: number) {
    // config.metrics = config.metrics.filter((_, i) => i !== index);
    // // Update order
    // config.metrics = config.metrics.map((metric, i) => ({
    //   ...metric,
    //   order: i + 1,
    // }));
  }

  function generateRandomPlotData(timeRange: 'day' | 'week' | 'month' | 'year'): {
    points: { date: string; value: number }[];
    timeRange: string;
  } {
    const points = [];
    const now = new Date();

    let numPoints = 10;
    let formatString = 'yyyy-MM-dd';

    switch (timeRange) {
      case 'day':
        numPoints = 24;
        formatString = 'HH:mm';
        for (let i = 0; i < numPoints; i++) {
          const date = new Date(now);
          date.setHours(date.getHours() - (numPoints - i));
          // Create an upward trend with some noise
          const value = 100 + i * 10 + Math.random() * 20 - 10;
          points.push({
            date: `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`,
            value,
          });
        }
        break;

      case 'week':
        numPoints = 7;
        for (let i = 0; i < numPoints; i++) {
          const date = new Date(now);
          date.setDate(date.getDate() - (numPoints - i - 1));
          // Create a curve with some randomness
          const value = 300 + Math.sin((i / numPoints) * Math.PI) * 200 + Math.random() * 50 - 25;
          points.push({
            date: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`,
            value,
          });
        }
        break;

      case 'month':
        numPoints = 30;
        for (let i = 0; i < numPoints; i++) {
          const date = new Date(now);
          date.setDate(date.getDate() - (numPoints - i - 1));
          // Create a zigzag pattern
          const value = 500 + (i % 2 === 0 ? 100 : -100) + Math.random() * 50;
          points.push({
            date: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`,
            value,
          });
        }
        break;

      case 'year':
        numPoints = 12;
        for (let i = 0; i < numPoints; i++) {
          const date = new Date(now);
          date.setMonth(date.getMonth() - (numPoints - i - 1));
          // Upward trend with a dip in the middle
          const progress = i / (numPoints - 1);
          const value = 200 + progress * 800 - Math.sin(progress * Math.PI) * 300;
          points.push({
            date: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`,
            value,
          });
        }
        break;
    }

    return {
      points,
      timeRange,
    };
  }

  function configToString(cfg: typeof config): string {
    // Convert config to a JS object string with proper formatting
    return `${JSON.stringify(cfg, null, 2)
      .replace(/"([^"]+)":/g, '$1:') // Remove quotes from property names
      .replace(/"/g, "'") // Replace double quotes with single quotes for strings
      .replace(/null/g, 'null')},`;
  }
</script>

{#if dev}
  <div class="container mx-auto py-8">
    <h1 class="mb-6 text-3xl font-semibold">Widget Preview (Dev Mode)</h1>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Form -->
      <Card.Root class="p-6">
        <h2 class="mb-4 text-xl font-medium">Widget Configuration</h2>

        <div class="space-y-6">
          <!-- Basic -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium">Basic</h3>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <Label for="title">Title</Label>
                <Input id="title" bind:value={config.title} />
              </div>

              <div>
                <Label for="subtitle">Subtitle</Label>
                <Input id="subtitle" bind:value={config.subtitle} />
              </div>
            </div>

            <div class="space-y-4">
              <Label>Image</Label>
              <Tabs.Root value={imageMode} class="space-y-4">
                <Tabs.List class="w-full *:w-full">
                  <Tabs.Trigger
                    value="none"
                    onclick={() => {
                      imageMode = 'none';
                      config.imageUrl = null;
                      config.textIcon = null;
                    }}
                  >
                    None
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="text-icon"
                    onclick={() => {
                      imageMode = 'text-icon';
                      config.imageUrl = null;
                    }}
                  >
                    Text
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="url"
                    onclick={() => {
                      imageMode = 'url';
                      config.textIcon = null;
                      if (!config.imageUrl) config.imageUrl = '';
                    }}
                  >
                    URL
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="icon"
                    onclick={() => {
                      imageMode = 'icon';
                      config.textIcon = null;
                    }}
                  >
                    Icon
                  </Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="text-icon" class="space-y-4">
                  <div>
                    <Label for="textIcon">Text Icon (1-2 Capital Letters)</Label>
                    <Input
                      id="textIcon"
                      value={config.textIcon}
                      maxlength={2}
                      placeholder="AB"
                      oninput={(e) => {
                        if (e.currentTarget.value === '') {
                          config.textIcon = null;
                        } else {
                          config.textIcon = e.currentTarget.value.toUpperCase();
                        }
                      }}
                    />
                  </div>
                  <div class="space-y-2">
                    <Label>Placement</Label>
                    <Tabs.Root bind:value={config.imagePlacement}>
                      <Tabs.List class="w-full *:w-full">
                        <Tabs.Trigger value="left">Left</Tabs.Trigger>
                        <Tabs.Trigger value="right">Right</Tabs.Trigger>
                      </Tabs.List>
                    </Tabs.Root>
                  </div>
                </Tabs.Content>

                <Tabs.Content value="url" class="space-y-4">
                  <Input
                    id="imageUrl"
                    bind:value={config.imageUrl}
                    placeholder="https://example.com/icon.svg"
                  />
                  <div class="space-y-2">
                    <Label>Placement</Label>
                    <Tabs.Root bind:value={config.imagePlacement}>
                      <Tabs.List class="w-full *:w-full">
                        <Tabs.Trigger value="left">Left</Tabs.Trigger>
                        <Tabs.Trigger value="right">Right</Tabs.Trigger>
                      </Tabs.List>
                    </Tabs.Root>
                  </div>
                </Tabs.Content>

                <Tabs.Content value="icon" class="space-y-4">
                  {#if browser}
                    {#await import('$lib/components/inputs/IconPickerInput.svelte') then { default: IconPickerInput }}
                      <IconPickerInput bind:value={config.imageUrl} />
                    {/await}
                  {/if}
                  <div class="space-y-2">
                    <Label>Placement</Label>
                    <Tabs.Root bind:value={config.imagePlacement}>
                      <Tabs.List class="w-full *:w-full">
                        <Tabs.Trigger value="left">Left</Tabs.Trigger>
                        <Tabs.Trigger value="right">Right</Tabs.Trigger>
                      </Tabs.List>
                    </Tabs.Root>
                  </div>
                </Tabs.Content>
              </Tabs.Root>
            </div>
          </div>

          <!-- Styling -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium">Styling</h3>

            <div class="grid grid-cols-3 gap-4">
              <div>
                <Label for="color">Text Color</Label>
                <ColorPickerInput
                  id="color"
                  bind:value={config.color}
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
              </div>

              <div>
                <Label for="backgroundColor">Background Color</Label>
                <ColorPickerInput
                  id="backgroundColor"
                  bind:value={config.backgroundColor}
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
              </div>

              <div>
                <Label for="accentColor">Accent Color</Label>
                <ColorPickerInput id="accentColor" bind:value={config.accentColor} />
              </div>
            </div>

            <div class="grid grid-cols-3 gap-4">
              <div>
                <Label for="padding">Padding (px)</Label>
                <Input id="padding" type="number" min="0" max="30" bind:value={config.padding} />
              </div>

              <div>
                <Label for="borderRadius">Border Radius (px)</Label>
                <Input
                  id="borderRadius"
                  type="number"
                  min="0"
                  max="50"
                  bind:value={config.borderRadius}
                />
              </div>

              <div>
                <Label for="borderWidth">Border Width (px)</Label>
                <Input
                  id="borderWidth"
                  type="number"
                  min="0"
                  max="10"
                  bind:value={config.borderWidth}
                />
              </div>
            </div>

            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-2">
                <Switch id="border" bind:checked={config.border} />
                <Label for="border">Enable Border</Label>
              </div>

              <div class="flex items-center space-x-2">
                <Switch id="watermark" bind:checked={config.watermark} />
                <Label for="watermark">Show Watermark</Label>
              </div>
            </div>
          </div>

          <!-- Metrics -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium">Metrics</h3>
              <Button variant="outline" size="sm" onclick={addMetric}>Add Metric</Button>
            </div>

            {#each config.metrics as metric, index}
              <div class="rounded-lg border p-4">
                <div class="mb-2 flex items-center justify-between">
                  <h4 class="font-medium">Metric {index + 1}</h4>
                  <Button variant="destructive" size="sm" onclick={() => removeMetric(index)}>
                    Remove
                  </Button>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <Label for={`metric-${index}-name`}>Name</Label>
                    <Input id={`metric-${index}-name`} bind:value={metric.name} />
                  </div>

                  <div>
                    <Label for={`metric-${index}-value`}>Value</Label>
                    <Input
                      id={`metric-${index}-value`}
                      type="number"
                      step="0.01"
                      bind:value={metric.value}
                    />
                  </div>

                  <div class="space-y-1">
                    <Label for={`metric-${index}-calculationType`}>Calculation Type</Label>
                    <Select.Root type="single" bind:value={metric.calculationType}>
                      <Select.Trigger id={`metric-${index}-calculationType`} class="w-full">
                        {metric.calculationType}
                      </Select.Trigger>
                      <Select.Content>
                        {#each WIDGET_METRIC_CALCULATION_TYPES as calcType}
                          <Select.Item value={calcType} class="capitalize">
                            {calcType}
                          </Select.Item>
                        {/each}
                      </Select.Content>
                    </Select.Root>
                  </div>

                  <div>
                    <Label for={`metric-${index}-precision`}>Decimal Precision</Label>
                    <Select.Root
                      type="single"
                      value={metric.valueDecimalPrecision.toString()}
                      onValueChange={(value) => {
                        metric.valueDecimalPrecision = parseInt(value);
                      }}
                    >
                      <Select.Trigger id={`metric-${index}-precision`} class="w-full">
                        {metric.valueDecimalPrecision} digit{metric.valueDecimalPrecision !== 1
                          ? 's'
                          : ''}
                      </Select.Trigger>
                      <Select.Content>
                        {#each Array(WIDGET_METRIC_VALUE_DECIMAL_PRECISION_MAX + 1) as _, i}
                          <Select.Item value={i.toString()}>
                            {i} digit{i !== 1 ? 's' : ''}
                          </Select.Item>
                        {/each}
                      </Select.Content>
                    </Select.Root>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </Card.Root>

      <!-- Preview and code -->
      <div class="space-y-6">
        <Card.Root class="p-6">
          <h2 class="mb-4 text-xl font-medium">Preview (SVG)</h2>
          <div class="flex flex-col items-center justify-center rounded-lg border bg-gray-50 p-4">
            {#if svgUrl}
              <img src={svgUrl + '&svg=1'} alt="Widget preview" class="max-w-full" />
            {:else}
              <div class="h-32 w-full animate-pulse rounded-lg bg-gray-200"></div>
            {/if}
          </div>
        </Card.Root>

        <!-- <Card.Root class="p-6">
          <h2 class="mb-4 text-xl font-medium">Preview (HTML)</h2>
          <div class="flex flex-col items-center justify-center rounded-lg border bg-gray-50 p-4">
            {#if svgUrl}
              <iframe
                src={svgUrl}
                class="max-w-full"
                title="Widget preview"
                width="100%"
                height="100%"
              ></iframe>
            {:else}
              <div class="h-32 w-full animate-pulse rounded-lg bg-gray-200"></div>
            {/if}
          </div>
        </Card.Root> -->

        <Card.Root class="p-6">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-xl font-medium">SVG Code</h2>
            <Button
              variant="outline"
              size="sm"
              onclick={() => (isSvgCodeVisible = !isSvgCodeVisible)}
            >
              {isSvgCodeVisible ? 'Hide' : 'Show'} Code
            </Button>
          </div>
          {#if isSvgCodeVisible}
            <CodeBlock code={svgString} />
          {/if}
        </Card.Root>

        <Card.Root class="p-6">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-xl font-medium">Widget Configuration</h2>
            <Button
              variant="outline"
              size="sm"
              onclick={() => (isConfigCodeVisible = !isConfigCodeVisible)}
            >
              {isConfigCodeVisible ? 'Hide' : 'Show'} Code
            </Button>
          </div>
          {#if isConfigCodeVisible}
            <CodeBlock code={configToString(config)} />
          {/if}
        </Card.Root>
      </div>
    </div>
  </div>
{:else}
  <div class="container mx-auto py-8 text-center">
    <h1 class="text-2xl font-semibold">This page is only available in development mode</h1>
  </div>
{/if}
