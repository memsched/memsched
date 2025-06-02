<!--
MEMsched - A memory scheduling and objective tracking application.
Copyright (C) 2025 Leonard Cseres

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
-->
<script lang="ts">
  import { cn } from '@memsched/ui/utils';
  import type { Snippet } from 'svelte';
  import type { Infer } from 'sveltekit-superforms/adapters';
  import type { SuperFormData } from 'sveltekit-superforms/client';

  import type { FormSchema } from '$lib/components/forms/widget-form/schema';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { type WidgetMetric } from '$lib/server/db/schema';

  interface Props {
    children: Snippet;
    metricIndex: number;
    formData: SuperFormData<Infer<FormSchema>>;
    style: WidgetMetric['style'];
    title: string;
    description: string;
    disabled?: boolean;
    disabledTooltip?: string;
  }

  const {
    children,
    metricIndex,
    formData,
    style,
    title,
    description,
    disabled = false,
    disabledTooltip = 'This metric is not available for this provider yet.',
  }: Props = $props();
</script>

<Tooltip.Provider disableHoverableContent delayDuration={100}>
  <Tooltip.Root>
    <Tooltip.Trigger>
      {#snippet child({ props })}
        <button
          {...props}
          {disabled}
          class={cn(
            'flex items-center justify-center overflow-hidden rounded-lg border p-4',
            $formData.metrics[metricIndex].style === style && 'border-primary',
            disabled && 'opacity-50'
          )}
          onclick={(e) => {
            e.preventDefault();
            $formData.metrics[metricIndex].style = style;
          }}
        >
          {@render children()}
        </button>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Content>
      {#if disabled && disabledTooltip}
        <div class="text-sm">{disabledTooltip}</div>
      {:else}
        <div class="text-sm font-medium">{title}</div>
        <div class="text-sm text-muted-foreground">{description}</div>
      {/if}
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
