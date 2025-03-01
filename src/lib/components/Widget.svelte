<script module lang="ts">
  export interface WidgetProps {
    title: string;
    subtitle: string;
    padding?: number;
    borderRadius?: number;
  }
</script>

<script lang="ts">
  import Watermark from './svgs/Watermark.svelte';

  const { title, subtitle, padding = 1.5, borderRadius = 8 }: WidgetProps = $props();
</script>

<div
  style:display="flex"
  style:flex-direction="column"
  style:justify-content="center"
  style:gap="0.3rem"
  style:padding="{padding}rem"
  style:margin="0.1rem"
  style:border="1px solid lightgray"
  style:border-radius="{borderRadius}px"
>
  <Watermark />
  <div style:font-size="1.25rem" style:font-weight="700">
    {title}
  </div>
  <div style:font-size="0.8rem">{subtitle}</div>
</div>
