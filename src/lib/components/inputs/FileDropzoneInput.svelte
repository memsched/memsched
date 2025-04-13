<script lang="ts">
  import { Icon } from 'svelte-icons-pack';
  import { OiUpload16 } from 'svelte-icons-pack/oi';

  import { cn } from '$lib/utils';

  interface Props {
    value: string | null;
    maxSize?: number;
  }

  let { value = $bindable(), maxSize = 5 * 1024 * 1024 }: Props = $props();

  let isDragging = $state(false);
  let inputRef: HTMLInputElement | null = null;

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > maxSize) {
      alert(`File size must be less than ${maxSize / 1024 / 1024}MB`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  function handleDragEnter(e: DragEvent) {
    e.preventDefault();
    isDragging = true;
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    isDragging = false;
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    isDragging = false;

    const file = e.dataTransfer?.files[0];
    if (file) {
      handleFile(file);
    }
  }

  function handleClick() {
    inputRef?.click();
  }

  function handleChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      handleFile(file);
    }
  }
</script>

<div
  class={cn(
    'relative flex min-h-[200px] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-6 py-10 text-center transition-colors hover:bg-muted/50',
    isDragging && 'bg-muted/50'
  )}
  ondragenter={handleDragEnter}
  ondragleave={handleDragLeave}
  ondragover={(e) => e.preventDefault()}
  ondrop={handleDrop}
  onclick={handleClick}
  onkeydown={(e) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  }}
  role="button"
  tabindex="0"
  aria-label="Upload image"
>
  <input type="file" class="hidden" accept="image/*" bind:this={inputRef} onchange={handleChange} />

  <div class="text-sm">
    <div class="flex flex-col items-center gap-1">
      {#if value}
        <img src={value} alt="Preview" class="max-h-32 w-auto object-contain" />
      {:else}
        <Icon src={OiUpload16} className="size-10 !text-muted-foreground" />
        <div class="text-base font-medium">Drop image here or click to upload</div>
        <p class="text-xs text-muted-foreground">
          PNG, JPG or GIF (max. {maxSize / 1024 / 1024}MB)
        </p>
      {/if}
    </div>
  </div>
</div>
