<script module lang="ts">
  export interface WidgetProps {
    title: string;
    subtitle: string;
    padding?: number;
    border?: boolean;
    borderRadius?: number;
    backgroundColor?: string;
  }
</script>

<script lang="ts">
  import Watermark from './svgs/Watermark.svelte';

  const {
    title,
    subtitle,
    padding = 1.2,
    border = true,
    borderRadius = 8,
    backgroundColor = 'white',
  }: WidgetProps = $props();
</script>

<div
  style:display="flex"
  style:flex-direction="column"
  style:justify-content="center"
  style:gap="0.3rem"
  style:padding="{padding}rem"
  style:margin="0.1rem"
  style:border={border ? '1px solid lightgray' : 'none'}
  style:border-radius="{borderRadius}px"
  style:background-color={backgroundColor}
>
  <Watermark />
  <div style:font-size="1.2rem" style:font-weight="700">
    {title}
  </div>
  <div style:font-size="0.8rem">{subtitle}</div>
</div>
