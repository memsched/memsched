<script lang="ts">
  import { Icon } from 'svelte-icons-pack';
  import * as shapes from './shapes';

  interface Props {
    name: any;
    size?: number;
    color?: string;
  }

  let { name, size = 24, color = 'currentColor' }: Props = $props();

  let shape = $derived(shapes[name as keyof typeof shapes]);
</script>

{#if shape}
  <span
    style="display: inline-flex; align-items: center; vertical-align: middle; color: #{color};"
    role="img"
  >
    <Icon src={shape} {size} />
  </span>
{/if}
