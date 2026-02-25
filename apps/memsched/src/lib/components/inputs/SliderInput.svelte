<script lang="ts">
  import { cn } from '@memsched/ui/utils';
  import { onDestroy } from 'svelte';
  import { Icon, type IconType } from 'svelte-icons-pack';

  import { Input } from '../ui/input';

  interface Props {
    label: string;
    min: number;
    max: number;
    step: number;
    value: number | undefined;
    icon: IconType;
    id?: string;
    sensitivity?: number;
  }

  let {
    label,
    min,
    max,
    step,
    value = $bindable(),
    icon,
    id = label.toLowerCase().replace(/\s+/g, '-'),
    sensitivity = 10,
  }: Props = $props();

  let isDragging = $state(false);
  let startX = $state(0);
  let startValue = $state(0);

  function handleMouseDown(event: MouseEvent) {
    isDragging = true;
    startX = event.clientX;
    startValue = value ?? min;
    event.preventDefault();
  }

  function handleMouseMove(event: MouseEvent) {
    if (!isDragging) return;
    const dx = event.clientX - startX;
    const change = Math.round(dx / sensitivity) * step;
    let newValue = startValue + change;

    newValue = Math.max(min, Math.min(max, newValue));

    newValue = Math.round(newValue / step) * step;

    const precision = step.toString().split('.')[1]?.length || 0;
    value = parseFloat(newValue.toFixed(precision));
  }

  function handleMouseUp() {
    if (isDragging) {
      isDragging = false;
    }
  }

  $effect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
      };
    }
  });

  onDestroy(() => {
    if (isDragging) {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
    }
  });
</script>

<div class="relative flex items-center">
  <div
    class={cn(
      'text-muted-foreground hover:text-foreground absolute inset-y-0 left-0 flex cursor-ew-resize items-center pr-1 pl-3 transition-colors',
      isDragging && 'text-foreground'
    )}
    onmousedown={handleMouseDown}
    role="slider"
    aria-valuemin={min}
    aria-valuemax={max}
    aria-valuenow={value}
    aria-label={`Drag to change ${label}`}
    tabindex="0"
  >
    <Icon src={icon} size={16} />
  </div>
  <Input type="number" {min} {max} {step} bind:value class="w-full pl-10" aria-describedby={id} />
</div>
