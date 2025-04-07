<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { Infer } from 'sveltekit-superforms/adapters';
  import type { SuperFormData } from 'sveltekit-superforms/client';

  import type { FormSchema } from '$lib/components/forms/widget-form/schema';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { type WidgetMetric } from '$lib/server/db/schema';
  import { cn } from '$lib/utils';

  interface Props {
    children: Snippet;
    metricIndex: number;
    formData: SuperFormData<Infer<FormSchema>>;
    style: WidgetMetric['style'];
    title: string;
    description: string;
  }

  const { children, metricIndex, formData, style, title, description }: Props = $props();
</script>

<Tooltip.Provider disableHoverableContent delayDuration={100}>
  <Tooltip.Root>
    <Tooltip.Trigger>
      {#snippet child({ props })}
        <button
          {...props}
          class={cn(
            'flex items-center justify-center rounded-lg border p-4',
            $formData.metrics[metricIndex].style === style && 'border-primary'
          )}
          onclick={(e) => {
            e.preventDefault();
            $formData.metrics[metricIndex].style = style;
          }}
        >
          <!-- <div class="h4">{title}</div> -->
          {@render children()}
        </button>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Content>
      <div class="text-sm font-medium">{title}</div>
      <div class="text-sm text-muted-foreground">{description}</div>
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
